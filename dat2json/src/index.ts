#!/usr/bin/env node
import { readDatFile } from "./dat/dat-file";
import fs from "fs";
import path from "path";
import { readColumn } from "./dat/reader";
import { buildSchemaLookup, getSchema } from "./schema";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

interface Output {
  columns: any[];
  data: any[];
}

async function main() {
  const tempDir = await fs.promises.mkdtemp("./temp-");
  try {
    const datListPath = process.argv[4];
    const datList = await fs.promises
      .readFile(datListPath, "utf-8")
      .then((x) => x.split(/(?:\r\n|\r|\n)/));

    const gameDir = process.argv[2];
    const datListArgs = datList.map((x) => `"${x}"`).join(" ");
    await execPromise(
      `bun_extract_file extract-files "${gameDir}" "${tempDir}" ${datListArgs}`
    );

    const extractedDatList = datList.map((x) => `${tempDir}/${x}`);
    const outputDir = process.argv[3];
    if (!fs.existsSync(outputDir)) await fs.promises.mkdir(outputDir);

    const schema = await getSchema();
    for (const file of extractedDatList) {
      const { base, name } = path.parse(file);

      console.log(base);

      const tableName = name;
      const datBuffer = await fs.promises.readFile(file);

      const datFile = readDatFile(base, datBuffer);
      const schemaLookup = buildSchemaLookup(schema, tableName, datFile);

      const output: Output = {
        columns: [],
        data: Array(datFile.rowCount),
      };

      for (let i = 0; i < datFile.rowCount; i++) {
        output.data[i] = {};
      }

      let unknownCounter = 0;
      for (const key in schemaLookup) {
        const { column, header } = schemaLookup[key];
        
        const name = column.name || `Unknown_${unknownCounter++}`
        output.columns.push({
          name: name,
          type: column.type,
          references: column.references?.table || null,
        });

        const columns = readColumn(header, datFile);
        for (let i = 0; i < datFile.rowCount; i++) {
          output.data[i][name] = columns[i];
        }
      }

      await fs.promises.writeFile(
        `${outputDir}/${tableName}.dat.json`,
        JSON.stringify(output, undefined, 2)
      );
    }
  } finally {
    await fs.promises.rmdir(tempDir, { recursive: true });
  }
}

main();
