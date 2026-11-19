// Monotonic ids for query-builder filter rows, shared by the builder and the presets.
let filterSeq = 1

export const nextFilterId = () => filterSeq++
