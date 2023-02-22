const marked = require("marked")
const htmlLoader = require("html-loader")

module.exports = {
    process : (src) => {
        return htmlLoader(marked(src))
    }
}
