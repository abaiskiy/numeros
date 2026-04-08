/**
 * Temporary in-memory order store.
 * Maps orderId → { type, email, name, birthDate, name2, date2 }
 * Entries expire after 2 hours to avoid memory leaks.
 */
const store = new Map();
const TTL_MS = 2 * 60 * 60 * 1000;

export function saveOrder(orderId, data) {
  store.set(String(orderId), { ...data, createdAt: Date.now() });
}

export function getOrder(orderId) {
  const entry = store.get(String(orderId));
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(String(orderId));
    return null;
  }
  return entry;
}
