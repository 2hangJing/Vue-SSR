
const fs                = require("fs");
const path              = require('path');
const express           = require('express');

const server = express();

//  static img
server.use(express.static(path.join(__dirname, '../src/static/images')));

module.exports = {express, server};
