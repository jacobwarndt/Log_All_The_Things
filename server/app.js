const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here

});

app.get('/', (req, res) => {
// write your code to respond "ok" here

});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

});

module.exports = app;
