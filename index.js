var fs = require('fs')
var youtubedl = require('youtube-dl')
var exec = require('child_process').exec
var range = require('lodash.range')
var moment = require('moment')
var async = require('async')
var remove = require('remove')

var url = process.argv[2].replace('https://', 'http://')
var clipLength = 1
var filename = "finished.mp4"

var video = youtubedl(url, ['--format=18'])

var duration

video.on('info', function (info) {
  duration = info.duration
})

video.on('end', function (info) {
  fs.mkdir('tmp', function (err) {
    if (err) throw err
    var fxns = range(duration).map(function (sec) {
      return function (cb) {
        var startTime = moment().set({'hour': 0, 'minute': 0, 'second': sec}).format('HH:mm:ss')
        var cmd = 'ffmpeg -i tmp.mp4 -ss ' + startTime + ' -t 00:00:01 -async 1 ./tmp/cut-' + sec + '.mp4'
        exec(cmd, function (err) {
          if (err) cb(err)
          console.log('cmd: ', cmd)
          cb()
        })
      }
    })

    async.parallel(fxns, function (err) {
      if (err) throw err
      var filenamesToAppend = range(duration).reverse().map(function (sec) {
        return 'file ./tmp/cut-' + sec + '.mp4'
      })

      var clipListPath = './clip-list.txt'
      fs.openSync(clipListPath, 'w+')
      filenamesToAppend.forEach(function (filenameToAppend) {
        fs.appendFileSync(clipListPath, filenameToAppend + '\n')
      })

      var cmd = 'ffmpeg -f concat -i ' + clipListPath + ' -vcodec copy -acodec copy ' + filename
      console.log(cmd)
      exec(cmd)
    })
  })
})

video.pipe(fs.createWriteStream("tmp.mp4"))
