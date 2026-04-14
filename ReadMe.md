I want to create console app for windows which will modify txt file. 
I have a text file where each line looks like this:
"<XML_CONTENT>",2026-04-07 10:32:51.9690000

Where:

The XML is inside quotes
XML characters are HTML-escaped (&lt;, &gt;, &quot;)
After the closing quote there is a date
I want each XML document saved as a separate .xml file

Result files will be in folder xml (after execution)

Observe example of results in folders:
xml formatted
xml not formatted

==============
1.1. Install all at once
npm install

1.2. Alternative (Install libraries separately):
npm install typescript @types/node hemlExtractorTS
npm install --save-dev @types/he
npm install --save-dev @types/node
npm install xml-formatter
npm install -D prettier prettier-plugin-xml

2. Validate if you have tsc compiler:
npx tsc --version

3. Compile:
npm run build

4. Run
npm start


============ Other issues
1. Can't run scripts in powershell
npm install
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. 

fix:
powershell -ExecutionPolicy Bypass