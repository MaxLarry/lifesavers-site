import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SPREADSHEET_ID = "1As0MunPMVlXHkrOHds_cdxGoUha3amSPJVUnYycqtX8";

const auth = new google.auth.JWT({
  email: process.env.GCP_CLIENT_EMAIL,
  key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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
