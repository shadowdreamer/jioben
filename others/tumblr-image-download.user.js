// ==UserScript==
// @name           Tumlbr图片一键下载
// @name:en        Download Tumblr Images
// @namespace      https://github.com/shadowdreamer/jioben
// @version        0.1
// @description    一键下载一个Post中的所有图片
// @description:en Download all images from a Tumblr photoset
// @author         dovahkiin
// @match          http*://*.tumblr.com/post/*
// @run-at         document-end
// @license        MIT License
// ==/UserScript==

(function(){
    let btn = document.createElement('li')
    btn.innerHTML = '<a>下载图片</a>'
    btn.href = "javascript:void(0)"
    btn.setAttribute('style','cursor:pointer')
    document.querySelector('.post_info').append(btn)
    btn.addEventListener('click',startDownload)
    
    async function startDownload(){
        const files = await getFileNameAndBlob();
        const dirHandler = await window.showDirectoryPicker()
        for(const file of files){
            const fileHandler = await dirHandler.getFileHandle(file.fileName,{create:true})
            const writable = await fileHandler.createWritable()
            await writable.write(file.blob);
            await writable.close()
        }

    }

    async function getFileNameAndBlob(){
        const nodeList = document.querySelector('iframe.photoset').contentDocument
        .querySelectorAll('img');
        
        // 根据tag生成文件名
        const tags = Array.prototype.map.call(
            document.querySelectorAll('.tag'),
            e=>e.innerText.replace(/#\s*/,"")).join('-')            
        const fileName = tags +'-'+ new Date().toISOString().slice(0,10)
        
        const list = []
        for(const img of nodeList){
            const blob = await(await fetch(img.src)).blob()
            const suffix = img.src.split('.').pop()
            list.push({
                blob,
                fileName:`${fileName}-${list.length+1}.${suffix}`
            })
        }
        return list;
    }
})()
