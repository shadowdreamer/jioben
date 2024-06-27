// ==UserScript==
// @name         讨论串默认不加载图片
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  顺便加图片查看view.js
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/ep\/.*
// ==/UserScript==

(function () {
  'use strict';
  let images = document.querySelectorAll(".reply_content img.code");
  let ep_image_count = window.localStorage.getItem("ep_image_count") || 0;
  let box = $(`<input type="number" class="ep_image_count"/>`).on('change', function () {
    ep_image_count = $(this).val();
    window.localStorage.setItem("ep_image_count", ep_image_count);
  }).val(ep_image_count)
  let warp = $(`<div>默认加载图片数，-1为全部显示：</div>`);
  warp.css('background', '#f2f2f2')
  warp.css('display', 'inline-flex')
  warp.css('padding', '4px 0')
  warp.css('opacity', '0.7')
  warp.append(box);
  $('.singleCommentList').before(warp)
  images.forEach((el,i) => {
    let vw = null;
    function initBtn(){
      let s = el.src;
      el.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=;'
      let btn = $(`<a href='javascript:;' style="color:#0084b4"></a>`);
      btn.text(`[加载图片]`);
      btn.attr("title", s);
      btn.on("click", function () {
        btn.text(`[加载中...url:${s}]`)
        el.src = s;
        btn.after(el);
        $(el).on('click', function () {
          initViewer();
        }).on('error', function () {
          btn.text(`[加载失败！url:${s}]`)
        }).on('load', function () {
          btn.remove();
        })
      })
      $(el).after(btn).detach()
    }
    $(el).attr('loading', 'lazy');
    function initViewer(){
      if(!vw){
        vw = new Viewer(el,{
          navbar:false,
        });
      }
      vw.show();
    }
    if(ep_image_count>=0 && i+1>ep_image_count){
      initBtn();
    }else{
      $(el).on('click', function () {
        initViewer();
      })
    }
  })
  // load js
  var script = document.createElement("script");
  script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.js");
  document.head.appendChild(script);
  // load css url
  let viewercss = "https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.css";
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", viewercss);
  document.head.appendChild(link);
})();