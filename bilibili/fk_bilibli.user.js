// ==UserScript==
// @name         fk bilibili
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
    .video-sections-content-list{
        height: calc(100vh - 400px) !important;
        max-height:unset !important;
    }
  `);
})();
