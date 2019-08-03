// ==UserScript==
// @name         bangumi吊唁
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  * 
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==
const RIP = [
    "宇田淳一",
    "大村勇貴",
    "笠間結花",
    "木上益治",
    "栗木亜美",
    "武本康弘",
    "津田幸恵",
    "西屋太志",
    "横田圭佑",
    "渡邊美希子",
]
if(RIP.includes($('.nameSingle a').text())){
    $('body').css('filter','grayscale(1)')
}