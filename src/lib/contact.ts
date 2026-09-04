export const STUDIO = {
  name: "Aurelia Dubai",
  phoneDisplay: "+971 50 412 8801",
  phoneHref: "tel:+971504128801",
  whatsapp: "971504128801",
  email: "hello@aurelia.homes",
};

export function whatsappHref(message?: string) {
  const text = message ?? "Hello Aurelia — I would like to view a home in Dubai.";
  return `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(text)}`;
}
