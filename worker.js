import { probe_value } from "./helper.js?v=1";

function capture(label, f) {
  try {
    return f();
  } catch (error) {
    return {
      label,
      threw: true,
      error: String(error?.stack || error),
    };
  }
}

async function main() {
  const response = await fetch("./module.wasm?v=1");
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, {
    env: {
      probe_value,
    },
  });

  const results = [
    probe_value("error", "direct-raw-helper-error"),
    capture("raw-wasm-import-error", () =>
      instance.exports.run_probe("error", "raw-wasm-import-error")
    ),
    probe_value("object", "direct-raw-helper-object"),
    capture("raw-wasm-import-object", () =>
      instance.exports.run_probe("object", "raw-wasm-import-object")
    ),
  ];

  self.postMessage({ ok: true, results });
}

main().catch((error) => {
  self.postMessage({
    ok: false,
    error: String(error?.stack || error),
  });
});
