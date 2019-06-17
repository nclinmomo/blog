module.exports = {
    "appenders": {
    //   "out": { "type": "console" },
      "cheese": { "type": "file", filename: 'C:\\work\\ExpressApi\\blog\\cheese.log' }
    },
    "categories": {
    //   "default": { "appenders": [ "out" ], "level": "all" }
      "default": { "appenders": [ "cheese" ], "level": "all" }
    }
}