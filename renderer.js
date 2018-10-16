// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')
const getSvgFile = require('./modules/getSvgFile')


const getSvgFiles = file => fileName => {

  console.log("###", file.isDirectory())
  const params = {
    fileName,
    file: path.join(file, fileName)
  }

  return getSvgFile(params)
}

const readJsonFiles = (filenames, filePath) => {
  console.log("++++", filenames)
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
    let p = f.path
    let test = p.substr(p.lastIndexOf('\\') + 1) 
    console.log("path", test)
    fs.readdir(f.path, 'utf-8', (err, data) => {
      if (err) {
        console.log('error', err)
      }

      readJsonFiles(data, f.path).then(function (results) {
        console.log('data', data)

        var newfile = document.getElementById('dragtarget');

        newfile.ondragstart = (event) => {
          console.log("dragstartfile")
          event.preventDefault()
          ipcRenderer.send('ondragstartfile', `${__dirname}/${p}.js`)

          fs.writeFile(`${p}.js`, "export default " + JSON.stringify(results, null, 2), 'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });

          // let download = document.getElementById('dragtarget')

          // download.ondownload = (event) => {
          //   console.log("download")
          //   event.preventDefault()
          //   ipcRenderer.send('ondownload', `${__dirname}/${p}.js`)
          // }
        }

        document.getElementById("drag").className = "drag-transition";
        document.getElementById("dragtarget").className = "drag-button"
        document.getElementById("nexttarget").className = "next-button"
      }, function (err) {
        console.log('erro', err)
      })
    })
  }



  return false;
};


let nextbutton = document.getElementById('nexttarget')

nextbutton.onclick = (e) => {
  console.log("click")
  document.getElementById("drag").className = "drag-transition-back";
  document.getElementById("dragtarget").className = "dragtarget"
  document.getElementById("nexttarget").className = "nexttarget"
}
