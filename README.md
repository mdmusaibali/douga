# douga

A fun open-source screen recorder application with React. Work in progress.

## Known issues:
- When we use webm video generated by getUserMedia, MediaRecorder and other APIs, we will find that the final webm is not able to drag the progress bar. Unless we use FFmpeg to convert webm to other format video files, or wait for the webm video to finish playing, then we can drag it. Using https://www.npmjs.com/package/webm-duration-fix to solve this issue.

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
