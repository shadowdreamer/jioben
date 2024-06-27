// ==UserScript==
// @name         BGM讨论串虚拟列表
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  用JQ手挫的虚拟列表，提升微弱性能，bug或许一堆，也许可以看看学姐楼
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// @icon         https://bgm.tv/img/favicon.ico
// ==/UserScript==


(function () {
  'use strict';
  const warp = $(`#comment_list`);
  if(!warp[0])return;
  warp.css("min-height", `${warp.height()}px`)
    .css("position", `relative`);
  $('.row_state.clearit')
    .css("position", `absolute`)
    .css("bottom", `0px`)
    .css('width', '100%')
  const list = $(`#comment_list>.row_reply`)
  let wh = window.innerHeight;
  window.addEventListener("resize", function () {
    wh = window.innerHeight;
  })
  const heightStore = {
    map: [],
    getByHeight: function (h) {
      let i = 0, len = this.map.length;
      for (; i < len; i++) {
        if (h <= this.map[i].top) break;
      };
      return i > 0 ? i - 1 : i;
    },
    getActiveIndex: function (center) {
      let around = [center], len = this.map.length,
        prevH = 0, nextH = 0;
      for (let i = 1; i < center + 1; i++) {
        prevH += this.map[center - i].height;
        around.unshift(center - i);
        if (prevH >= wh * 2) break;
      }
      for (let i = 1; i < len - center; i++) {
        nextH += this.map[center + i].height;
        around.push(center + i);
        if (nextH >= wh * 2) break;
      }
      return around
    },

  }


  let _dh = 0;
  list.each((i, el) => {
    let $el = $(el);
    heightStore.map[i] = {
      height: $el.height(),
      top: _dh
    };
    _dh += heightStore.map[i].height + 20.5;
    $el.css('position', 'absolute')
      .css('width', '100%')
      .css('box-sizing', 'border-box');
  })
  list.detach();
  let last_around = heightStore.getActiveIndex(0);
  last_around.forEach((i) => {
    let node = list.eq(i)
    node.css("transform", `translateY(${heightStore.map[i].top}px)`).appendTo(warp);
  })
  const ob = new MutationObserver(() => {
    let offset = 0;
    last_around.forEach((i) => {
      let { height, top } = heightStore.map[i];
      list.eq(i).css('transform', `translateY(${heightStore.map[i].top + offset}px)`);
      offset+=list.eq(i).height()-height;
    })
  });
  ob.observe(warp[0], { childList: true, subtree: true });
  
  $(document).on("scroll", function () {
    let st = $(document).scrollTop();
    let index = heightStore.getByHeight(st);
    let around = heightStore.getActiveIndex(index);
    let newIndex = around.filter((i) => !last_around.includes(i));
    let delIndex = last_around.filter((i) => !around.includes(i));
    last_around = around;
    console.log(index, around);
    delIndex.forEach((i) => {
      list.eq(i).detach();
    })
    newIndex.forEach((i) => {
      let node = list.eq(i)
      node.css("transform", `translateY(${heightStore.map[i].top}px)`).appendTo(warp);
    })
  })
})()