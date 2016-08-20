# mementoize

chops a youtube video into clips, and stitches the clips back together in reverse chronological order. like the movie [memento](http://www.imdb.com/title/tt0209144/).

## install

install [ffmpeg](https://ffmpeg.org/)

```bash
npm i -g mementoize
```

## usage

```bash
mementoize "<youtube_url>" <output_filename>.mp4 <clip_length_in_seconds>
```

downloads mementoized youtube video to the current directory

## example

```bash
mementoize "https://www.youtube.com/watch?v=sKRxIvZCmxk" doc-chicken.mp4 5
```

generates [this video](https://youtu.be/uGjPW0nKtLM)
