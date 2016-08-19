var fs = require('fs')
var youtubedl = require('youtube-dl')

var url = process.argv[2]
var clipLength = process.argv[3]
var filename = process.argv[4]

var video = youtubedl(url, ['--format=18'])

video.on('info', function (info) {
  console.log('Download started')
  console.log('filename: ' + info._filename)
  console.log('size: ' + info.size)
})

video.pipe(fs.createWriteStream(filename))
