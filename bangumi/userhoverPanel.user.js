// ==UserScript==
// @name         bangumi鼠标移入显示用户信息悬浮框
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.3
// @description   
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==

(function () {
    let locker = false
    $('[href^="/user"].l,[href^="/user"].avatar').each(function () {
        $(this).mouseover(function () {
            if (locker) return false
            if (this.text == "查看好友列表") return false
            locker = true
            const layout = document.createElement('div')
            let timer = null
            $(layout).addClass('user-hover')
            if ($(this).hasClass('avatar')) {
                $(layout).addClass('fix-avatar-hover')
            }
            layout.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
            //...
            const userData = {
                href: this.href,
                id: this.href.split('/').pop(),
                self: $('.idBadgerNeue a.avatar').attr('href').split('/').pop(),
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
                        userData.sinkuro = $(e).find('small.hot').html()
                        userData.sinkuroritsu = $(e).find('span.percent_text').html()
                        userData.addFriend = $(e).find('#connectFrd').attr('href')
                        r()

                    }
                })),
                new Promise(r => $.ajax({
                    url: 'https://api.bgm.tv/user/' + userData.id,
                    dataType: 'json',
                    success: e => {
                        userData.name = e.nickname
                        userData.avatar = e.avatar.large.replace(/https?/, 'https')
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
                ${
                    userData.sinkuro ? `
                    <div class="shinkuro">
                    <div style="width:${userData.sinkuroritsu}" class="shinkuroritsu"></div>
                    <div class="shinkuro-text">
                        <span>${userData.sinkuro.substr(2)}</span> 
                        <span>同步率：${userData.sinkuroritsu}</span> 
                    </div>                                      
                    </div>
                    `: ''
                    }                
                <div class='user-watch'>
                  ${(function () {
                        let tmp = ''
                        userData.watch.splice(1).forEach(el => {
                            tmp += `<span>${el}</span>`
                        })
                        return tmp
                    })()}
                </div>
                <a class = 'hover-panel-btn' href="${userData.message}" target="_blank">发送短信</a>
                <span id="panel-friend">
                ${ userData.addFriend ? `
                        <a class='hover-panel-btn' href="${userData.addFriend}" id='PanelconnectFrd' href="javascript:void(0)">添加好友</a>                    
                    `: `
                ${ userData.id == userData.self ? '' : `<span class = 'my-friend' >我的好友</span>`}
                    `}
                </span>
                `

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
                layout.innerHTML = "请求失败，稍后再试"
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
            background: white;
            box-shadow: 0px 0px 4px 1px #ddd;
            transition: all .2s ease-in;
            transform: translate(0,6px);
            z-index:999
        }
        .fix-avatar-hover{
            transform: translate(45px,20px)
        }
        div.dataready {
            padding: 8px;
            font-weight: normal;
            text-align: left;
        }
        div.dataready img {
            height: 75px;
            width:75px;
            border-radius: 5px;
        }
        .user-info {
            display: inline-block;
            vertical-align: top;
            width: 220px;
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
            margin: 8px 0 3px;
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
            background: #f09199;
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