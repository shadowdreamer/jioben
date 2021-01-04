// ==UserScript==
// @name         fkzh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  观测dom变化，并隐藏故事档案局
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function() {
    let timer = null;
    const remover = ()=>{
        document.querySelectorAll('.List-item').forEach(el=>{
            console.log(el)
            if(el.querySelector('.KfeCollection-PurchaseBtn')){
                console.log(true)
                el.setAttribute("style","display:none")
            }else{console.log(false)}
        })
    }
    const observer = new MutationObserver(()=>{
        if(timer){
            clearTimeout(timer);
            timer = setTimeout(()=>{
                remover()
            },300)
        }else{
            timer = setTimeout(()=>{
                remover()
            },300)
        }
    });
    observer.observe(document, {
        childList: true,
        attributes: false,
        subtree: true
    });
})();