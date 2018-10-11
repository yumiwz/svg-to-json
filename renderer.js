// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')
const getSvgFile = require('./modules/getSvgFile')

const getSvgFiles = file => fileName => {
  const params = {
    fileName,
    file: path.join(file, fileName)
  }

  return getSvgFile(params)
}

const readJsonFiles = (filenames, filePath) => {
  return Promise.all(filenames.map(getSvgFiles(filePath)));
}

var holder = document.getElementById('drag');

holder.ondragover = () => {
  return false;
};

holder.ondragleave = () => {
  return false;
};

holder.ondragend = () => {
  return false;
};

holder.ondrop = (e) => {
  e.preventDefault();

  for (let f of e.dataTransfer.files) {
    ipcRenderer.send('ondragstart', f.path)

    fs.readdir(f.path, 'utf-8', (err, data) => {
      if (err) {
        console.log('error', err)
      }

      readJsonFiles(data, f.path).then(function (results) {
        console.log('data', results)
      }, function (err) {
        console.log('erro', err)
      })
    })
  }


  return false;
};




