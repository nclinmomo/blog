module.exports = {
    "appenders": {
      "out": { "type": "console", "layout": { "type": "basic" }},
    },
    "categories": {
      "default": { "appenders": [ "out" ], "level": "info" }
    }
}
