// ==UserScript==
// @name         在吐槽里显示bgm表情
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.2
// @description  *
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/.*
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/anime\/.*
// @include      /https?://(bgm\.tv|bangumi\.tv|chii\.in)/
// ==/UserScript==
(function () {
    'use strict';
    const smiles = { "(bgm10)": "https://bgm.tv/img/smiles/bgm/10.png", "(bgm11)": "https://bgm.tv/img/smiles/bgm/11.gif", "(bgm12)": "https://bgm.tv/img/smiles/bgm/12.png", "(bgm13)": "https://bgm.tv/img/smiles/bgm/13.png", "(bgm14)": "https://bgm.tv/img/smiles/bgm/14.png", "(bgm15)": "https://bgm.tv/img/smiles/bgm/15.png", "(bgm16)": "https://bgm.tv/img/smiles/bgm/16.png", "(bgm17)": "https://bgm.tv/img/smiles/bgm/17.png", "(bgm18)": "https://bgm.tv/img/smiles/bgm/18.png", "(bgm19)": "https://bgm.tv/img/smiles/bgm/19.png", "(bgm20)": "https://bgm.tv/img/smiles/bgm/20.png", "(bgm21)": "https://bgm.tv/img/smiles/bgm/21.png", "(bgm22)": "https://bgm.tv/img/smiles/bgm/22.png", "(bgm23)": "https://bgm.tv/img/smiles/bgm/23.gif", "(bgm24)": "https://bgm.tv/img/smiles/tv/01.gif", "(bgm25)": "https://bgm.tv/img/smiles/tv/02.gif", "(bgm26)": "https://bgm.tv/img/smiles/tv/03.gif", "(bgm27)": "https://bgm.tv/img/smiles/tv/04.gif", "(bgm28)": "https://bgm.tv/img/smiles/tv/05.gif", "(bgm29)": "https://bgm.tv/img/smiles/tv/06.gif", "(bgm30)": "https://bgm.tv/img/smiles/tv/07.gif", "(bgm31)": "https://bgm.tv/img/smiles/tv/08.gif", "(bgm32)": "https://bgm.tv/img/smiles/tv/09.gif", "(bgm33)": "https://bgm.tv/img/smiles/tv/10.gif", "(bgm34)": "https://bgm.tv/img/smiles/tv/11.gif", "(bgm35)": "https://bgm.tv/img/smiles/tv/12.gif", "(bgm36)": "https://bgm.tv/img/smiles/tv/13.gif", "(bgm37)": "https://bgm.tv/img/smiles/tv/14.gif", "(bgm38)": "https://bgm.tv/img/smiles/tv/15.gif", "(bgm39)": "https://bgm.tv/img/smiles/tv/16.gif", "(bgm40)": "https://bgm.tv/img/smiles/tv/17.gif", "(bgm41)": "https://bgm.tv/img/smiles/tv/18.gif", "(bgm42)": "https://bgm.tv/img/smiles/tv/19.gif", "(bgm43)": "https://bgm.tv/img/smiles/tv/20.gif", "(bgm44)": "https://bgm.tv/img/smiles/tv/21.gif", "(bgm45)": "https://bgm.tv/img/smiles/tv/22.gif", "(bgm46)": "https://bgm.tv/img/smiles/tv/23.gif", "(bgm47)": "https://bgm.tv/img/smiles/tv/24.gif", "(bgm48)": "https://bgm.tv/img/smiles/tv/25.gif", "(bgm49)": "https://bgm.tv/img/smiles/tv/26.gif", "(bgm50)": "https://bgm.tv/img/smiles/tv/27.gif", "(bgm51)": "https://bgm.tv/img/smiles/tv/28.gif", "(bgm52)": "https://bgm.tv/img/smiles/tv/29.gif", "(bgm53)": "https://bgm.tv/img/smiles/tv/30.gif", "(bgm54)": "https://bgm.tv/img/smiles/tv/31.gif", "(bgm55)": "https://bgm.tv/img/smiles/tv/32.gif", "(bgm56)": "https://bgm.tv/img/smiles/tv/33.gif", "(bgm57)": "https://bgm.tv/img/smiles/tv/34.gif", "(bgm58)": "https://bgm.tv/img/smiles/tv/35.gif", "(bgm59)": "https://bgm.tv/img/smiles/tv/36.gif", "(bgm60)": "https://bgm.tv/img/smiles/tv/37.gif", "(bgm61)": "https://bgm.tv/img/smiles/tv/38.gif", "(bgm62)": "https://bgm.tv/img/smiles/tv/39.gif", "(bgm63)": "https://bgm.tv/img/smiles/tv/40.gif", "(bgm64)": "https://bgm.tv/img/smiles/tv/41.gif", "(bgm65)": "https://bgm.tv/img/smiles/tv/42.gif", "(bgm66)": "https://bgm.tv/img/smiles/tv/43.gif", "(bgm67)": "https://bgm.tv/img/smiles/tv/44.gif", "(bgm68)": "https://bgm.tv/img/smiles/tv/45.gif", "(bgm69)": "https://bgm.tv/img/smiles/tv/46.gif", "(bgm70)": "https://bgm.tv/img/smiles/tv/47.gif", "(bgm71)": "https://bgm.tv/img/smiles/tv/48.gif", "(bgm72)": "https://bgm.tv/img/smiles/tv/49.gif", "(bgm73)": "https://bgm.tv/img/smiles/tv/50.gif", "(bgm74)": "https://bgm.tv/img/smiles/tv/51.gif", "(bgm75)": "https://bgm.tv/img/smiles/tv/52.gif", "(bgm76)": "https://bgm.tv/img/smiles/tv/53.gif", "(bgm77)": "https://bgm.tv/img/smiles/tv/54.gif", "(bgm78)": "https://bgm.tv/img/smiles/tv/55.gif", "(bgm79)": "https://bgm.tv/img/smiles/tv/56.gif", "(bgm80)": "https://bgm.tv/img/smiles/tv/57.gif", "(bgm81)": "https://bgm.tv/img/smiles/tv/58.gif", "(bgm82)": "https://bgm.tv/img/smiles/tv/59.gif", "(bgm83)": "https://bgm.tv/img/smiles/tv/60.gif", "(bgm84)": "https://bgm.tv/img/smiles/tv/61.gif", "(bgm85)": "https://bgm.tv/img/smiles/tv/62.gif", "(bgm86)": "https://bgm.tv/img/smiles/tv/63.gif", "(bgm87)": "https://bgm.tv/img/smiles/tv/64.gif", "(bgm88)": "https://bgm.tv/img/smiles/tv/65.gif", "(bgm89)": "https://bgm.tv/img/smiles/tv/66.gif", "(bgm90)": "https://bgm.tv/img/smiles/tv/67.gif", "(bgm91)": "https://bgm.tv/img/smiles/tv/68.gif", "(bgm92)": "https://bgm.tv/img/smiles/tv/69.gif", "(bgm93)": "https://bgm.tv/img/smiles/tv/70.gif", "(bgm94)": "https://bgm.tv/img/smiles/tv/71.gif", "(bgm95)": "https://bgm.tv/img/smiles/tv/72.gif", "(bgm96)": "https://bgm.tv/img/smiles/tv/73.gif", "(bgm97)": "https://bgm.tv/img/smiles/tv/74.gif", "(bgm98)": "https://bgm.tv/img/smiles/tv/75.gif", "(bgm99)": "https://bgm.tv/img/smiles/tv/76.gif", "(bgm100)": "https://bgm.tv/img/smiles/tv/77.gif", "(bgm101)": "https://bgm.tv/img/smiles/tv/78.gif", "(bgm102)": "https://bgm.tv/img/smiles/tv/79.gif", "(bgm103)": "https://bgm.tv/img/smiles/tv/80.gif", "(bgm104)": "https://bgm.tv/img/smiles/tv/81.gif", "(bgm105)": "https://bgm.tv/img/smiles/tv/82.gif", "(bgm106)": "https://bgm.tv/img/smiles/tv/83.gif", "(bgm107)": "https://bgm.tv/img/smiles/tv/84.gif", "(bgm108)": "https://bgm.tv/img/smiles/tv/85.gif", "(bgm109)": "https://bgm.tv/img/smiles/tv/86.gif", "(bgm110)": "https://bgm.tv/img/smiles/tv/87.gif", "(bgm111)": "https://bgm.tv/img/smiles/tv/88.gif", "(bgm112)": "https://bgm.tv/img/smiles/tv/89.gif", "(bgm113)": "https://bgm.tv/img/smiles/tv/90.gif", "(bgm114)": "https://bgm.tv/img/smiles/tv/91.gif", "(bgm115)": "https://bgm.tv/img/smiles/tv/92.gif", "(bgm116)": "https://bgm.tv/img/smiles/tv/93.gif", "(bgm117)": "https://bgm.tv/img/smiles/tv/94.gif", "(bgm118)": "https://bgm.tv/img/smiles/tv/95.gif", "(bgm119)": "https://bgm.tv/img/smiles/tv/96.gif", "(bgm120)": "https://bgm.tv/img/smiles/tv/97.gif", "(bgm121)": "https://bgm.tv/img/smiles/tv/98.gif", "(bgm122)": "https://bgm.tv/img/smiles/tv/99.gif", "(bgm123)": "https://bgm.tv/img/smiles/tv/100.gif" }
    const henshin = dom => {
        if (/\(bgm[0-9]*\)/.test(dom.innerText)) {
            dom.innerHTML = dom.innerHTML.replace(/\(bgm[0-9]*\)/g, s => `<img src="${smiles[s]}" alt="${s}">`)
        }
    }
    $('.text,.status,.even.reply_item, .SidePanel.png_bg, .collectInfo').each(function () {
        henshin(this)
    })
    $(document).ajaxComplete(function (ev, xhr, setting) {
        if (/\(bgm[0-9]*\)/.test(xhr.responseText) && /timeline/.test(setting.url)) {
            setTimeout(() => {
                $('.status,.even.reply_item, .SidePanel.png_bg, .collectInfo').each(function () {
                    if (/\(bgm[0-9]*\)/.test(this.innerText)) {
                        henshin(this)
                        const _this = this
                        $(this).find('.cmt_reply').each(function(){
                            $(this).click(()=>{
                                $(_this).parent().find('.odd form textarea')[0].value += this.innerHTML
                            })
                        })
                    }
                })
            }, 39);
        }
    })
})();