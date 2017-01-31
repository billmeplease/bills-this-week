const fs = require('fs')
const xml2js = require('xml2js')

BillFetcher.prototype.FetchBills = function (date, cb) {
  //if it's a file we probably aren't too worried about
  if (typeof date == "function") {
    cb = date
  }
  if (this.File != "") {
    return this.fetchFromFile(cb)
  }
}

BillFetcher.prototype.fetchFromFile = function (cb) {
  var _this = this
  fs.readFile(this.File, (err, data) => {
    if (err) {
      return cb(err)
    }
    return _this.parseData(data, cb)
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
    if (opts.URL != "" && (opts.File == "" || !opts.url)) {
      this.URL = opts.url
    }
    this.parser = new xml2js.Parser()
}

module.exports = BillFetcher