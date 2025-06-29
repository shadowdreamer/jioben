// ==UserScript==
// @name         bgm快捷跳转mikan
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  bgm快捷跳转mikan
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/.*
// ==/UserScript==

(function () {
  'use strict';
  function injectMikanTab() {
    try {
        let mikan_id =  "";
        const navTabs = document.querySelector(".subjectNav > .navTabs");
        const newListItem = document.createElement("li");
        const newLink = document.createElement("a");
        newLink.textContent = "蜜柑计划";
        newLink.href="javascript:void(0)";
        newListItem.appendChild(newLink);
        navTabs.appendChild(newListItem);
        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            toMikan();
        })
        function toMikan(){
          // 从URL中提取subject ID
          const subjectId = window.location.pathname.match(/\/subject\/(\d+)/)[1];
          if(mikan_id){
            window.open(`https://mikanime.tv/Home/Bangumi/${mikan_id}`, '_blank');
            return;
          }
          newLink.textContent = "蜜柑计划 跳转中...";
          // 请求mikan_id
          $.ajax({
            url: `https://bangumi-mikan.uzumaki.workers.dev/query?id=${subjectId}`,
            dataType: 'json',
            success: function(data) {
              if(data && data.mikan_id) {
                // 跳转到mikan页面
                newLink.textContent = "蜜柑计划";
                mikan_id = data.mikan_id;
                window.open(`https://mikanime.tv/Home/Bangumi/${data.mikan_id}`, '_blank');
              }
            },
            error: function() {
              console.log('获取mikan_id失败');
              newLink.textContent = "蜜柑计划失败";
              
            }
          });
        }
    } catch (e) {
        console.log(e);
    }
  }

  injectMikanTab();
})();