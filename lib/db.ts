import "server-only";

import fs from "fs/promises";
import path from "path";

const DATA_DIRECTORY = path.join(process.cwd(), "data");

/**
 * Reads and parses a JSON file from the data directory.
 */
export async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(DATA_DIRECTORY, fileName);

  try {
    const fileContents = await fs.readFile(filePath, "utf-8");

    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    throw new Error(`Could not read database file: ${fileName}`);
  }
}

/**
 * Writes data to a JSON file in the data directory.
 */
export async function writeJsonFile<T>(
  fileName: string,
  data: T
): Promise<void> {
  const filePath = path.join(DATA_DIRECTORY, fileName);

  try {
    await fs.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw new Error(`Could not write database file: ${fileName}`);
  }
}