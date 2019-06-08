// ==UserScript==
// @name         标记楼主和好友
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  好友列表缓存在本地
// @author       You
// @include     /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(ep|blog|subject\/topic|group\/topic)\//
// @grant        none
// ==/UserScript==

(function () {
    new Promise(resolve => {
        const data = JSON.parse(localStorage.getItem('bgmFriends'))
        const now = new Date().getTime()
        if (data) {
            if (now - data.stamp < 1800000) {
                resolve(data)
            }
        }
        const newData = {
            stamp: now,
            friends: {}
        }
        $.ajax({
            url: $("#dock a")[0].href + '/friends',
            method: 'GET',
            dataType: 'text',
            success: function (res) {
                $(res).find("#memberUserList li").each(function () {
                    newData.friends[$(this).find('strong a').attr('href').split('/').pop()] = true
                })
                localStorage.setItem('bgmFriends', JSON.stringify(newData))
                resolve(newData)
            }
        })
    }).then(res => {
        const friends = res.friends;
        const lz = $.find('.postTopic a.avatar')[0].href.split('/').pop()
        const all = $('a.l')
        console.log(lz)
        for (let i = 0; i < all.length; i++) {
            let id = all[i].href.split('/').pop()
            if (friends[id]) {
                $(all[i]).after($(`<span class="friends-chip">好友</span>`))
            }
            if (id == lz) {
                $(all[i]).after($(`<span class="poster-chip">楼主</span>`))
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
    `
    heads[0].append(style)
})();