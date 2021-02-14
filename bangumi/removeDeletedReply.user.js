// ==UserScript==
// @name         移除已删除的回复
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  *
// @author       cureDovahkiin
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/.*/
// ==/UserScript==
(function () {
    const list = document.querySelectorAll('.sub_reply_bg')
    list.forEach(el=>{
        if(/<span class=\"tip\">内容已被用户删除<\/span>/.test(el.innerHTML)){
            el.remove()
        }
    })
    const list2 = document.querySelectorAll('.row_reply')
    list2.forEach(el=>{
        if(/<span class=\"tip\">内容已被用户删除<\/span>/.test(el.innerHTML)){
            if(!el.querySelector('.topic_sub_reply')){
                el.remove()
            }
        }
    })
})()