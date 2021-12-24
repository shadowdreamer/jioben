// ==UserScript==
// @name         fk bilibili
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const targetNode = document.querySelector(".bili-layout");
  const config = { attributes: true, childList: true, subtree: true };
  const callback = () => {
    targetNode.querySelectorAll(".bili-grid").forEach(el => {
      if (el.querySelector("#推广,#赛事")) {
        el.remove();
      }
    });
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  callback();
})();
