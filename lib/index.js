const path = require('path');
const fs = require('fs');
const copyDir = require('copy-dir')
const libTex = require('./tex')
const libMd = require('./md')

async function build(options) {
    const pageDir= path.join(process.cwd(), 'pages');
    const buildDir = path.join(pageDir, '../build');

    let headContent;
    let tailContent;

    const headFilePath = path.join(pageDir, '_head.html')
    if (fs.existsSync(headFilePath)) {
        headContent = fs.readFileSync(headFilePath).toString();
    }
    const tailFilePath = path.join(pageDir, '_tail.html')
    if (fs.existsSync(tailFilePath)) {
        tailContent = fs.readFileSync(tailFilePath).toString();
    }

    // move public to build folder
    copyDir.sync(path.join(pageDir, "../public"), buildDir)

    const processorsMapping = {
        md: libMd.transpile,
        tex: libTex.transpile
    };
    fs.readdir(pageDir, (err, files) => {
      if (err) {
        throw new Error(err.message);
      }
      if (!fs.existsSync(buildDir)){
            fs.mkdirSync(buildDir);
      }
      files.forEach(file => {
        const ext = file.split('.').pop().toLowerCase();
        if (processorsMapping[ext]) {
            const fileContent = fs.readFileSync(path.join(pageDir, file)).toString();
            let content = processorsMapping[ext](fileContent)
            content = headContent + content + tailContent
            const filenameDotSplit = file.split('.');
            filenameDotSplit.pop();
            const targetFilePath = path.join(buildDir, filenameDotSplit.join(".") + ".html" )
            fs.writeFileSync(targetFilePath, content)
        }
      });
    });
}

exports.build = build
