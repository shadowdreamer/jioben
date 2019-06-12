// ==UserScript==
// @name         标记楼主和好友还有vip
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.3
// @description  好友列表缓存在本地
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==

(function () {
    new Promise(resolve => {
        const now = new Date().getTime()
        const data = JSON.parse(localStorage.getItem('bgmFriends'))
        if (data) {
            if ((now - data.stamp < 1800000) && data.friends && data.vip ) {
                resolve(data)
            }
        }
        const newData = {
            stamp: now,
            friends: {},
            vip: {}
        }
        Promise.all([
            new Promise(r => $.ajax({
                url: $("#dock a")[0].href + '/friends',
                method: 'GET',
                dataType: 'text',
                success: function (res) {
                    $(res).find("#memberUserList li").each(function () {
                        newData.friends[$(this).find('strong a').attr('href').split('/').pop()] = true
                    })
                    r()
                }
            })),
            new Promise(r => $.ajax({
                url: 'https://raw.githubusercontent.com/shadowdreamer/jioben/master/bangumi/vipList.json',
                dataType:'json',
                success(e) {
                    e.list.forEach(el => {
                        newData.vip[el] = true
                    });
                    r()
                }
            }))
        ]).then(()=>{
            localStorage.setItem('bgmFriends', JSON.stringify(newData))
            resolve(newData)})
    }).then(res => {
        console.log(res)
        const lz = $.find('.postTopic a.avatar')[0] ? $.find('.postTopic a.avatar')[0].href.split('/').pop() : ''
        const all = $('strong a.l')
        for (let i = 0; i < all.length; i++) {
            let id = all[i].href.split('/').pop()
            if (res.vip[id]) {
                $(all[i]).after($(`<span class="vip-chip">vip</span>`))
            }
            if (id == lz) {
                $(all[i]).after($(`<span class="poster-chip">楼主</span>`))
            }
            if (res.friends[id]) {
                $(all[i]).after($(`<span class="friends-chip">好友</span>`))
            }
        }
    });
    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
    span.friends-chip {
        font-weight: normal;
        background-color: #369cf8;
        color: white;
        display: inline-block;
        padding: 0px 3px;
        border-radius: 3px;
        transform: scale(0.8) translate(1px, -4px);
    }
    span.poster-chip {
        font-weight: normal;
        background-color: #f09199;
        color: white;
        display: inline-block;
        padding: 0px 3px;
        border-radius: 3px;
        transform: scale(0.8) translate(1px, -4px);
    }
    span.vip-chip {
        font-weight: normal;
        background-color: #fee228;
        color: white;
        display: inline-block;
        padding: 0px 3px;
        border-radius: 3px;
        transform: scale(0.8) translate(1px, -4px);
    }
    `
    heads[0].append(style)
})();