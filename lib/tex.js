const { parse, HtmlGenerator } = require('latex.js')
const { createHTMLWindow } = require('svgdom')

global.window = createHTMLWindow()
global.document = global.window.document

const transpile = latex => {
    global.window = createHTMLWindow()
    global.document = global.window.document
    let generator = new HtmlGenerator({ hyphenate: false })
    let doc = parse(latex, { generator: generator }).htmlDocument()
    return doc.documentElement.outerHTML
}

exports.transpile = transpile
