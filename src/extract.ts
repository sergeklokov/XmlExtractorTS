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
let lineNumber = 0;

for (const line of lines) {
    lineNumber++;

    const match = line.match(/^"(.*)",/);

    if (!match || !match[1]) {
        console.warn(`Line ${lineNumber} does not match expected format. Skipping.`);
        continue;
    }

    const escapedXml = match[1];
    const xml = he.decode(escapedXml);

    fs.writeFileSync(
        path.join(outputDir, `deadlock_${index}.xml`),
        xml,
        "utf8"
    );

    index++;
}

console.log(`Extracted ${index - 1} XML files into '${outputDir}'`);
