const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const LOG_FILE = path.join(__dirname, 'log.csv');

app.use((req, res, next) => {
  const agent = req.get('User-Agent');
  const time = new Date().toISOString();
  const method = req.method;
  const resource = req.originalUrl;
  const version = `HTTP/${req.httpVersion}`;
  const status = 200;

  const logLine = `"${agent}",${time},${method},${resource},${version},${status}\n`;

  console.log(logLine.trim());

  fs.appendFile(LOG_FILE, logLine, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  res.status(status);
  next();
});

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/logs', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Error reading log file');
    }

    const lines = data.trim().split('\n');
    const headers = lines.shift().split(',');

    const logs = lines.map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      return headers.reduce((entry, header, i) => {
        entry[header] = values[i].replace(/(^"|"$)/g, '');
        return entry;
      }, {});
    });

    res.json(logs);
  });
});

module.exports = app;
