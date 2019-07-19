// ==UserScript==
// @name         bangumi吊唁
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  * 
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==
const RIP = [
    '京都アニメーション'
]
if(RIP.includes($('.nameSingle a').text())){
    $('body').css('filter','grayscale(1)')
}