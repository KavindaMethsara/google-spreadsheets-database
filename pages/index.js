import { google } from 'googleapis';

export async function getServerSideProps({ query }) {
  // Auth
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Query
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Data!A1:M23', // Adjust the range as needed
  });

  // Result
  const values = response.data.values;

  if (!values || values.length === 0) {
    return {
      notFound: true,
    };
  }

  const headers = values[0]; // Assuming the first row contains headers
  const data = values.slice(1).map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });

  return {
    props: {
      data,
      headers,
    },
  };
}

export default function ({ data, headers }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>
                <div dangerouslySetInnerHTML={{ __html: item[header] }}></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
