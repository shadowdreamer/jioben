// ==UserScript==
// @name         ourocg查看大图
// @namespace    shadowdreamer
// @version      0.1
// @description  使用 https://ygocdb.com/ cdn看大图
// @author       You
// @match        https://www.ourocg.cn/card/*
// @icon         https://www.google.com/s2/favicons?domain=ourocg.cn
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  let viewCdn = "https://unpkg.com/viewerjs/dist/viewer.js"
  let css = "https://unpkg.com/viewerjs/dist/viewer.css"
  $("<link>").attr({
    rel: "stylesheet",
    type: "text/css",
    href: css }).appendTo("head");
  $.getScript(viewCdn,()=>{
    let id = $('.val')[4].innerText;
    let pic = `https://cdn.233.momobako.com/ygopro/pics/${id}.jpg`
    let img = new Image();
    img.src = pic
    const viewer = new Viewer(img)
    $('.card .img').on('click',()=>{
      viewer.show()
    })
  });

})();