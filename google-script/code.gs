/**
 * IT Helpdesk Sign-In — Google Apps Script backend.
 *
 * Deploy: Extensions > Apps Script (on the target Google Sheet) > paste this
 * file as code.gs > Deploy > New deployment > type "Web app" >
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the resulting /exec URL into the kiosk app as VITE_APPS_SCRIPT_URL
 * (or paste it into the kiosk's on-screen setup prompt).
 *
 * Sheet columns (row 1 should contain headers):
 *   A: Date       B: Student ID   C: Student Name
 *   D: Reason     E: Time In      F: Time Out
 */

const TIMEZONE = SpreadsheetApp.getActive().getSpreadsheetTimeZone();

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ result: 'error', message: 'Missing request body' });
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    switch (data.action) {
      case 'checkIn':
        return handleCheckIn(sheet, data);
      case 'checkOut':
        return handleCheckOut(sheet, data);
      default:
        return jsonResponse({ result: 'error', message: 'Unknown action: ' + data.action });
    }
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
}

function handleCheckIn(sheet, data) {
  const studentId = String(data.studentId || '').trim();
  const studentName = String(data.studentName || '').trim();
  const reason = String(data.reason || '').trim();

  if (!studentId || !studentName || !reason) {
    return jsonResponse({ result: 'error', message: 'studentId, studentName, and reason are required' });
  }

  const now = data.timestamp ? new Date(data.timestamp) : new Date();
  const dateStr = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd');
  const timeInStr = Utilities.formatDate(now, TIMEZONE, 'HH:mm:ss');

  sheet.appendRow([dateStr, studentId, studentName, reason, timeInStr, '']);

  return jsonResponse({ result: 'success', action: 'checkIn' });
}

function handleCheckOut(sheet, data) {
  const studentId = String(data.studentId || '').trim();

  if (!studentId) {
    return jsonResponse({ result: 'error', message: 'studentId is required' });
  }

  const now = data.timestamp ? new Date(data.timestamp) : new Date();
  const timeOutStr = Utilities.formatDate(now, TIMEZONE, 'HH:mm:ss');

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonResponse({ result: 'error', message: 'No check-in found for this Student ID' });
  }

  // Columns B (Student ID) and F (Time Out) — search bottom-up for the most
  // recent open visit (blank Time Out) matching this ID.
  const numRows = lastRow - 1; // exclude header row
  const idValues = sheet.getRange(2, 2, numRows, 1).getValues();
  const timeOutValues = sheet.getRange(2, 6, numRows, 1).getValues();

  for (let i = numRows - 1; i >= 0; i--) {
    const rowId = String(idValues[i][0]).trim();
    const rowTimeOut = String(timeOutValues[i][0]).trim();

    if (rowId === studentId && rowTimeOut === '') {
      const sheetRow = i + 2; // account for header row + 0-index offset
      sheet.getRange(sheetRow, 6).setValue(timeOutStr);
      return jsonResponse({ result: 'success', action: 'checkOut', row: sheetRow });
    }
  }

  return jsonResponse({ result: 'error', message: 'No open check-in found for this Student ID' });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Optional: lets you sanity-check the deployment URL in a browser. */
function doGet() {
  return jsonResponse({ result: 'success', message: 'IT Helpdesk Sign-In backend is running' });
}
