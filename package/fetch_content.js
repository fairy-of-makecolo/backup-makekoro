import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

const auth = new google.auth.GoogleAuth({
  scopes: SCOPES,
});

const sheetId = "10fX-tYd2C5JtpzxNado6Zb5MD1xswwHUIghkmXJxlfA";
const sheets = google.sheets({ version: "v4", auth });
const res = await sheets.spreadsheets.values.get({
  spreadsheetId: sheetId,
  range: "現在連敗状況!A1:B6",
});

console.log(res.data.value);