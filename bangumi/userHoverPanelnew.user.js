// ==UserScript==
// @name         bangumi鼠标移入显示用户信息悬浮框
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.3
// @description   
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==
(function(){
    $('[href*="/user/"].l,[href*="/user/"].avatar,#pm_sidebar a[onclick^="AddMSG"]').each(function(){
        $(this).on('hover',function(){

        })
    })
    
    function init(userId){
        const req = {
            req1: null,
            req2: null
        }

        
    }


    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
        .user-hover {
            position: fixed;
            background: white;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
            transition: all .2s ease-in;
            transform: translate(0,6px);
            font-size: 12px;
            z-index:999;
            color:#010101
        }
        .fix-avatar-hover{
            transform: translate(45px,20px)
        }
        
        div.dataready {
            padding: 8px;
            font-weight: normal;
            text-align: left;
        }
        span.user-lastevent {
            color: #f67070;
        }
        div.dataready img {
            height: 75px;
            width:75px;
            border-radius: 5px;
        }
        .user-info {
            display: inline-block;
            vertical-align: top;
            max-width: 250px;
            margin: 0 0 10px 10px;
        }
        .user-info .user-name {
            font-size: 20px;
            font-weight: bold;
        }
        .user-info .user-joindate {
            background-color: #f09199;
            display: inline-block;
            color: white;
            border-radius: 10px;
            padding: 0 10px;
            margin: 8px 4px 3px 0px;
        }
        .user-info .user-id{
            font-size: 12px;
            font-weight:normal;
            color:#ec5c68
        }
        .user-info .user-sign {
            word-break: break-all;
        }
        .user-watch {
            padding: 10px 0px 5px;
            margin-bottom: 10px;
        }
        .user-watch span {
            display: inline-block;
            margin-right: 3px;
            padding: 0px 4px;
            border-left: 4px solid #f09199;
            background-color: #fce9e9;
        }
        .user-watch span:last-of-type {
            margin-right: 0;
        }
        .shinkuro {
            width: 100%;
            height: 20px;
            background-color: #fce9e9;
            line-height: 20px;
        }
        .shinkuro-text {
            position: absolute;
            width: 100%;
        }
        .shinkuroritsu {
            height: 20px;
            float: left;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            background: linear-gradient(to right, #f9a9a9 0%,#fb788f 100%);
        }
        .shinkuro-text span:nth-of-type(1) {
            margin-left: 10px;
        }
        .shinkuro-text span:nth-of-type(2) {
            float: right;
            margin-right: 26px;
        }
        a.hover-panel-btn {
            display: inline-block;
            float: right;
            margin-bottom: 8px;
            background: #f09199;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            margin-left:10px;
            transition: all .2s ease-in;
        }
        a.hover-panel-btn:hover{
            background: #b4696f;
            color: white;
        }
        span.my-friend{
            display: inline-block;
            float: right;
            margin-bottom: 8px;
            background: #6eb76e;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
        }
        span.my-friend-fail{
            display: inline-block;
            float: right;
            margin-bottom: 8px;
            background: red;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
        }
    `
    heads[0].append(style)
})()