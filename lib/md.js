const marked = require('marked')

const transpile = str => {
    return marked.parse(str)
}

exports.transpile = transpile
