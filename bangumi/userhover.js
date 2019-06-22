// ==UserScript==
// @name         用户信息悬浮框
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.3
// @description   
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==

(function () {
    let locker = false
    $('[href^="/user"].l').each(function () {
        $(this).mouseover(function () {
            if (locker) return false
            locker = true
            const layout = document.createElement('div')
            let timer = null
            $(layout).addClass('user-hover')
            setTimeout(() => {
                $(layout).addClass('showit')
            }, 1);
            layout.innerHTML = 'loading'
            //...
            const userData = {
                watch: []
            }
            Promise.all([
                new Promise(r => $.ajax({
                    url: this.href,
                    dataType: 'text',
                    success: e => {
                        userData.joinDate = $(e).find('.network_service .tip:eq(0)').text()
                        $(e).find('#anime [href^="/anime/list"]').each(function () {
                            userData.watch.push(this.innerHTML)
                        })
                        userData.isfriend = $(e).find('#friend_flag .fade').length
                        r()
                    }
                })),
                new Promise(r => $.ajax({
                    url: 'https://api.bgm.tv' + this.href.substr(14),
                    dataType: 'json',
                    success: e => {
                        userData.name = e.nickname
                        userData.avatar = e.avatar.large
                        userData.sign = e.sign
                        userData.url = e.url
                        userData.message = `https://bgm.tv/pm/compose/${e.id}.chii`
                        r()
                    }
                }))
            ]).then(() => {
                layout.innerHTML = `
                <img class='avater' src="${userData.avatar}"/>
                <div class='user-info'>
                    <p class='user-name'>${userData.name} </p>
                    <p class='user-joindate'>${userData.joinDate}</p>
                    <p class='user-sign'>${userData.sign}</p>
                </div>
                <div class='user-watch'>
                  <span>${userData.watch[1]}</span>
                  <span>${userData.watch[2]}</span>
                  <span>${userData.watch[3]}</span>
                  <span>${userData.watch[4]}</span>
                </div>
                <a class = 'send-message' href="${userData.message}" target="_blank">发送短信</a>
                `
                $(layout).addClass('dataready')
            })
            function removeLayout () {
                setTimeout(() => {
                    $(layout).remove()
                    locker = false
                }, 300);
            }
            $(this).after(layout).mouseout(function () {
                timer = setTimeout(() => {
                    removeLayout()
                }, 300);
            })
            $(layout).hover(function () {
                clearTimeout(timer)
            }, function () {
                removeLayout()
            })
            return false
        })

    })

    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
        .user-hover {
            position: absolute;
            height: 30px;
            width: 100px;
            background: white;
            box-shadow: 0px 0px 4px 1px #ddd;
            transition: all .2s ease-in;
            transform: translate(0,6px);
            opacity: 0.3;
            z-index:999
        }
        div.showit{
            opacity: 1;
            transform: translate(0,3);
        }
        div.dataready {
            height: 150px;
            width: 330px;
            padding: 8px;
            font-weight: normal;
        }
        div.dataready img {
            height: 75px;
        }
        .user-info {
            display: inline-block;
            width: 210px;
            margin: 0 10px 0 10px;
        }
        .user-info .user-name {
            font-size: 20px;
            font-weight: bold;
        }
        .user-info .user-joindate {
            background-color: #f6d9d9;
            display: inline-block;
            color: white;
            border-radius: 10px;
            padding: 0 10px;
            margin: 5px;
        }
        .user-info .user-sign {
            word-break: break-all;
        }
        .user-watch {
            border-top: 1px solid #f6d5d5;
            padding: 10px 0px 5px;
        }
        a.send-message {
            display: inline-block;
            float: right;
            margin: 0 10px;
            background: #f09199;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
        }
    `
    heads[0].append(style)
})();