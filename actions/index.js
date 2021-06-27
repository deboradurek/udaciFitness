export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const ADD_ENTRY = 'ADD_ENTRY';

export function receiveEntries(entries) {
  const normalisedEntries = Object.entries(entries).reduce(
    (acc, [key, entry]) => ({
      ...acc,
      [key]: entry.map((value) => ({ ...value, date: key })),
    }),
    {}
  );
  return {
    type: RECEIVE_ENTRIES,
    entries: normalisedEntries,
  };
}

export function addEntry(entry) {
  return {
    type: ADD_ENTRY,
    entry,
  };
}
