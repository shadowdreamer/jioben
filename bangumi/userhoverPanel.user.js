// ==UserScript==
// @name         bangumi鼠标移入显示用户信息悬浮框
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      1.5
// @description   
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==

(function () {
    let locker = false;
    // 本地缓存：1天TTL，最多缓存20个用户，使用LRU淘汰
    const HOVER_CACHE_KEY = 'bgmUserHoverCache';
    const HOVER_CACHE_TTL = 24 * 60 * 60 * 1000; // 1天
    const HOVER_CACHE_MAX = 20;

    function loadCache() {
        try {
            const raw = localStorage.getItem(HOVER_CACHE_KEY);
            const now = Date.now();
            let cache = raw ? JSON.parse(raw) : { version: 1, items: {} };
            if (!cache || typeof cache !== 'object' || !cache.items) {
                cache = { version: 1, items: {} };
            }
            // 清理过期项
            Object.keys(cache.items).forEach(k => {
                const it = cache.items[k];
                if (!it || !it.stamp || (now - it.stamp) > HOVER_CACHE_TTL) {
                    delete cache.items[k];
                }
            });
            return cache;
        } catch (e) {
            return { version: 1, items: {} };
        }
    }

    function saveCache(cache) {
        try {
            localStorage.setItem(HOVER_CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            // ignore quota errors
        }
    }

    function cacheGet(key) {
        const cache = loadCache();
        const now = Date.now();
        const it = cache.items[key];
        if (it && (now - it.stamp) <= HOVER_CACHE_TTL) {
            it.access = now;
            saveCache(cache);
            return it.data;
        }
        return null;
    }

    function cacheSet(key, data) {
        const cache = loadCache();
        const now = Date.now();
        cache.items[key] = { data: data, stamp: now, access: now };
        // 容量控制：超过最大值时按最近访问时间淘汰
        const keys = Object.keys(cache.items);
        if (keys.length > HOVER_CACHE_MAX) {
            keys.sort((a, b) => {
                const ia = cache.items[a]?.access || 0;
                const ib = cache.items[b]?.access || 0;
                return ia - ib; // 最旧的在前
            });
            const removeCount = keys.length - HOVER_CACHE_MAX;
            for (let i = 0; i < removeCount; i++) {
                delete cache.items[keys[i]];
            }
        }
        saveCache(cache);
    }
    $('[href*="/user/"].l,[href*="/user/"].avatar,#pm_sidebar a[onclick^="AddMSG"]').each(function () {
        let timer = null
        $(this).hover(function () {
            // get element screen position
            const pos = $(this).offset();
            timer = setTimeout(() => {
                if (locker) return false
                if (this.text == "查看好友列表" || $(this).find('.avatarSize75').length > 0) return false
                locker = true
                const layout = document.createElement('div')
                let timer = null
                $(layout).addClass('user-hover').css({
                    top: pos.top + 10 + 'px',
                    left: pos.left + 'px'
                })
                if ($(this).hasClass('avatar')) {
                    $(layout).addClass('fix-avatar-hover')
                }
                layout.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
                //...
                const userData = {}
                if (this.onclick) {
                    userData.id = this.onclick.toString().split("'")[1]
                } else {
                    let urlSplit = /.*\/user\/([^\/]*)\/?(.*)/.exec(this.href)
                    if (urlSplit[2]) return
                    userData.id = urlSplit[1]
                }
                userData.href = '/user/' + userData.id
                const req = {
                    req1: null,
                    req2: null
                }
                const cached = cacheGet(userData.href);
                if (cached) { Object.assign(userData, cached); }
                const noopReq = { abort: function () {} };
                Promise.all([
                    cached ? new Promise((r) => { req.req1 = noopReq; r(); }) : new Promise((r, j) => {
                        req.req1 = $.ajax({
                            url: userData.href,
                            dataType: 'text',
                            success: e => {
                                userData.self = /<a class="avatar" href="([^"]*)">/.exec(e)[1].split('/').pop()
                                if (userData.self != userData.id) {
                                    userData.sinkuro = /mall class="hot">\/([^<]*)<\/small>/.exec(e)[1]
                                    userData.sinkuroritsu = /<span class="percent" style="width:([^"]*)">/.exec(e)[1]
                                    userData.addFriend = /<a href="([^"']*)" id="connectFrd" class="chiiBtn">/.exec(e)
                                    userData.addFriend = userData.addFriend ? userData.addFriend[1] : false
                                }
                                userData.joinDate = /Bangumi<\/span> <span class="tip">([^<]*)<\/span>/.exec(e)[1]
                                userData.lastEvent = /<small class="time">([^<]*)<\/small><\/li>/.exec(e)
                                userData.watch = Array.from(
                                    e.match(/<a href="\/anime\/list\/[^"]+">[\s\S]*?<span class="type">[^<]+<\/span>\s*<span class="num">[0-9]+<\/span>[\s\S]*?<\/a>/g) || [],
                                    el => {
                                        const m = /<span class="type">([^<]+)<\/span>\s*<span class="num">([^<]+)<\/span>/.exec(el)
                                        return m ? `${m[1]} ${m[2]}` : ''
                                    }
                                );
                                r()
                            },
                            error: () => {
                                j()
                            }
                        })
                    }),
                    cached ? new Promise((r) => { req.req2 = noopReq; r(); }) : new Promise((r, j) => {
                        req.req2 = $.ajax({
                            url: 'https://api.bgm.tv/user/' + userData.id,
                            dataType: 'json',
                            success: e => {
                                userData.name = e.nickname
                                userData.avatar = e.avatar.large.replace(/https?/, 'https')
                                userData.sign = e.sign
                                userData.url = e.url
                                userData.message = `https://bgm.tv/pm/compose/${e.id}.chii`
                                r()
                            },
                            error: () => {
                                j()
                            }
                        })
                    })
                ]).then(() => {
                    layout.innerHTML = `
                        <img class='avater' src="${userData.avatar}"/>
                        <div class='user-info'>
                            <p class='user-name'><a href="${userData.href}" target="_blank">${userData.name}</a></p>
                            <p class='user-joindate'>${userData.joinDate}</p>
                            <span class='user-id'>@${userData.id}</span>
                            <p class='user-sign'>${userData.sign || ' '}</p>
                        </div>
                        ${userData.sinkuro ? `
                            <div class="shinkuro">
                            <div style="width:${userData.sinkuroritsu}" class="shinkuroritsu"></div>
                            <div class="shinkuro-text">
                                <span>${userData.sinkuro}</span> 
                                <span>同步率：${userData.sinkuroritsu}</span> 
                            </div>                                      
                            </div>
                            `: ''
                        }                
                        <div class='user-watch'>
                          ${(function () {
                            let tmp = ''
                            userData.watch.forEach(el => {
                                tmp += `<span>${el}</span>`
                            })
                            return tmp
                        })()}
                        </div>
                        <span class='user-lastevent'>Last@${userData.lastEvent ? userData.lastEvent[1] : ''}</span>
                        <a class = 'hover-panel-btn' href="${userData.message}" target="_blank">发送短信</a>
                        <span id="panel-friend">
                        ${userData.addFriend ? `
                                <a class='hover-panel-btn' href="${userData.addFriend}" id='PanelconnectFrd' href="javascript:void(0)">添加好友</a>                    
                            `: `
                        ${userData.id == userData.self ? '' : `<span class = 'my-friend' >我的好友</span>`}
                            `}
                        </span>
                        `

                    // 写入/更新缓存（提升最近访问时间）
                    cacheSet(userData.href, userData);

                    $(layout).addClass('dataready')
                    $('#PanelconnectFrd').click(function () {
                        $('#panel-friend').html(`<span class='my-friend'>正在添加...</span>`)
                        $("#robot").fadeIn(500);
                        $("#robot_balloon").html(AJAXtip['wait'] + AJAXtip['addingFrd'])
                        $.ajax({
                            type: "GET",
                            url: this + '&ajax=1',
                            success: function (html) {
                                $('#PanelconnectFrd').hide()
                                $('#panel-friend').html(`<span class = 'my-friend' >我的好友</span>`)
                                $("#robot_balloon").html(AJAXtip['addFrd'])
                                $("#robot").animate({
                                    opacity: 1
                                }, 1000).fadeOut(500)
                                localStorage.removeItem('bgmFriends')
                            },
                            error: function (html) {
                                $("#robot_balloon").html(AJAXtip['error'])
                                $("#robot").animate({
                                    opacity: 1
                                }, 1000).fadeOut(500)
                                $('#panel-friend').html(`<span class='my-friend-fail'>添加失败,稍后再试</span>`)
                            }
                        })
                        return false
                    })
                    
                }).catch(() => {
                    layout.innerHTML = `
                        <p style='font-size:16px; margin:25px 30px'>
                        <img style="height:15px;width:16px" src='/img/smiles/tv/15.gif'/><br/>
                        请求失败，请稍后再试。<br/><br/>或者使用<a href='https://bgm.tv'>bgm.tv</a>域名，</p>`
                    $(layout).addClass('dataready')
                })
                function removeLayout () {
                    setTimeout(() => {
                        $(layout).remove()
                        locker = false
                        req.req1.abort()
                        req.req2.abort()
                    }, 200);
                }
                $(document.body).after(layout).mouseout(function () {
                    timer = setTimeout(() => {
                        removeLayout()
                    }, 200);
                })
                $(layout).hover(function () {
                    clearTimeout(timer)
                }, function () {
                    removeLayout()
                })
                return false
            }, 300)
        },
            function () {
                clearTimeout(timer)
            }
        )
    })

    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
        html[data-theme=dark] .user-hover {
            background: rgba(40,40,40,.8);
            color: #fff;
        }
        .user-hover {
            position: absolute;
            background: rgba(255,255,255,.8);
            border-radius: 5px;
            box-shadow:  0 10px 15px -3px #0000001a,0 4px 6px -4px #0000001a;
            transition: all .2s ease-in;
            transform: translate(0,6px);
            font-size: 12px;
            z-index:999;
            color:#010101;
            backdrop-filter: blur(10px);
            overflow: hidden;
        }
        .fix-avatar-hover{
            transform: translate(45px,20px)
        }
        
        div.dataready {
            padding: 8px;
            font-weight: normal;
            text-align: left;
            min-width: 300px;
        }
        span.user-lastevent {
            color: var(--primary-color);
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
            background-color: var(--primary-color);
            display: inline-block;
            color: white;
            border-radius: 10px;
            padding: 0 10px;
            margin: 8px 4px 3px 0px;
        }
        .user-info .user-id{
            font-size: 12px;
            font-weight:normal;
            color:var(--primary-color);
        }
        .user-info .user-sign {
            word-break: break-all;
        }
        .user-watch {
            padding: 10px 0px 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            color: #2B2B2B;

        }
        .user-watch span {
            display: inline-block;
            flex:1;
            white-space: nowrap;
            margin-right: 3px;
            padding: 0px 4px;
            border-left: 4px solid var(--primary-color);
            background-color:  oklch(from var(--primary-color) calc(l* 2) calc(c* 0.8) h);
        }
        .user-watch span:last-of-type {
            margin-right: 0;
        }
        .shinkuro {
            width: 100%;
            height: 20px;
            background-color: oklch(from var(--primary-color) calc(l* 2) calc(c* 0.8) h);
            line-height: 20px;
            color: #2B2B2B;
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
            background: linear-gradient(to right, oklch(from var(--primary-color) calc(l* 2) calc(c* 0.6) h) 0%, var(--primary-color)  100%);
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
            background: var(--primary-color);
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            margin-left:10px;
            transition: all .2s ease-in;
        }
        a.hover-panel-btn:hover{
            background: oklch(from var(--primary-color) l calc(c* 0.8) h);
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

        .lds-roller {
            display: inline-block;
            position: relative;
            width: 64px;
            height: 64px;
            margin:10px 20px
          }
          .lds-roller div {
            animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            transform-origin: 32px 32px;
          }
          .lds-roller div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--primary-color);
            margin: -3px 0 0 -3px;
          }
          .lds-roller div:nth-child(1) {
            animation-delay: -0.036s;
          }
          .lds-roller div:nth-child(1):after {
            top: 50px;
            left: 50px;
          }
          .lds-roller div:nth-child(2) {
            animation-delay: -0.072s;
          }
          .lds-roller div:nth-child(2):after {
            top: 54px;
            left: 45px;
          }
          .lds-roller div:nth-child(3) {
            animation-delay: -0.108s;
          }
          .lds-roller div:nth-child(3):after {
            top: 57px;
            left: 39px;
          }
          .lds-roller div:nth-child(4) {
            animation-delay: -0.144s;
          }
          .lds-roller div:nth-child(4):after {
            top: 58px;
            left: 32px;
          }
          .lds-roller div:nth-child(5) {
            animation-delay: -0.18s;
          }
          .lds-roller div:nth-child(5):after {
            top: 57px;
            left: 25px;
          }
          .lds-roller div:nth-child(6) {
            animation-delay: -0.216s;
          }
          .lds-roller div:nth-child(6):after {
            top: 54px;
            left: 19px;
          }
          .lds-roller div:nth-child(7) {
            animation-delay: -0.252s;
          }
          .lds-roller div:nth-child(7):after {
            top: 50px;
            left: 14px;
          }
          .lds-roller div:nth-child(8) {
            animation-delay: -0.288s;
          }
          .lds-roller div:nth-child(8):after {
            top: 45px;
            left: 10px;
          }
          @keyframes lds-roller {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
        #comment_list div.sub_reply_collapse {
            opacity: 1;
        }
    `
    heads[0].append(style)
})();