const fs = require('fs')
const xml2js = require('xml2js')
const moment = require('moment')
const request = require('request')

BillFetcher.prototype.FetchBills = function (date, cb) {
  if (typeof date == "function") {
    cb = date
    if (this.File && this.File != "") {
      return this.fetchFromFile(cb)
    }
    var d = buildDate()
    return this.fetchFromURL(d, cb)
  } else {
    if (this.File) {
      return cb(Error("can't use file with date"))
    }
    return this.fetchFromURL(date, cb)
  }
}

BillFetcher.prototype.fetchFromURL = function (date, cb) {
  var u = this.buildWeeklyURL(date)
  console.log(u)
  request(u, (err, res, body) => {
    if (err) {
      return cb(err)
    }
    return this.parseData(body, cb)
  })
}
BillFetcher.prototype.buildWeeklyURL = function (date) {
  return this.URL + '/Download.aspx?file=/billsthisweek/' + date + '/' + date + '.xml'
}

BillFetcher.prototype.fetchFromFile = function (cb) {
  fs.readFile(this.File, (err, data) => {
    if (err) {
      return cb(err)
    }
    return this.parseData(data, cb)
  })
}

BillFetcher.prototype.parseData = function (data, cb) {
  this.parser.parseString(data, function (err, result) {
    if (err) {
      return cb(err)
    }
    var a = []
    for (var i = 0; i <  result.floorschedule.category.length; i++) {
      for (var j = 0; j < result.floorschedule.category[i]['floor-items'].length; j++) {
        for (var k = 0; k < result.floorschedule.category[i]['floor-items'][j]['floor-item'].length; k++) {
          var obj = {}
          obj['bill-number'] = result.floorschedule.category[i]['floor-items'][j]['floor-item'][k]['legis-num'][0]
          Object.assign(obj, result.floorschedule.category[i]['floor-items'][j]['floor-item'][k]['$'])
          obj['bill-link'] = result.floorschedule.category[i]['floor-items'][j]['floor-item'][k]['files'][0]['file'][0]['$']['doc-url']
          delete(obj['sort-order'])
          delete(obj['remove-date'])
          a.push(obj)
        }
      }
    }
    return cb(null, a)
  })
}

function BillFetcher(opts) {
    if (opts.File != "" && (opts.URL == "" || !opts.URL)) {
      this.File = opts.File
    }
    if (opts.URL != "" && (opts.File == "" || !opts.File)) {
      this.URL = opts.URL
    }
    this.parser = new xml2js.Parser()
}

// to be used if there's no date on FetchBills
// input
function buildDate () {
  return moment().subtract(moment().day()-1, 'days').format('YYYY MM DD').split(' ').join('')
}

module.exports = BillFetcher
