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
            <span>
            ${res.friends[id] ? `<span class="chip-warpper friends-chip">
            <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3183"><path d="M804.223 403.955a133.977 133.977 0 0 0-45.752 8.016c20.177-109.526-27.374-201.793-100.338-246.591-69.31-42.562-170.685-42.917-244.138 46.57-49.133-59.467-116.043-85.588-184.916-70.565-84.033 18.377-148.98 93.303-161.631 186.498-10.09 74.49 2.126 267.285 333.733 447.975a26.752 26.752 0 0 0 25.739 0c24.484-13.306 47.932-27.156 69.963-41.252 42.263 54.068 105.081 104.047 187.37 148.898 3.982 2.182 8.453 3.273 12.87 3.273s8.835-1.091 12.87-3.273c97.557-53.168 167.793-113.562 208.801-179.408 45.533-73.126 43.952-134.61 34.627-173.329-17.722-73.48-80.434-126.812-149.198-126.812m-107.1 422.373C476.16 701.15 485.759 579.3 494.156 544.4c11.67-48.56 52.024-83.842 95.812-83.842 32.392 0 62.166 19.686 83.815 55.432 5.016 8.289 13.852 13.36 23.34 13.36s18.323-5.072 23.34-13.36c21.595-35.746 51.368-55.432 83.761-55.432 43.844 0 84.142 35.283 95.812 83.842 8.452 34.9 17.995 156.779-202.913 281.928" fill="" p-id="3184"></path></svg>
            </span>` : ''}
            ${id == lz ? `<span class="chip-warpper poster-chip">
            <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4990"><path d="M568.2 570.5c-9.9-8.9-24.1-11-36.2-5.3l-143.6 68c-12.4 5.9-19.7 18.5-18.8 32.1 0.9 13.6 10 25.1 23 29.2l19.8 6.2v206.7c0 21 17 38 38 38H515c21 0 38-17 38-38V675.1l24.2-69.1c4.4-12.6 0.9-26.5-9-35.5zM532.4 481.5l-69.7-155.6c-6.7-14.8-19.3-26.3-34.8-31.4-15.5-5.1-32.4-3.4-46.6 4.6L89.1 463.8c-26.3 14.8-36.8 46.7-24.4 74.3l44.6 99.5c9.6 21.5 30.5 34.3 52.7 34.3 6.3 0 12.7-1 19-3.2l317.3-108.6c15.4-5.3 27.9-16.8 34.4-31.8 6.4-14.9 6.4-31.9-0.3-46.8zM956.3 308.5c0-61.1-23.8-118.5-67-161.7-43.2-43.2-100.6-67-161.7-67-21.9 0-43.3 3.1-63.8 9l179 417.2c16.7-9.8 32.4-21.8 46.4-35.9 43.3-43.1 67.1-100.6 67.1-161.6zM565.9 146.8c-43.2 43.2-67 100.6-67 161.7s23.8 118.5 67 161.7c43.2 43.2 100.6 67 161.7 67 21.9 0 43.3-3.1 63.8-9L612.4 111c-16.8 9.7-32.4 21.7-46.5 35.8z" fill="" p-id="4991"></path></svg>         
            </span>` : ''}
            </span>
            `
            if (badge) $(all[i]).after($(badge))
        }
    });
    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
    span.chip-warpper{
        display: inline-block;
        padding: 1px 2px;
        border-radius: 3px;
        line-height: 13px;
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