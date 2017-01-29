const fs = require('fs')
const xml2js = require('xml2js')

BillFetcher.prototype.FetchBills = function (date, cb) {
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
      a.push(result.floorschedule.category[i]['floor-items'])
    }
    return cb(null, a)
  })

}

function BillFetcher(opts) {
    if (opts.File != "" && (opts.URL == "" || !opts.URL)) {
      this.File = opts.File
    }
    console.log(this.File)
    this.parser = new xml2js.Parser()
}

module.exports = BillFetcher
