import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { seedProperties } from "@/data/properties";
import { connectDB, isMongoReady } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";
import { PropertyModel } from "@/models/Property";
import { UserModel } from "@/models/User";
import {
  type AuthUser,
  type Enquiry,
  type EnquiryStatus,
  type Property,
  type PropertyInput,
  type UserRole,
} from "@/types";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  favoriteIds: string[];
}

interface LocalStore {
  users: StoredUser[];
  enquiries: Enquiry[];
  properties: Property[];
}

const STORE_PATH = path.join(process.cwd(), "data", "local-store.json");
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@aurelia.homes").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AureliaAdmin1!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Aurelia Studio";

let memoryStore: LocalStore | null = null;

const emptyStore = (): LocalStore => ({ users: [], enquiries: [], properties: [] });

function cloneStore(store: LocalStore): LocalStore {
  return {
    users: store.users.map((user) => ({ ...user, favoriteIds: [...user.favoriteIds] })),
    enquiries: store.enquiries.map((enquiry) => ({ ...enquiry })),
    properties: store.properties.map((property) => ({
      ...property,
      images: [...property.images],
      amenities: [...property.amenities],
      location: { ...property.location },
      agent: { ...property.agent },
    })),
  };
}

function normalizeEnquiry(enquiry: Enquiry): Enquiry {
  return {
    ...enquiry,
    status: enquiry.status ?? "new",
  };
}

async function readStore(): Promise<LocalStore> {
  if (memoryStore) return cloneStore(memoryStore);
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    const store: LocalStore = {
      users: parsed.users ?? [],
      enquiries: (parsed.enquiries ?? []).map(normalizeEnquiry),
      properties: parsed.properties ?? [],
    };
    memoryStore = cloneStore(store);
    return store;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: LocalStore) {
  memoryStore = cloneStore(store);
  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Netlify / serverless filesystems are read-only — keep the in-memory copy.
  }
}

function publicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    favoriteIds: user.favoriteIds,
  };
}

function fromMongoProperty(doc: {
  _id: { toString(): string };
  title: string;
  description: string;
  price: number;
  propertyType: Property["propertyType"];
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  furnished: boolean;
  location: Property["location"];
  images: string[];
  amenities: string[];
  status: Property["status"];
  agent: Property["agent"];
  createdAt: Date;
}): Property {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    propertyType: doc.propertyType,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    areaSqft: doc.areaSqft,
    furnished: doc.furnished,
    location: doc.location,
    images: doc.images,
    amenities: doc.amenities,
    status: doc.status,
    agent: doc.agent,
    createdAt: doc.createdAt.toISOString(),
  };
}

function fromMongoEnquiry(doc: {
  _id: { toString(): string };
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: Enquiry["source"];
  status?: EnquiryStatus;
  createdAt: Date;
}): Enquiry {
  return {
    id: doc._id.toString(),
    propertyId: doc.propertyId,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    message: doc.message,
    source: doc.source,
    status: doc.status ?? "new",
    createdAt: doc.createdAt.toISOString(),
  };
}

let seedPromise: Promise<void> | null = null;

export async function ensureSeed() {
  if (!seedPromise) {
    seedPromise = runSeed().finally(() => {
      seedPromise = null;
    });
  }
  await seedPromise;
}

async function runSeed() {
  await connectDB();

  if (isMongoReady()) {
    const propertyCount = await PropertyModel.countDocuments();
    if (propertyCount === 0) {
      await PropertyModel.insertMany(
        seedProperties.map(({ id: _id, createdAt, ...rest }) => ({
          ...rest,
          createdAt: new Date(createdAt),
        })),
      );
    }
    const admin = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      await UserModel.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: "admin",
        favoriteIds: [],
      });
    }
    return;
  }

  const store = await readStore();
  let changed = false;
  if (store.properties.length === 0) {
    store.properties = seedProperties;
    changed = true;
  }
  if (!store.users.some((user) => user.role === "admin" || user.email === ADMIN_EMAIL)) {
    store.users.push({
      id: "u_admin",
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: "admin",
      favoriteIds: [],
    });
    changed = true;
  }
  if (changed) await writeStore(store);
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}): Promise<AuthUser> {
  await ensureSeed();
  if (isMongoReady()) {
    const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existing) throw new Error("EMAIL_TAKEN");
    const created = await UserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      role: input.role ?? "user",
      favoriteIds: [],
    });
    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      role: created.role,
      favoriteIds: created.favoriteIds,
    };
  }

  const store = await readStore();
  if (store.users.some((user) => user.email === input.email.toLowerCase())) {
    throw new Error("EMAIL_TAKEN");
  }
  const user: StoredUser = {
    id: `u_${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    role: input.role ?? "user",
    favoriteIds: [],
  };
  store.users.push(user);
  await writeStore(store);
  return publicUser(user);
}

export async function findUserByEmail(email: string) {
  await ensureSeed();
  if (isMongoReady()) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name as string,
      email: user.email as string,
      passwordHash: user.passwordHash as string,
      role: user.role as UserRole,
      favoriteIds: user.favoriteIds as string[],
    };
  }

  const store = await readStore();
  return store.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  await ensureSeed();
  if (isMongoReady()) {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name as string,
      email: user.email as string,
      passwordHash: user.passwordHash as string,
      role: user.role as UserRole,
      favoriteIds: user.favoriteIds as string[],
    };
  }

  const store = await readStore();
  return store.users.find((user) => user.id === id) ?? null;
}

export async function toggleFavorite(userId: string, propertyId: string) {
  const user = await findUserById(userId);
  if (!user) throw new Error("NOT_FOUND");

  const has = user.favoriteIds.includes(propertyId);
  const next = has
    ? user.favoriteIds.filter((id) => id !== propertyId)
    : [...user.favoriteIds, propertyId];

  await connectDB();
  if (isMongoReady()) {
    await UserModel.findByIdAndUpdate(userId, { favoriteIds: next });
  } else {
    const store = await readStore();
    const stored = store.users.find((item) => item.id === userId);
    if (stored) stored.favoriteIds = next;
    await writeStore(store);
  }

  return { favoriteIds: next, saved: !has };
}

export async function createEnquiry(input: Omit<Enquiry, "id" | "createdAt" | "status"> & { status?: EnquiryStatus }) {
  const enquiry: Enquiry = {
    ...input,
    status: input.status ?? "new",
    id: `e_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await connectDB();
  if (isMongoReady()) {
    const created = await EnquiryModel.create({
      ...input,
      status: enquiry.status,
    });
    return {
      ...enquiry,
      id: created._id.toString(),
    };
  }

  const store = await readStore();
  store.enquiries.push(enquiry);
  await writeStore(store);
  return enquiry;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const docs = await EnquiryModel.find().sort({ createdAt: -1 }).lean();
    return docs.map(fromMongoEnquiry);
  }
  const store = await readStore();
  return [...store.enquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await connectDB();
  if (isMongoReady()) {
    const doc = await EnquiryModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!doc) return null;
    return fromMongoEnquiry(doc);
  }
  const store = await readStore();
  const enquiry = store.enquiries.find((item) => item.id === id);
  if (!enquiry) return null;
  enquiry.status = status;
  await writeStore(store);
  return enquiry;
}

export async function listStoredProperties(): Promise<Property[]> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const docs = await PropertyModel.find().sort({ createdAt: -1 }).lean();
    if (docs.length > 0) return docs.map(fromMongoProperty);
  }
  const store = await readStore();
  return store.properties.length > 0 ? store.properties : seedProperties;
}

export async function getStoredPropertyById(id: string): Promise<Property | null> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const doc = await PropertyModel.findById(id).lean().catch(() => null);
    if (doc) return fromMongoProperty(doc);
  }
  const store = await readStore();
  return store.properties.find((property) => property.id === id)
    ?? seedProperties.find((property) => property.id === id)
    ?? null;
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  await ensureSeed();
  const property: Property = {
    ...input,
    id: `p_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await connectDB();
  if (isMongoReady()) {
    const created = await PropertyModel.create(input);
    return fromMongoProperty(created.toObject ? created.toObject() : created);
  }

  const store = await readStore();
  store.properties.unshift(property);
  await writeStore(store);
  return property;
}

export async function updateProperty(id: string, input: PropertyInput): Promise<Property | null> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const doc = await PropertyModel.findByIdAndUpdate(id, input, { new: true }).lean();
    if (!doc) return null;
    return fromMongoProperty(doc);
  }
  const store = await readStore();
  const index = store.properties.findIndex((property) => property.id === id);
  if (index === -1) return null;
  const next: Property = {
    ...store.properties[index],
    ...input,
    id,
  };
  store.properties[index] = next;
  await writeStore(store);
  return next;
}

export async function deleteProperty(id: string): Promise<boolean> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const result = await PropertyModel.findByIdAndDelete(id);
    return Boolean(result);
  }
  const store = await readStore();
  const next = store.properties.filter((property) => property.id !== id);
  if (next.length === store.properties.length) return false;
  store.properties = next;
  await writeStore(store);
  return true;
}

export async function listUsers(): Promise<AuthUser[]> {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const users = await UserModel.find().lean();
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name as string,
      email: user.email as string,
      role: user.role as UserRole,
      favoriteIds: (user.favoriteIds as string[]) ?? [],
    }));
  }
  const store = await readStore();
  return store.users.map(publicUser);
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await ensureSeed();
  await connectDB();
  if (isMongoReady()) {
    const result = await UserModel.findByIdAndUpdate(userId, { passwordHash });
    return Boolean(result);
  }
  const store = await readStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) return false;
  user.passwordHash = passwordHash;
  await writeStore(store);
  return true;
}
