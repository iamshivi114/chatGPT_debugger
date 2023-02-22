# markdown-loader-jest

[markdown-loader](https://github.com/peerigon/markdown-loader)
[jest](https://github.com/facebook/jest) plugin

## Install
```
npm install --save-dev markdown-loader-jest
```
## Integration with jest

Define `markdown-loader-jest` as a transformer for your markdown files included in your source files under test. In the "transform" key for jest configuration in the `package.json` add the following:

```json
"transform": {
  "^.+\\.md?$": "markdown-loader-jest"
},
```
