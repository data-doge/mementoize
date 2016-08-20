# mementoize

chops a youtube video into second-long chunks, and stitches the chunks back together in reverse chronological order.

inspired by the movie [memento](http://www.imdb.com/title/tt0209144/)

## install

install [ffmpeg](https://ffmpeg.org/)

```bash
npm i -g mementoize
```

## usage

```bash
mementoize "<youtube_url>" <output_filename>.mp4
```

downloads mementoized youtube video to the current directory

## example

```bash
mementoize "https://www.youtube.com/watch?v=sKRxIvZCmxk" doc-chicken.mp4
```

generates [this video](https://www.youtube.com/watch?v=nXMzQBY5e7g)
