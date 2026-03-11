function summarize(label, value) {
  const summary = {
    label,
    string: "<stringify threw>",
    instanceofError: false,
    constructorName: "<none>",
    protoConstructorName: "<none>",
    tag: "<toString threw>",
    ownKeys: [],
    message: "<none>",
    stack: "<none>",
    structuredCloneOk: false,
    cloneMessage: "<none>",
  };

  try {
    summary.string = String(value);
  } catch (_error) {}
  try {
    summary.instanceofError = value instanceof Error;
  } catch (_error) {}
  try {
    summary.constructorName = value?.constructor?.name ?? "<none>";
  } catch (_error) {}
  try {
    summary.protoConstructorName = Object.getPrototypeOf(value)?.constructor?.name ?? "<none>";
  } catch (_error) {}
  try {
    summary.tag = Object.prototype.toString.call(value);
  } catch (_error) {}
  try {
    summary.ownKeys = Reflect.ownKeys(value).map(String);
  } catch (_error) {}
  try {
    if (value && typeof value.message !== "undefined") {
      summary.message = String(value.message);
    }
  } catch (_error) {}
  try {
    if (value && typeof value.stack !== "undefined") {
      summary.stack = String(value.stack);
    }
  } catch (_error) {}
  try {
    structuredClone(value);
    summary.structuredCloneOk = true;
  } catch (error) {
    summary.cloneMessage = String(error);
  }
  return summary;
}

function makeValue(kind) {
  if (kind === "error") {
    return new Error("new error");
  }
  if (kind === "object") {
    return { kind: "plain-object", message: "new error" };
  }
  throw new Error(`unknown kind: ${kind}`);
}

export function probe_value(kind, label) {
  return summarize(label, makeValue(kind));
}
