// ==UserScript==
// @name         和谐3614
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  摸了;屏蔽热词，关键词屏蔽
// @author       shadowdreamer
// @match        https://cc.163.com/361433*
// @match         https://cc.163.com/20/5863183/
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  let blockList = (window.localStorage.getItem('blockList') || '').split(',').filter(i=>i);
  function fireCommnt(node){
    node.style.display = 'none'
  }
  function initCommentObs(){
    const targetNode = document.querySelector('.comment-canvas');
    const config = { attributes: false, childList: true, subtree: true };
    const callback = function(mutationsList) {
      for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if(mutation.addedNodes.length > 0){
            mutation.addedNodes.forEach(node=>{
              let html = node.innerHTML;
              // 屏蔽热词
              if(html.indexOf('<img class=\"storm_bulletScreen_icon\"') !== -1){
                fireCommnt(node)
              };
              // check html has string in blockList
              blockList.forEach(str=>{
                if(html.indexOf(str) !== -1){
                  fireCommnt(node)
                }
              })

            })
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

  }
  
  
  function findCommentLayer(){
    const targetNode = document.querySelector('.main-area');
    const config = { attributes: false, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if(mutation.target.className.includes('comment-canvas')){
            initCommentObs();
            createDialog()
            observer.disconnect();
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };
  findCommentLayer();

  function createDialog(){
    let warp = document.querySelector('.right-tools');
    let btn = document.createElement('a');
    btn.innerText = '设置屏蔽词';
    btn.addEventListener('click',()=>{
      let dialog = document.createElement('div');
      dialog.className = 'dialog';
      dialog.innerHTML = /*html*/`
        <div class="dialog-content">
          <h2>屏蔽列表</h2>
          <textarea id="dialog-input-blocklist"></textarea>
          <p>”,“分隔屏蔽词</p>
          <button id="dialog-btn-confirm">添加</button>
          <button id="dialog-btn-cancel">取消</button>
        </div>
      `;
      document.body.appendChild(dialog);
      let input = document.querySelector('#dialog-input-blocklist');
      input.value = blockList.join(',');
      let btnConfirm = document.querySelector('#dialog-btn-confirm');
      btnConfirm.addEventListener('click',()=>{
        let blockListValue = input.value;
        window.localStorage.setItem('blockList',blockListValue);
        blockList = blockListValue.split(',').filter(i=>i);;
        dialog.remove();
      });
      let btnCancel = document.querySelector('#dialog-btn-cancel');
      btnCancel.addEventListener('click',()=>{
        dialog.remove();
      });
    });
    warp.appendChild(btn);
  };


  GM_addStyle(/*css*/`
    .cmt
    {
      font-size: 16px;
      font-weight: 400;
      pointer-events: none;
      opacity: 0.6;
    }
    #new-player-banner
    {
      display: none;
    }

    .gift-banner
    {
      display: none;
    }

    #room-tabs
    {
      display: none;
    }

    #chat-list-con
    {
      height: 100%;
    }
    .dialog{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 9999;
    }
    .dialog-content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 500px;
      height: 300px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px #000;
      padding:15px;
    }
    .dialog-content textarea{
      width: 100%;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .dialog-content button{
      width: 100px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-left: 10px;
      margin-top: 10px;
    }
  `)
})();