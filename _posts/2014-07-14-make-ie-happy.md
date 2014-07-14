---
layout: post
title: "Make IE Happy"
date: 2014-07-14 16:11:24
categories: web ie 兼容 
---

针对IE8的网页优化，我遇到的问题有：
### 不支持的 HTML5 tag 
虽然有脚本可以强迫 IE8 支持 header, footer, section, aside 等 HTML5 标签名，但是，强扭的瓜不甜，如果舍不得抛弃 IE8 的用户，还是老老实实用 div 配上 "header, footer, section" 之类的类名比较好。

### 不支持的 Array 内置方法
IE 下的 ECMAScript 标准的实现叫 "JScript", 跟我们平时说的 "JavaScript" 不是一回事，难怪偶尔会遇到在其他浏览器下不曾遇到过的问题。具体的情况参考[官网文档](http://msdn.microsoft.com/en-us/library/ie/ff679973(v=vs.94).aspx)，这里不多说了。

 
