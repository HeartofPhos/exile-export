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

    const outputDir = process.argv[3];

    const schema = await getSchema();
    console.log(`schema.createdAt: ${schema.createdAt}`);

    for (const datPath of datList) {
      try {
        console.log(datPath);

        const { name: tableName, ext: datExt } = path.parse(datPath);
        const extractPath = `${tempDir}/${datPath}`;

        const datBuffer = await fs.promises.readFile(extractPath);
        const datFile = readDatFile(datExt, datBuffer);
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

          if (!column) {
            console.log(`Missing schema data, Table ${datPath}, Header ${key}`);
            continue;
          }

          const name = column.name || `Unknown_${unknownCounter++}`;
          output.columns.push({
            name: name,
            type: column.type,
            array: column.array,
            references: column.references?.table || null,
          });

          const columns = readColumn(header, datFile);
          for (let i = 0; i < datFile.rowCount; i++) {
            output.data[i][name] = columns[i];
          }
        }

        const outputFilePath = `${outputDir}/${datPath}.json`;
        const { dir: outputFileDir } = path.parse(outputFilePath);

        if (!fs.existsSync(outputFileDir))
          await fs.promises.mkdir(outputFileDir, { recursive: true });

        await fs.promises.writeFile(
          outputFilePath,
          JSON.stringify(output, undefined, 2)
        );
      } catch (e) {
        console.log(`Something went wrong while parsing ${datPath}, ${e}`);
      }
    }
  } finally {
    await fs.promises.rmdir(tempDir, { recursive: true });
  }
}

main();
