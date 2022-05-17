export
type Pair = [string, string];

export
function pair_to_key(pair: Pair) {
  return pair.slice().sort((a, b) => a.localeCompare(b)).join('/');
}
