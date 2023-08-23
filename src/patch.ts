import {
  Text,
  insertAt,
  next,
  type Doc,
  type Patch,
} from "@automerge/automerge";
import {
  getProperty,
  isPlainObject,
  isTextObject,
  setProperty,
} from "./helpers";

export function patch<T>(doc: Doc<T>, patch: Patch) {
  if (patch.action === "insert") {
    const [index, ...path] = [...patch.path].reverse();

    const value = getProperty(doc, path.reverse().join(".")) as
      | string
      | Text
      | any[];

    if (typeof value === "string") {
      setProperty(
        doc,
        path.reverse().join("."),
        new Text(
          value.slice(0, Number(index)) +
          patch.values.join("") +
          value.slice(Number(index))
        )
      );
      return;
    }

    if (isTextObject(value)) {
      value.insertAt(Number(index), ...patch.values);
      return;
    }

    insertAt(value, Number(index), ...patch.values);

    return;
  }

  if (patch.action === "del") {
    const [index, ...path] = [...patch.path].reverse();

    const value: any = getProperty(doc, path.reverse().join("."));

    if (typeof value === "string") {
      next.splice(doc, path, index as number, patch.length || 1);

      return;
    }

    if (isPlainObject(value)) {
      delete value[index];
      return;
    }

    value.deleteAt(Number(index), patch.length || 1);
    return;
  }

  if (patch.action === "put") {
    setProperty(doc, patch.path.join("."), patch.value);
    return;
  }

  if (patch.action === "inc") {
    const value: any = getProperty(doc, patch.path.join("."));
    value.increment(patch.value);
    return;
  }

  if (patch.action === "splice") {
    next.splice(
      doc,
      patch.path.slice(0, -1),
      patch.path.at(-1) as number,
      0,
      patch.value
    );

    return;
  }

  throw new Error(`Unknown patch action: ${(patch as any).action}`);
}

export function patchObject<T>(doc: Doc<T>, patch: Patch) {
  if (patch.action === "insert") {
    const [index, ...path] = [...patch.path].reverse();

    const value = getProperty(doc, path.reverse().join(".")) as
      | string
      | Text
      | any[];

    if (typeof value === "string") {
      setProperty(
        doc,
        path.reverse().join("."),
        new Text(
          value.slice(0, Number(index)) +
          patch.values.join("") +
          value.slice(Number(index))
        )
      );
      return;
    }

    if (isTextObject(value)) {
      value.insertAt(Number(index), ...patch.values);
      return;
    }

    value.splice(Number(index), 0, ...patch.values);
    // insertAt(value, Number(index), ...patch.values);

    return;
  }

  if (patch.action === "del") {
    const [index, ...path] = [...patch.path].reverse();

    const value: unknown = getProperty(doc, path.reverse().join("."));

    if (typeof value === "string") {
      const [index, key, ...parentPath] = [...patch.path].reverse();
      let parentValue = getProperty(doc, parentPath.reverse().join("."));
      if (parentValue === undefined) {
        parentValue = doc;
      }

      const newValue = [...value]
      newValue.splice(Number(index), patch.length || 1)
      parentValue[key] = newValue.join("");

      return;
    }

    if (isPlainObject(value)) {
      delete value[index];
      return;
    }

    if (isTextObject(value)) {
      value.deleteAt(Number(index), patch.length || 1);
      return
    }

    if (Array.isArray(value)) {
      value.splice(Number(index), patch.length || 1)
      return
    }

    throw new Error(`cannot apply del: ${patch.path.join(".")}`)
  }

  if (patch.action === "put") {
    setProperty(doc, patch.path.join("."), patch.value);
    return;
  }

  if (patch.action === "inc") {
    const value: any = getProperty(doc, patch.path.join("."));
    value.increment(patch.value);
    return;
  }

  if (patch.action === "splice") {
    const [index, ...path] = [...patch.path].reverse();
    const value: string | Array<unknown> = getProperty(doc, path.reverse().join("."));

    if (typeof value === "string") {
      const [index, key, ...parentPath] = [...patch.path].reverse();
      let parentValue = getProperty(doc, parentPath.reverse().join("."));
      if (parentValue === undefined) {
        parentValue = doc;
      }

      const newValue = [...value]
      newValue.splice(Number(index), 0, patch.value)
      parentValue[key] = newValue.join("");
    } else {
      value.splice(Number(index), 0, patch.value)
    }

    return;
  }

  throw new Error(`Unknown patch action: ${(patch as any).action}`);
}

