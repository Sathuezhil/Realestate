import { promises as fs } from "fs";
import path from "path";
import { connectDB, isMongoReady } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";
import { UserModel } from "@/models/User";
import { type AuthUser, type Enquiry, type UserRole } from "@/types";

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
}

const STORE_PATH = path.join(process.cwd(), "data", "local-store.json");

const emptyStore = (): LocalStore => ({ users: [], enquiries: [] });

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: LocalStore) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
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

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}): Promise<AuthUser> {
  await connectDB();
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
  await connectDB();
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
  await connectDB();
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

export async function createEnquiry(input: Omit<Enquiry, "id" | "createdAt">) {
  const enquiry: Enquiry = {
    ...input,
    id: `e_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await connectDB();
  if (isMongoReady()) {
    const created = await EnquiryModel.create(input);
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
