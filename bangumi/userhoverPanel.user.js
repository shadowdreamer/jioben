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
            layout.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
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
                  ${(function(){
                      let tmp=''
                      userData.watch.splice(1).forEach(el=>{
                        tmp += `<span>${el}</span>`
                      })
                      return tmp
                  })()}
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
            background: white;
            box-shadow: 0px 0px 4px 1px #ddd;
            transition: all .2s ease-in;
            transform: translate(0,6px);
            opacity: 0.3 !important;
            z-index:999
        }
        div.showit{
            opacity: 1 !important;
            transform: translate(0,3px);
        }
        div.dataready {
            padding: 8px;
            font-weight: normal;
        }
        div.dataready img {
            height: 75px;
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
            border-top: 1px solid #f09199;
            padding: 10px 0px 5px;
            margin-bottom: 10px;
        }
        .user-watch span {
            display: inline-block;
            margin: 0px 3px;
            padding-right: 7px;
            border-left: 4px solid #f09199;
            background-color: #fce9e9;
        }
        a.send-message {
            display: inline-block;
            float: right;
            margin-bottom: 8px;
            background: #f09199;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
        }
        a.send-message:hover{
            background: #b4696f;
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