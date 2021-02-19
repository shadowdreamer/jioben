// ==UserScript==
// @name         超展开手机版屏蔽用户
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.3
// @description  邮件
// @author       dovahkiin
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/m\/.*/
// ==/UserScript==
(()=>{
    let blockList = (()=>{
        let local = localStorage.getItem('cure-m-block');
        if(local){
            return local.split(',')
        }else{
            localStorage.setItem('cure-m-block','白哥哥');
            return ['白哥哥']
        }
    })()
    $('#header').find('.avatar').before($(`
        <a>屏蔽</a>
    `).on('click',initEditor))
    function initEditor(){

        const layout = $(/*html*/`
            <div class="block-dialog">
                <h3>输入要屏蔽的人昵称，英文 , 分隔</h3>
                <textarea></textarea>
                <p>
                    <a class="block-cancel">取消</a> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a class="block-confirm">确定</a>
                <p>
            </div>
        `)
        $(document.body).append(layout);
        layout[0].querySelector('textarea').value=blockList.join(',');
        layout.on('click','.block-cancel',()=>{
            layout.remove()
        })
        layout.on('click','.block-confirm',()=>{
            let val = layout[0].querySelector('textarea').value;
            blockList = val.split(',')
            localStorage.setItem('cure-m-block',val);
            doRemove();
            layout.remove()
        })
    }
    function doRemove(){
        $('.item_list').each(function(){
            if(blockList.includes(this.querySelector('a.avatar').title)){
                this.remove()
            }
        })
        $('.row_reply,.sub_reply_bg').each(function(){
            if(blockList.includes(this.querySelector('a.l').innerText)){
                this.remove()
            }
        })
         
    }
    doRemove()
    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = /*css*/`
        .block-dialog{
            position: fixed; 
            box-sizing: border-box;
            width:calc(100vw - 50px);
            left:25px;
            top:150px;
            background:black;
            color:#fff;
            padding: 10px;
            border: 1px solid #fff;
        }
        .block-dialog textarea{
            height: 180px;
            width:100%;
        }
    `
    heads[0].append(style)
})()