const fs = require('fs');
const http = require('http');
const csv = require('csvtojson');

const csvUrl = 'http://localhost:3000/api/csv/units/2/task_completion';
const headers = {
  Accept: 'application/octet-stream',
  Username: 'aadmin',
  Auth_Token: 'SfwM4QW5BXzJ-4qQJj4b',
};

const downloadCsvAndConvertToJson = () => {
  http.get(csvUrl, { headers }, (response) => {
    let csvData = '';

    response.on('data', (chunk) => {
      csvData += chunk;
    });

    response.on('end', async () => {
      try {
        const jsonArray = await csv().fromString(csvData);

        const jsonContent = JSON.stringify(jsonArray, null, 2);

        fs.writeFileSync('data.json', jsonContent);

        console.log('CSV data has been converted to JSON and saved to data.json');
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
};

downloadCsvAndConvertToJson();
