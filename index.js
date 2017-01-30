'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const BillFetcher = require('./house/house')

const app = express()

// Run server to listen on port 8000.
const server = app.listen(8000, () => {
  console.log('listening on *:8000')
})

var fetcher = new BillFetcher({File:__dirname + '/fixtures/20170123.xml'})
console.log(fetcher.File)
fetcher.FetchBills((err, bills) => {
  console.log(JSON.stringify(bills))
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})
