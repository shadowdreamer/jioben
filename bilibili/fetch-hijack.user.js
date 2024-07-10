// ==UserScript==
// @name         fetch hijack
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";
  const oFetch = window.fetch;
  async function myFetch () {
    const [url] = arguments;
    if (url.includes('top/feed')) {
      try {
        const res = await oFetch(...arguments)
        const json = await res.json();
        const { item } = json.data;
        const myItem = item.filter(el => {
          return !!el.id //鉴定为没有id的是广告
        })
        const myRes = new Response(JSON.stringify({
          ...json.data,
          item: myItem
        }), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })
        return new Promise(r => r(myRes))

      } catch (err) {
        console.log(err);
        return oFetch(...arguments)
      }
    }
    return oFetch(...arguments)

  }
  window.fetch = myFetch;


  // funny ssr 首屏广告
  window.addEventListener('load', () => {
    let cards = document.querySelectorAll('.feed-card')
    cards.forEach(el => {
      let href = el.querySelector('.bili-video-card__image--link')?.href;
      if (!href
        || href.includes('cm.bilibili.com')
      ) { // 过滤广告
        el.remove()
      }
    })
  })
})()