// ==UserScript==
// @name         讨论串默认不加载图片
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  顺便加图片查看view.js
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/ep\/.*
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.js
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';
  const viewercss = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(viewercss);
  let images = document.querySelectorAll(".reply_content img.code");
  images.forEach(el => {
    let s = el.src;
    el.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=;'
    let btn = $(`<a href='javascript:;' style="color:blue"></a>`);
    btn.text(`[加载图片]`);
    btn.attr("title", s);
    const vw = new Viewer(el);
    $(el).after(btn).attr('loading','lazy').detach()
      .on('click', function () {
        vw.show();
      })
    btn.on("click", function () {
      el.onload = function () {
        btn.remove();
      }
      el.onerror = function () {
        btn.text(`[加载失败:url:${s}]`)
      }
      btn.text("[加载中。。]")
      el.src = s;
      btn.after(el)
    })
  })
})();