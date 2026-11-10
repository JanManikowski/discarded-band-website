/** Returns a copy of `list` with the item at `from` moved to `to`. */
export const moveItem = (list, from, to) => {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Short random id for list items (React keys / stable references). */
export const makeId = () => Math.random().toString(36).slice(2, 10);
