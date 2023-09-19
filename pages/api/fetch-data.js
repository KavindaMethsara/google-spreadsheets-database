import { google } from "googleapis"

export default async function Handler(req, res) {
  try {
    // Auth
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Query
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Data!A1:F16", // Adjust the range as needed
    })

    // Result
    const values = response.data.values
    const headers = values[0]

    // Extract unique machine names
    const machineList = values.slice(1).map((row) => row[0])

    // Create an object to send as the response
    const responseData = {
      data: values.slice(1), // Exclude headers
      headers,
      machineList,
      parameterList: headers.slice(1), // Exclude the first column (machine names)
    }

    res.status(200).json(responseData)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
