export function partySize(guest) {
  return 1 + (guest.has_plus_one || guest.hasPlusOne ? 1 : 0);
}

export function validateSeating(tables, guests) {
  if (!Array.isArray(tables) || tables.length > 200) throw new Error('Invalid seating plan.');
  const guestsById = new Map(guests.filter(g => g.status === 'Attending').map(g => [String(g.id), g]));
  const tableIds = new Set(), assigned = new Set();
  return tables.map(table => {
    if (!table || typeof table.id !== 'string' || !table.id || table.id.length > 100 || tableIds.has(table.id)) throw new Error('Invalid table identifier.');
    tableIds.add(table.id);
    if (typeof table.name !== 'string' || !table.name.trim() || table.name.length > 120 || !Number.isInteger(table.capacity) || table.capacity < 1 || table.capacity > 100 || !Array.isArray(table.guestIds)) throw new Error('Check the table name and capacity.');
    let seats = 0;
    const seatCounts = {};
    const guestIds = table.guestIds.map(id => {
      if (typeof id !== 'string' || !guestsById.has(id)) throw new Error('Only confirmed guests can be seated. Refresh your guest list.');
      if (assigned.has(id)) throw new Error('A guest cannot be assigned to two tables.');
      assigned.add(id);
      const count = table.seatCounts?.[id] ?? partySize(guestsById.get(id));
      if (!Number.isInteger(count) || count < partySize(guestsById.get(id)) || count > 100) throw new Error('Invalid number of seats for this response.');
      if (table.seatCounts?.[id] != null) seatCounts[id] = count;
      seats += count;
      return id;
    });
    if (seats > table.capacity) throw new Error(`Not enough seats at ${table.name}. Accompanying guests also need a seat.`);
    return { id: table.id, name: table.name.trim(), capacity: table.capacity, guestIds, ...(Object.keys(seatCounts).length ? { seatCounts } : {}) };
  });
}
