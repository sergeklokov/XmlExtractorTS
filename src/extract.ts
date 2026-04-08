import * as fs from "fs";
import * as path from "path";
import he from "he";

const inputFile = path.join(__dirname, "..", "input.txt");
const outputDir = path.join(__dirname, "..", "xml");

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

let index = 1;

for (const line of lines) {
    // Match: "<xml here>",2026-04-07 ...
    const match = line.match(/^"(.*)",/);
    if (!match) continue;

    const escapedXml = match[1];
    const xml = he.decode(escapedXml);

    const fileName = `deadlock_${index}.xml`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, xml, "utf8");
    index++;
}

console.log(`Extracted ${index - 1} XML files into '${outputDir}'`);
