var fs = require('fs')
var youtubedl = require('youtube-dl')
var exec = require('child_process').exec
var range = require('lodash.range')
var moment = require('moment')

var url = process.argv[2].replace('https://', 'http://')
var clipLength = 1
var filename = "finished.mp4"

var video = youtubedl(url, ['--format=18'])

var duration

video.on('info', function (info) {
  duration = info.duration
})

video.on('end', function (info) {
  fs.mkdir('tmp', function () {
    range(duration).forEach(function (sec) {
      var startTime = moment().set('second', sec).format('HH:mm:ss')
      exec('ffmpeg -i tmp.mp4 -ss ' + startTime + ' -t 00:00:01 -async 1 ./tmp/cut-' + sec + '.mp4')
    })
  })
})

video.pipe(fs.createWriteStream("tmp.mp4"))
