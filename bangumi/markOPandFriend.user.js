// ==UserScript==
// @name         标记楼主和好友
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.3
// @description  好友列表缓存在本地
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
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
        const lz = $.find('.postTopic a.avatar')[0]?$.find('.postTopic a.avatar')[0].href.split('/').pop():''
        const all = $('strong a.l')
        for (let i = 0; i < all.length; i++) {
            let id = all[i].href.split('/').pop()
            let badge = `
            <span class="dovahkiin-chips">
            ${res.friends[id] ? '<span class="chip-warpper friends-chip">好友</span>' : ''}
            ${id == lz ? '<span class="chip-warpper poster-chip">楼主</span>' : ''}
            </span>
            `
            if (badge) $(all[i]).after($(badge))
        }
    });
    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
    span.dovahkiin-chips{
        transform: scale(0.8) translate(-4px, -4px);
        display: inline-block;
    }
    span.chip-warpper{
        display: inline-block;
        font-weight: normal;
        padding: 0px 3px;
        border-radius: 3px;
    }
    span.friends-chip {
        background-color: #369cf8;
        color: white;
    }
    span.poster-chip {
        background-color: #f09199;
        color: white;
    }
    `
    heads[0].append(style)
})();