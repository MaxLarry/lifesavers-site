import { google } from "googleapis";
import { JWT } from "google-auth-library";
import serviceAccount from "./psyched-oxide-463020-j8-a8a469129659.json"; // Adjust the path

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SPREADSHEET_ID = "1As0MunPMVlXHkrOHds_cdxGoUha3amSPJVUnYycqtX8"; // Replace this

const auth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: SCOPES,
});


const sheets = google.sheets({ version: "v4", auth });

export async function appendToSheet(row: string[]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
