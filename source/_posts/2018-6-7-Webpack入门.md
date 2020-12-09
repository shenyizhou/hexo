---
title: Webpack入门
date: 2018-6-7 17:52:27
categories:
- Webpack
tags:
- Webpack
---

### 综述

Webpack 2 开始对 ES6、CommonJS、AMD 内置支持

<!-- more -->

### 用 Webpack 构建 CommonJS 模块化编写的项目

```javascript
// a.js
function b(content) {
  alert(content);
}
module.exports = b;

// main.js
const a = require("./a.js");
a("test");
```

还需要一个 `webpack.config.js`

```javascript
const path = require("path");
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  }
};
```

和一个 `package.json`

```json
"scripts": {
  "start": "webpack --config webpack.config.js"
},
```

执行完构建命令`yarn start`后会生成 `dist` 目录，里面有 `bundle.js`

### 用 Loader 引入 css 文件

测试页面

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title></title>
</head>
<body>
	<div id="app">test</div>
	<script type="text/javascript" src="./dist/bundle.js"></script>
</body>
</html>
```

`a.css`

```css
#app {
  background: red;
}
```

修改后的 `main.js`

```javascript
require("./a.css");
const a = require("./a.js");
a("test");
```

因为 Wbpack 不支持原生解析 CSS，所以要用到 Loader 机制

```javascript
const path = require("path");
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        // 用正则匹配文件名
        test: /\.css$/,
        use: ["style-loader", "css-loader?minimize"]
      }
    ]
  }
};
```

Loader 的执行顺序是由后至前，先用 `css-loader` 读取 CSS 文件，再由 `style-loader` 将 CSS 的内容注入 JavaScript

Loader 可以通过 URL querystring 的方式传入参数，minimize 告诉 css-loader 要开启 CSS 压缩

【以下都是凑字数

最后的目录

```
│  a.css
│  a.js
│  index.html
│  main.js
│  package.json
│  webpack.config.js
└──dist
       bundle.js
```

最后生成的 bundle.js

```javascript
!function (t) {
  var e = {}

  function n(r) {
    if (e[r]) return e[r].exports
    var o = e[r] = {i: r, l: !1, exports: {}}
    return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
  }

  n.m = t, n.c = e, n.d = function (t, e, r) {
    n.o(t, e) || Object.defineProperty(t, e, {enumerable: !0, get: r})
  }, n.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
  }, n.t = function (t, e) {
    if (1 & e && (t = n(t)), 8 & e) return t
    if (4 & e && "object" == typeof t && t && t.__esModule) return t
    var r = Object.create(null)
    if (n.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: t
    }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) {
      return t[e]
    }.bind(null, o))
    return r
  }, n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    }
    return n.d(e, "a", e), e
  }, n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, n.p = "", n(n.s = 6)
}([function (t, e) {
  t.exports = function (t) {
    alert(t)
  }
}, function (t, e) {
  t.exports = function (t) {
    var e = "undefined" != typeof window && window.location
    if (!e) throw new Error("fixUrls requires window.location")
    if (!t || "string" != typeof t) return t
    var n = e.protocol + "//" + e.host, r = n + e.pathname.replace(/\/[^\/]*$/, "/")
    return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (t, e) {
      var o, i = e.trim().replace(/^"(.*)"$/, function (t, e) {
        return e
      }).replace(/^'(.*)'$/, function (t, e) {
        return e
      })
      return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i) ? t : (o = 0 === i.indexOf("//") ? i : 0 === i.indexOf("/") ? n + i : r + i.replace(/^\.\//, ""), "url(" + JSON.stringify(o) + ")")
    })
  }
}, function (t, e, n) {
  var r, o, i = {}, s = (r = function () {
    return window && document && document.all && !window.atob
  }, function () {
    return void 0 === o && (o = r.apply(this, arguments)), o
  }), a = function (t) {
    var e = {}
    return function (t) {
      if ("function" == typeof t) return t()
      if (void 0 === e[t]) {
        var n = function (t) {
          return document.querySelector(t)
        }.call(this, t)
        if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
          n = n.contentDocument.head
        } catch (t) {
          n = null
        }
        e[t] = n
      }
      return e[t]
    }
  }(), u = null, f = 0, c = [], l = n(1)

  function p(t, e) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n], o = i[r.id]
      if (o) {
        o.refs++
        for (var s = 0; s < o.parts.length; s++) o.parts[s](r.parts[s])
        for (; s < r.parts.length; s++) o.parts.push(m(r.parts[s], e))
      } else {
        var a = []
        for (s = 0; s < r.parts.length; s++) a.push(m(r.parts[s], e))
        i[r.id] = {id: r.id, refs: 1, parts: a}
      }
    }
  }

  function d(t, e) {
    for (var n = [], r = {}, o = 0; o < t.length; o++) {
      var i = t[o], s = e.base ? i[0] + e.base : i[0],
        a = {css: i[1], media: i[2], sourceMap: i[3]}
      r[s] ? r[s].parts.push(a) : n.push(r[s] = {id: s, parts: [a]})
    }
    return n
  }

  function v(t, e) {
    var n = a(t.insertInto)
    if (!n) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.")
    var r = c[c.length - 1]
    if ("top" === t.insertAt) r ? r.nextSibling ? n.insertBefore(e, r.nextSibling) : n.appendChild(e) : n.insertBefore(e, n.firstChild), c.push(e) else if ("bottom" === t.insertAt) n.appendChild(e) else {
      if ("object" != typeof t.insertAt || !t.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n")
      var o = a(t.insertInto + " " + t.insertAt.before)
      n.insertBefore(e, o)
    }
  }

  function h(t) {
    if (null === t.parentNode) return !1
    t.parentNode.removeChild(t)
    var e = c.indexOf(t)
    e >= 0 && c.splice(e, 1)
  }

  function b(t) {
    var e = document.createElement("style")
    return void 0 === t.attrs.type && (t.attrs.type = "text/css"), y(e, t.attrs), v(t, e), e
  }

  function y(t, e) {
    Object.keys(e).forEach(function (n) {
      t.setAttribute(n, e[n])
    })
  }

  function m(t, e) {
    var n, r, o, i
    if (e.transform && t.css) {
      if (!(i = e.transform(t.css))) return function () {
      }
      t.css = i
    }
    if (e.singleton) {
      var s = f++
      n = u || (u = b(e)), r = x.bind(null, n, s, !1), o = x.bind(null, n, s, !0)
    } else t.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n = function (t) {
      var e = document.createElement("link")
      return void 0 === t.attrs.type && (t.attrs.type = "text/css"), t.attrs.rel = "stylesheet", y(e, t.attrs), v(t, e), e
    }(e), r = function (t, e, n) {
      var r = n.css, o = n.sourceMap, i = void 0 === e.convertToAbsoluteUrls && o;
      (e.convertToAbsoluteUrls || i) && (r = l(r))
      o && (r += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + " */")
      var s = new Blob([r], {type: "text/css"}), a = t.href
      t.href = URL.createObjectURL(s), a && URL.revokeObjectURL(a)
    }.bind(null, n, e), o = function () {
      h(n), n.href && URL.revokeObjectURL(n.href)
    }) : (n = b(e), r = function (t, e) {
      var n = e.css, r = e.media
      r && t.setAttribute("media", r)
      if (t.styleSheet) t.styleSheet.cssText = n else {
        for (; t.firstChild;) t.removeChild(t.firstChild)
        t.appendChild(document.createTextNode(n))
      }
    }.bind(null, n), o = function () {
      h(n)
    })
    return r(t), function (e) {
      if (e) {
        if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return
        r(t = e)
      } else o()
    }
  }

  t.exports = function (t, e) {
    if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment")
    (e = e || {}).attrs = "object" == typeof e.attrs ? e.attrs : {}, e.singleton || "boolean" == typeof e.singleton || (e.singleton = s()), e.insertInto || (e.insertInto = "head"), e.insertAt || (e.insertAt = "bottom")
    var n = d(t, e)
    return p(n, e), function (t) {
      for (var r = [], o = 0; o < n.length; o++) {
        var s = n[o];
        (a = i[s.id]).refs--, r.push(a)
      }
      t && p(d(t, e), e)
      for (o = 0; o < r.length; o++) {
        var a
        if (0 === (a = r[o]).refs) {
          for (var u = 0; u < a.parts.length; u++) a.parts[u]()
          delete i[a.id]
        }
      }
    }
  }
  var g, w = (g = [], function (t, e) {
    return g[t] = e, g.filter(Boolean).join("\n")
  })

  function x(t, e, n, r) {
    var o = n ? "" : r.css
    if (t.styleSheet) t.styleSheet.cssText = w(e, o) else {
      var i = document.createTextNode(o), s = t.childNodes
      s[e] && t.removeChild(s[e]), s.length ? t.insertBefore(i, s[e]) : t.appendChild(i)
    }
  }
}, function (t, e) {
  t.exports = function (t) {
    var e = []
    return e.toString = function () {
      return this.map(function (e) {
        var n = function (t, e) {
          var n = t[1] || "", r = t[3]
          if (!r) return n
          if (e && "function" == typeof btoa) {
            var o = (s = r, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(s)))) + " */"),
              i = r.sources.map(function (t) {
                return "/*# sourceURL=" + r.sourceRoot + t + " */"
              })
            return [n].concat(i).concat([o]).join("\n")
          }
          var s
          return [n].join("\n")
        }(e, t)
        return e[2] ? "@media " + e[2] + "{" + n + "}" : n
      }).join("")
    }, e.i = function (t, n) {
      "string" == typeof t && (t = [[null, t, ""]])
      for (var r = {}, o = 0; o < this.length; o++) {
        var i = this[o][0]
        "number" == typeof i && (r[i] = !0)
      }
      for (o = 0; o < t.length; o++) {
        var s = t[o]
        "number" == typeof s[0] && r[s[0]] || (n && !s[2] ? s[2] = n : n && (s[2] = "(" + s[2] + ") and (" + n + ")"), e.push(s))
      }
    }, e
  }
}, function (t, e, n) {
  (t.exports = n(3)(!1)).push([t.i, "#app{background:red}", ""])
}, function (t, e, n) {
  var r = n(4)
  "string" == typeof r && (r = [[t.i, r, ""]])
  var o = {hmr: !0, transform: void 0, insertInto: void 0}
  n(2)(r, o)
  r.locals && (t.exports = r.locals)
}, function (t, e, n) {
  n(5), n(0)("test")
}])
```

### 用 Plugin 生成单独的 CSS 文件

先是下载了`extract-text-webpack-plugin`并将`webpack.config.js`改为

```javascript
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        // 用正则匹配文件名
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          use: ["css-loader"]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`
    })
  ]
};
```

但是在 webpack 4 下报错`DeprecationWarning: Tapable.plugin is deprecated. Use new API on '.hooks\' instead`，于是我们下载`mini-css-extract-plugin`并将`webpack.config.js`改为

```javascript
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        // 用正则匹配文件名
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[id].css`
    })
  ]
};
```

此时便在 `dist` 目录下生成了`main.css`

```css
#app {
  background: red;
}
```

### 使用 DevServer 开启本地服务

首先安装`webpack-dev-server`，然后将之写入到`package.json`的 `scripts` 里，运行该脚本就可以看到之前 output 的页面啦【要注意 DevServer 会对`webpack.config.js`里的`output.path`视而不见，而直接保存到内存中

```json
"scripts": {
  "start": "webpack --config webpack.config.js",
  "dev": "webpack-dev-server"
},
```

### 实时预览

`webpack --watch` 和 DevServer 启动的 Webpack 都会开启监听模式，当有改动时重新构建

原理是 DevServer 让 Webpack 在构建出的 JavasScript 代码中注入一个代理服务器，网页和 Webpack 间通过 WebSocket 通信，使得 DevServer 可以主动向网页发送命令，在有改动时就可以主动刷新

【index.html 脱离了 JavaScript 模块化系统，所以 Webpack 不知道它的存在，也就无法实时预览

### 模块热替换

也就是局部更新，在`webpack-dev-server`中带上`--hot`

```json
"scripts": {
  "start": "webpack --config webpack.config.js",
  "dev": "webpack-dev-server --hot"
},
```

更改 JavaScript 还是会刷新，更改 CSS 未生效

### SourceMap

```json
"scripts": {
  "start": "webpack --config webpack.config.js",
  "dev": "webpack-dev-server --hot --devtool source-map"
},
```
