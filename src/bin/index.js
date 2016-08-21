#!/usr/bin/env node

import fs from 'fs'
import youtubedl from 'youtube-dl'
import { exec } from 'child_process'
import range from 'lodash.range'
import moment from 'moment'
import async from 'async'
import remove from 'remove'
import path from 'path'
import exists from 'fs-exists-sync'

const url = process.argv[2].replace('https://', 'http://')
const filename = process.argv[3] || 'output.mp4'
const clipLength = process.argv[4] || 1

const tmpDir = path.join(__dirname, 'tmp')
const originalVideoPath = path.join(tmpDir, 'original.mp4')
const finishedFilePath = path.join(process.cwd(), filename)
const clipListPath = path.join(tmpDir, 'clip-list.txt')

const formattedSeconds = (seconds) => (
  moment().set({'hour': 0, 'minute': 0, 'second': seconds}).format('HH:mm:ss')
)

const hhmmssToSeconds = (hhmmss) => {
  var arr = hhmmss.split(':').map(function (n) { return +n }).reverse()
  return arr[0] + (arr[1] || 0) * 60 + (arr[2] || 0) * 60 * 60
}

const video = youtubedl(url, ['--format=18'])

let duration

if (exists(tmpDir)) { remove.removeSync(tmpDir) }
fs.mkdirSync(tmpDir)
video.pipe(fs.createWriteStream(originalVideoPath))

video.on('info', (info) => {
  duration = hhmmssToSeconds(info.duration)
})


video.on('end', (info) => {
  var clipsProcessed = 0

  let tasks = range(0, duration, clipLength).map((sec, i, arr) => {
    return (cb) => {
      clipsProcessed++
      console.log((clipsProcessed / arr.length * 100).toFixed(2) + '%')
      let clipStartTime = formattedSeconds(sec)
      let clipDuration = i === arr.length - 1 ? formattedSeconds(duration - sec) : formattedSeconds(clipLength)

      let cmd = `ffmpeg -i ${originalVideoPath} -ss ${clipStartTime} -t ${clipDuration} -async 1 ${path.join(tmpDir, 'cut-' + sec + '.mp4')}`
      exec(cmd, (err) => {
        if (err) { cb(err) }
        cb()
      })
    }
  })

  async.parallelLimit(tasks, 20, (err) => {
    if (err) throw err
    let filenamesToAppend = range(0, duration, clipLength).reverse().map((sec) => `file cut-${sec}.mp4`)

    fs.openSync(clipListPath, 'w+')
    filenamesToAppend.forEach((filenameToAppend) => {
      fs.appendFileSync(clipListPath, filenameToAppend + '\n')
    })

    let cmd = `ffmpeg -f concat -i ${clipListPath} -vcodec copy -acodec copy -y ${finishedFilePath}`
    exec(cmd, (err) => {
      if (err) throw err
      remove.removeSync(tmpDir)
    })
  })
})
