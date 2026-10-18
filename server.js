const express = require('express');
const path = require('path');
const fs = require('fs');
const GlobalKeyboardListener = require('node-global-key-listener');

const app = express();
const PORT = 8080;
app.use(express.static(__dirname));

const gifs = new Map();
const foldersPath = path.join(__dirname, 'gifs');
const gifFolders = fs.readdirSync(foldersPath);

for(const folder of gifFolders) {
  const gifsPath = path.join(foldersPath, folder);
  const gifjs = path.join(gifsPath, fs.readdirSync(gifsPath).filter(file => file.endsWith('.js'))[0]);
  const command = require(gifjs);
  if('key' in command && ('img' in command || 'audio' in command)) {
    gifs.set(command.key, command);
  } else {
    console.warn(`[WARNING] command: ${gifjs} - missing a prop`)
  }
};

let latestEvent = null;

const v = new GlobalKeyboardListener.GlobalKeyboardListener();
v.addListener((e, down) => {
  if(e.state === 'DOWN') {
    const command = gifs.get(e.name);
    if(!command) return;
    function toRelativeUrl(absPath) {
      const idx = absPath.lastIndexOf(path.sep + 'gifs' + path.sep);
      return absPath.slice(idx).replace(/\\/g, '/');
    }
    latestEvent = {
      ...(command.img ? { img: toRelativeUrl(command.img) } : {}),
      ...(command.audio ? { audio: toRelativeUrl(command.audio) } : {}),
      ts: Date.now()
    };
  }
});

app.get('/latest-event', (req, res) => {
  res.json(latestEvent || {});
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});