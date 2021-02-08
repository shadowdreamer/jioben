// ==UserScript==
// @name         bangumi批量生成空章节
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  * 
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/\d*/ep/create
// ==/UserScript==
(function(){
    const warp = document.createElement('div')
    warp.className="genrator"
    warp.innerHTML = `
        <span>初始章节</span> <input placeholder="大于等于1" name="start"/><br>
        <span>新增章数</span> <input placeholder="最大20" name="number"/><br>
        <span>首章日期</span> <input type="date" name="date"/><br>
        <span>播放间隔</span> <input value="7" placeholder="间隔天数" name="skip"/><br>
        <span>每节时间</span> <input placeholder="不填默认24m" name="duration"/><br>
        <button>添加</button>
    `
    $(warp).on('click','button',function(){
        let start = Number($(warp).find("[name=start]")) || '1',
        ep = $(warp).find("[name=number]").val(),
        date = $(warp).find("[name=date]").val(),
        skip = $(warp).find("[name=skip]").val(),
        duration = $(warp).find("[name=duration]").val() || '24m';
        ep = Number(ep)>20?20:Number(ep);
        console.log(date)
        // let str = "";
        // for(let i=0; i<ep; i++){
        //     str+=`${start+i}|||${duration}|${new Date(date[0],date[1],date[2]+(i*skip)).toISOString().slice(0,10)}\n`
        // }
        // console.log(str)
        // $('#eplist').val(str)
    })
    $('#batch').prepend(warp)
})()