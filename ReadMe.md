I want to create console app for windows which will modify txt file. 
I have a text file where each line looks like this:
"<XML_CONTENT>",2026-04-07 10:32:51.9690000

Where:

The XML is inside quotes
XML characters are HTML-escaped (&lt;, &gt;, &quot;)
After the closing quote there is a date
I want each XML document saved as a separate .xml file

==============
1. Install libraries:

npm install typescript @types/node hemlExtractorTS
npm install --save-dev @types/he
npm install --save-dev @types/node

2. Validate if you have tsc compiler:
npx tsc --version

3. Compile:
npm run build

4. Run
npm start
