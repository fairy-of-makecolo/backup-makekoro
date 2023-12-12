import { google } from "googleapis";
import * as fs from "node:fs";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

const dstDir = "../backup"

const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});

const sheetId = process.argv[2];
const sheets = google.sheets({ version: "v4", auth });
const resSheet = await sheets.spreadsheets.get({
  spreadsheetId: sheetId
});

const sheetDir = dstDir + '/' + sheetId
fs.mkdirSync(sheetDir, { recursive: true });

fs.writeFile(sheetDir + "/sheetdata.json", JSON.stringify(resSheet.data, null, 2), (err, data) => {
  if(err) console.log(err);
})

const sheetNames = resSheet.data.sheets.map(sheet => sheet.properties.title)
const resRanges = await sheets.spreadsheets.values.batchGet({
  spreadsheetId: sheetId,
  ranges: sheetNames
})

for (var i = 0; i < sheetNames.length; ++i) {
  const sheetName = sheetNames[i]
  const range = resRanges.data.valueRanges[i].values
  const maxlength = range.reduce((acc, arr) => Math.max(acc, arr.length), 0)

  const expandedRange = range.map(line => {
    if (line.length < maxlength)
      return line.concat(new Array(maxlength - line.length).fill(""))
    else
      return line
  })

  const content = expandedRange.map(line => line.map(str => str.replaceAll('\n', '\\n')).join('\t')).join('\n') + '\n'
  fs.writeFile(sheetDir + "/" + sheetName + ".tsv", content, (err, data) => {
    if(err) console.log(err);
  })
}
