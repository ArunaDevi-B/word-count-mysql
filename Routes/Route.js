const express = require('express');
const routes = express.Router();
const webScraper = require('../Services/webScraper');

routes.post('/geturlhistory/:operation', webScraper.webLinkScraper);

module.exports = routes;