import { google } from "googleapis";
import * as fs from "node:fs";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

const dstDir = "../backup"

const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({version: "v3", auth});


const createdSheet = (await sheets.spreadsheets.create()).data

const sheetId = "10fX-tYd2C5JtpzxNado6Zb5MD1xswwHUIghkmXJxlfA";
const sheetDir = dstDir + '/' + sheetId
const savedProperty = JSON.parse(fs.readFileSync(sheetDir + "/sheetdata.json", "utf8"))

var requestList = []

requestList.push({
    updateSpreadsheetProperties: {
        properties: savedProperty.properties,
        fields: "*"
    }
})
for (const sheet of savedProperty.sheets) {
    requestList.push({
        addSheet: {
            properties: sheet.properties
        }
    })
}

sheets.spreadsheets.batchUpdate({
    spreadsheetId: createdSheet.spreadsheetId,
    requestBody: {
        requests: requestList
    }
})
drive.files.update({
    fileId: createdSheet.spreadsheetId,
    addParents: "1-hnIXM-NGzyTDEpIpfrp0owaE6IZwbuk",
    supportsAllDrives: true
})
