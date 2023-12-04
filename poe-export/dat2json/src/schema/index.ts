import fetch from "cross-fetch";
import { DatFile } from "../dat/dat-file";
import { getHeaderLength, Header } from "../dat/header";

export async function getSchema() {
  const schema = await fetch(
    "https://github.com/poe-tool-dev/dat-schema/releases/download/latest/schema.min.json"
  ).then((x) => x.json());

  return schema;
}

export interface ColumnHeader {
  column: any;
  header: Header;
}

export function buildSchemaLookup(
  schema: any,
  name: string,
  datFile: DatFile
): Record<string, ColumnHeader> {
  const headerLookup: Record<string, ColumnHeader> = {};
  const sch = schema.tables.find(
    (s: any) =>
      s.name.localeCompare(name, undefined, { sensitivity: "accent" }) === 0
  );
  if (!sch) {
    throw new Error(`Schema missing table ${name}`);
  }

  let offset = 0;
  for (const column of sch.columns) {
    const header: Header = {
      offset,
      type: {
        array: column.array,
        integer:
          // column.type === 'u8' ? { unsigned: true, size: 1 }
          // : column.type === 'u16' ? { unsigned: true, size: 2 }
          // : column.type === 'u32' ? { unsigned: true, size: 4 }
          // : column.type === 'u64' ? { unsigned: true, size: 8 }
          // : column.type === 'i8' ? { unsigned: false, size: 1 }
          // : column.type === 'i16' ? { unsigned: false, size: 2 }
          column.type === "i32"
            ? { unsigned: false, size: 4 }
            : // : column.type === 'i64' ? { unsigned: false, size: 8 }
            column.type === "enumrow"
            ? { unsigned: false, size: 4 }
            : undefined,
        decimal:
          column.type === "f32"
            ? { size: 4 }
            : // : column.type === 'f64' ? { size: 8 }
              undefined,
        string: column.type === "string" ? {} : undefined,
        boolean: column.type === "bool" ? {} : undefined,
        key:
          column.type === "row" || column.type === "foreignrow"
            ? {
                foreign: column.type === "foreignrow",
              }
            : undefined,
      },
    };
    headerLookup[column.name] = { column, header };
    offset += getHeaderLength(header, datFile);
  }

  return headerLookup;
}
