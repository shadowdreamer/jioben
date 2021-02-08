// ==UserScript==
// @name         bangumi图片上传
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.6
// @description  上传图片到niupic，catbox,管理历史上传记录
// @author       dovahkiin
// @include      http*://bgm.tv*
// @include      http*://bangumi.tv*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @noframes
// ==/UserScript==
(function(){   
    const apiConfig = {
        'catbox':{
            url:'https://catbox.moe/user/api.php',
            fileKey:'fileToUpload',
            extra:{
                "reqtype":"fileupload"
            },
            resFn(res){
                return res.responseText
            }
        },
        'sm.ms':{

        }
    };
    let targetArea = null;
    const warp = document.createElement('div');
    const instance = new Vue({
        data:()=>({
            show:false,
            test:123,
            blur:false,
            uploadApi:'catbox',
            open:false,
            position: {
                top:"0px",
                left:"0px"
            },
            file:null,
            url:[],
            urlList:[],
            openHistory:false,
        }),
        computed: {
            apis(){
                return Object.keys(apiConfig)
            },
            notices() {
                if (!this.file) {
                    return ['拖动或者粘贴文件到此处', '只能粘贴剪贴板图片(如qq截图)', '支持多个文件']
                } else if (this.file == 'dragenter') {
                    return ['松手']
                } else {
                    function renderSize(value) {
                        if (!value) {
                            return "0 Bytes";
                        }
                        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB");
                        var index = 0;
                        var srcsize = parseFloat(value);
                        index = Math.floor(Math.log(srcsize) / Math.log(1024));
                        var size = srcsize / Math.pow(1024, index);
                        size = size.toFixed(2);//保留的小数位数
                        return size + unitArr[index];
                    }
                    return Array.from(this.file, el => el.name + ',' + renderSize(el.size))
                }
            }
        },
        methods: {
            insert(t){
                if($(targetArea).val()){
                    $(targetArea).append(`\n`+t)
                }else{
                    $(targetArea).append(t)
                }
            },
            pushToUpload(){
                if (!this.file) return;
                this.url = this.file.map(()=>"等待上传")
                Array.prototype.forEach.call(this.file, (el, index) => {
                    this.upload(el, index)
                })
            },
            upload(file, index){
                let config = apiConfig[this.uploadApi];
                let formData = new FormData()
                formData.append(config.fileKey,file)
                for(let k in config.extra){
                    formData.append(k,config.extra[k])
                }
                console.log('readyupload',file,index,config)
                GM_xmlhttpRequest({
                    url: config.url,
                    method: "POST",
                    data: formData,
                    binary: true,
                    // onprogress:ev=>{
                    //     console.log('onprogress:',ev)
                    // },
                    onload: res => {
                        console.log(res)
                        if (res.status == 200) {
                            let url = config.resFn(res)
                            this.$set(this.url,index,url)
                            this.saveToLocal(url);
                        } else {
                            this.$set(this.url,index,'失败')
                        }
                    },
                    onerror(err){
                        console.log(err)
                    }
                });
                console.log('123123')
            },
            copyToClipboard(ref) {
                let focus = this.$refs[ref];
                console.log(focus[0])
                focus[0].select();
                document.execCommand("copy");
            },
            saveToLocal(url) {
                this.urlList.push(url);
                localStorage.setItem("imgUrl", JSON.stringify(this.urlList));
            },
            deleteThisImg(index) {
                this.urlList.splice(index, 1);
                localStorage.setItem("imgUrl", JSON.stringify(this.urlList));
            },
            fileFilter(file){                
                return Array.prototype.filter.call(file,el=> /image/.test(el.type) )
            },
            dodrop(ev) {
                this.file = this.fileFilter(ev.dataTransfer.files)
                this.url = []
            },
            pasteEvt(ev) {
                this.file = this.fileFilter(ev.clipboardData.files)
                this.url = []
            },
            change(ev) {
                this.file = this.fileFilter(ev.target.files)
                this.url = []
            },

            pickfile(){
                this.$refs.input.click()
            },
            addWithTag(url) {
                return `[img]${url}[/img]`;
            },
            addHttp(url) {
                if (/^http(s)?/.test(url)) {
                    return url
                } else {
                    return "https://" + url
                }
            },
        },
        mounted() {
            if (localStorage.getItem("imgUrl")) {
                this.urlList = JSON.parse(localStorage.getItem("imgUrl"));
            } else {
                localStorage.setItem("imgUrl", "[]");
            }
            $(document).on('click','textarea.reply',e=>{
                targetArea = e.currentTarget
                this.blur = false
                Object.assign(this.position,getElementRT(targetArea))
                this.show = true;
                targetArea.addEventListener('blur',()=>{
                    this.blur = true
                    this.open = false
                },{once:true})
            })
            window.addEventListener('resize',()=>{
                if(targetArea){
                    Object.assign(this.position,getElementRT(targetArea))
                }
            })
        },
        template:/*html*/
        `<div v-show="show" ref="uploader" class="uploader-warp" :style="position" >
            <div @click="open=!open" class="uploader-btn">
                <svg t="1611571749814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3807" fill="currentColor"><path d="M810.666667 554.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v16.213334l-63.146667-63.146667a119.04 119.04 0 0 0-167.68 0l-29.866666 29.866667-105.813334-105.813334a121.6 121.6 0 0 0-167.68 0L170.666667 537.6V298.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h298.666667a42.666667 42.666667 0 0 0 0-85.333333H213.333333a128 128 0 0 0-128 128v512a128 128 0 0 0 128 128h512a128 128 0 0 0 128-128v-213.333334a42.666667 42.666667 0 0 0-42.666666-42.666666zM213.333333 853.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-152.32l123.733333-123.733334a33.706667 33.706667 0 0 1 46.506667 0l135.253333 135.253334 183.466667 183.466666z m554.666667-42.666666a37.973333 37.973333 0 0 1-7.68 22.613333L567.893333 640l29.866667-29.866667a32.853333 32.853333 0 0 1 46.933333 0L768 734.293333z m200.96-627.626667l-128-128a42.666667 42.666667 0 0 0-14.08-8.96 42.666667 42.666667 0 0 0-32.426667 0 42.666667 42.666667 0 0 0-14.08 8.96l-128 128a42.666667 42.666667 0 0 0 60.586667 60.586667L768 188.16V426.666667a42.666667 42.666667 0 0 0 85.333333 0V188.16l55.04 55.466667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z" p-id="3808"></path></svg>
            </div>
            <div class="imgupload-warp" v-show="open">
                    
                <span>选择上传网站：</span>
                <select  v-model="uploadApi" >
                    <option :value="api" v-for="api in apis" :key="api">{{api}}</option>
                </select>
    
                <div
                    class = "drop-area"
                    contenteditable="true"
                    @dragenter.stop.prevent = " file = 'dragenter'"
                    @dragover.stop.prevent
                    @drop.stop.prevent = "dodrop($event)"
                    @paste.stop.prevent = "pasteEvt($event)"
                    @click="pickfile"
                    > 
                    <p v-for="notice in notices">{{notice}}</p>
                </div>
    
                <input
                    ref="input"
                    style="display: none;"
                    type="file"
                    multiple="multiple"
                    :files = "file"
                    accept="image/*"
                    @change="change($event)"
                />
                <div style="margin:2px 0px; text-align: right;">
                    <input style="margin-right:8px" type="button" value="上传" @click="pushToUpload"/>
                    <input type="button" value="清空" @click="file = null"/>
                </div>
                <div class="url-box"  v-for="(imgurl,index) in url"  :key = "index">
                    <input type="text" :value="addWithTag(imgurl)" :ref="'img-url-' + index" readonly>
                    <div>
                        <input style="margin-right:8px" type="button" value="复制" @click="copyToClipboard('img-url-' + index)">
                        <input type="button" value="插入" @click="insert(addWithTag(imgurl))">
                    </div>
                </div>
                <div style="margin:2px 0px; display: flex; justify-content: flex-end;">
                    <input type="button" value="历史记录" @click="openHistory=!openHistory">
                </div>
                <div class="img-history" v-if="openHistory">
                    <ul>
                        <li v-for="(url,index) in urlList" :key="index" class = "img-history-list">
                            <img :src="addHttp(url)">
                            <div class="img-options">
                                <input type="button" value="插入" @click="insert(addWithTag(url))">
                                <input type="button" value="删除" @click="deleteThisImg(index)">
                            </div>
                        </li>
                    </ul>
                </div>    
            </div>
        </div>
        
        `
    })
    document.body.appendChild(warp)
    instance.$mount(warp)
    
    
    /**
     * @param {HTMLElement} el
    */
    function getElementRT(el){
        let {top,right} = el.getBoundingClientRect();
        return {
            top:window.scrollY + top + 'px',
            left:right + 'px',
        }
    }


    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = /*css*/`
     .uploader-warp{
        position: absolute;
        
    }
    .uploader-warp input[type="button"]{
        appearance: none;
        transition: all 250ms ease 0s;
        user-select: none;
        white-space: nowrap;
        vertical-align: middle;
        outline: none;
        width: auto;
        line-height: 1.2;
        border-radius: 0.375rem;
        font-weight: 600;
        height: 22px;
        min-width: 2rem;
        font-size: 0.75rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        border:none;
        color:#fff;
        background-color:#F09199;
    }
    .uploader-warp input[type="button"]:hover{
        background: #A0585D;
    }
    .uploader-warp input[type="text"],.drop-area{
        outline: 0px;
        font-size: 0.75rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        border-radius: 0.125rem;
        border-width: 1px;
        border-style: solid;
    }
    .uploader-warp input[type="text"]:focus{
        z-index: 1;
        border-color: #F09199;
        box-shadow:#F09199 0px 0px 0px 1px;
    } 
    .uploader-btn{
        height:25px;
        width:25px;
        color:#c2c2c2;
        opacity:0.7;
        cursor: pointer;
    }
    .uploader-btn:hover{
        opacity:1;
        color:#F09199;
    }
    .url-box{
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
    }

    .imgupload-warp{
        position: relative;
        left:28px;
        top: -28px;
        width:283px;
        padding:5px 12px;
        background:#fff;
        border-radius:5px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(240,145,153,0.6);
    }
    .drop-area{
        min-height: 100px;
        white-space: nowrap;
        border: 1px solid #d2d2d2;
        padding:2px;
        background-color:#fff;
        font-size:10px;
        over-flow:hidden;
        cursor: pointer;
    }
    .img-history{
        max-height: 350px;
        overflow-y: auto; 
    }
    .img-history img{
        height: 60px;
        transition: all 250ms ease 0s;
    }

    .img-history-list{
        display:flex;
        justify-content : space-between
    }
    .img-history-list:nth-of-type(2n+1){
        background-color:#ffffff;
    }
    .img-history-list:nth-of-type(2n){
        background-color:#f1f1f1;
    }
    .img-options{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 5px;
    } 

    `
    heads[0].append(style)
})()