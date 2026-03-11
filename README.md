# Firefox Wasm Error Clone Repro

This is a minimal reproducer for a Firefox-specific bug involving `Error` values and the raw WebAssembly import path.

## How To Reproduce

Install dependencies and build the Wasm module:

```bash
npm install
npm run build
```

Serve the directory:

```bash
npm run serve
```

Open:

```text
http://127.0.0.1:8040/
```

The page renders a large DOM verdict automatically:

* `PASS`:
  * the browser handled all four cases correctly
* `FAIL`:
  * the browser reproduced the bug
  * specifically, the raw Wasm imported `Error` was not cloneable
* `UNEXPECTED RESULT`:
  * the browser did not match either the known healthy path or the known Firefox failure pattern

DevTools are not required.

If you want the raw details, in the browser console run:

```js
window.__raw_wasm_results
```

## Summary

The same JavaScript helper behaves differently depending on how it is entered:

* Direct JavaScript call:
  * `structuredClone(new Error("new error"))` succeeds.
* Raw WebAssembly import call:
  * the same helper creates the same `Error`
  * Firefox reports `DataCloneError: The object could not be cloned.`
* Plain objects do not show this behavior.

## Expected result

Healthy browsers show `PASS`.

Affected Firefox builds show `FAIL`, with these underlying results:

* `direct-raw-helper-error` => `structuredCloneOk: true`
* `raw-wasm-import-error` => `structuredCloneOk: false`
* `raw-wasm-import-error` => `cloneMessage: "DataCloneError: The object could not be cloned."`
* `direct-raw-helper-object` => `structuredCloneOk: true`
* `raw-wasm-import-object` => `structuredCloneOk: true`

## Files

* `module.wat`: tiny raw Wasm module with one imported function
* `build.js`: compiles `module.wat` to `module.wasm` using `wabt`
* `helper.js`: creates either an `Error` or a plain object and checks `structuredClone(...)`
* `worker.js`: compares direct JS entry with raw Wasm import entry
* `index.html`: launches the worker and exposes results as `window.__raw_wasm_results`
