const fs = require("node:fs/promises");
const path = require("node:path");
const wabtFactory = require("wabt");

async function main() {
  const wabt = await wabtFactory();
  const watPath = path.join(__dirname, "module.wat");
  const wasmPath = path.join(__dirname, "module.wasm");
  const wat = await fs.readFile(watPath, "utf8");
  const parsed = wabt.parseWat(watPath, wat, {
    reference_types: true,
  });
  const { buffer } = parsed.toBinary({
    write_debug_names: true,
  });
  await fs.writeFile(wasmPath, Buffer.from(buffer));
  console.log(`wrote ${wasmPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
