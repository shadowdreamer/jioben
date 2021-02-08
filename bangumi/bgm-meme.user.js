// ==UserScript==
// @name         bangumi自定义表情
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  邮件
// @author       dovahkiin
// @include      http*://bgm.tv*
// @include      http*://bangumi.tv*
// ==/UserScript==

(function(){   
    const defaultEmojis = [
        "https://static.saraba1st.com/image/smiley/face2017/001.png",
        "https://static.saraba1st.com/image/smiley/face2017/002.png",
        "https://static.saraba1st.com/image/smiley/face2017/003.png",
        "https://static.saraba1st.com/image/smiley/face2017/033.png",
        "https://static.saraba1st.com/image/smiley/face2017/005.png",
        "https://static.saraba1st.com/image/smiley/face2017/006.png",
        "https://static.saraba1st.com/image/smiley/face2017/007.png",
        "https://static.saraba1st.com/image/smiley/face2017/008.png",
        "https://static.saraba1st.com/image/smiley/face2017/023.png",
        "https://static.saraba1st.com/image/smiley/face2017/010.png",
        "https://static.saraba1st.com/image/smiley/face2017/011.png",
        "https://static.saraba1st.com/image/smiley/face2017/012.png",
        "https://static.saraba1st.com/image/smiley/face2017/013.png",
        "https://static.saraba1st.com/image/smiley/face2017/014.png",
        "https://static.saraba1st.com/image/smiley/face2017/015.png",
        "https://static.saraba1st.com/image/smiley/face2017/016.png",
        "https://static.saraba1st.com/image/smiley/face2017/017.png",
        "https://static.saraba1st.com/image/smiley/face2017/018.png",
        "https://static.saraba1st.com/image/smiley/face2017/019.png",
        "https://static.saraba1st.com/image/smiley/face2017/020.png",
        "https://static.saraba1st.com/image/smiley/face2017/021.png",
    ]
    let targetArea = null;
    const script = document.createElement('script')
    script.setAttribute('src', "https://cdn.jsdelivr.net/npm/vue/dist/vue.js")
    script.onload = () => {
        init()
    }
    document.head.appendChild(script)
    function init(){
        const warp = document.createElement('div');
        const instance = new Vue({
            data:()=>({
                show:false,
                test:123,
                position:{
                    top:0,
                    left:0
                },
                showSmall:false,
                showLarge:false,
                lastList:[
                ],
                emojiList:[
                    
                ], 
                timer:null,
                setting:false,
                selectList:[],
            }),
            computed:{ 
                btnPosition(){
                    return {
                        top:this.position.top+4+'px',
                        left:this.position.left-20 + 'px',
                    }
                },
            },
            methods: {
                insert(t){
                    targetArea.value += `[img]${t}[/img]`;
                    if(this.showLarge){
                        this.lastList.push(t);
                        if(this.lastList.length>10){
                            this.lastList.pop()
                        }
                    }
                    this.showLarge = false;
                    this.showSmall = false;
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
                openSmall(){
                    if(this.showLarge)return;
                    clearTimeout(this.timer)
                    this.timer = setTimeout(()=>{
                        this.showSmall = true
                    },100)
                },
                hideSmall(){
                    clearTimeout(this.timer)
                    this.timer = setTimeout(()=>{
                        this.showSmall = false
                    },200)
                },
                openLarge(){
                    this.showLarge = true;
                    this.showSmall = false;
                    const outSideClick = e=>{ 
                        if(!this.$refs.uploader.contains(e.target)){
                            this.showLarge = false;
                            document.removeEventListener('click', outSideClick)
                        }
                    }
                    document.addEventListener('click',outSideClick)
                },
                exportJson(){

                },
                importJson(){

                },
                saveToLocal(){
                    let lastStr = JSON.stringify(this.lastList);
                    let listStr = JSON.stringify(this.emojiList);
                    window.localStorage.setItem('cure_lastStr',lastStr)
                    window.localStorage.setItem('cure_listStr',listStr)
                },
                deleteSelect(){
                    this.emojiList = this.emojiList.filter(el=>!this.selectList.includes(el))
                    this.lastList = this.lastList.filter(el=>!this.selectList.includes(el));
                    this.saveToLocal()
                },
                toggleSelect(url){
                    let idx = this.selectList.indexOf(url);
                    if(idx>=0){
                        this.selectList.splice(idx,1)
                    }else{
                        this.selectList.push(url)
                    }
                },
                initImgClick(){
                    $('img').on('contextmenu',e=>{
                        if(e.ctrlKey){
                            e.preventDefault()
                            let menu  = document.createElement('div');
                            $(menu).addClass('meme-contextmenu').css('top',e.pageY).css('left',e.pageX)
                            menu.innerHTML = `
                            <svg t="1612780482032"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2157" fill="currentColor"><path d="M928 544C928 561.664 913.664 576 896 576l-128 0 0 128c0 17.728-14.336 32-32 32S704 721.728 704 704L704 576 576 576C558.336 576 544 561.664 544 544S558.336 512 576 512l128 0L704 384c0-17.664 14.336-32 32-32S768 366.336 768 384l0 128 128 0C913.664 512 928 526.336 928 544zM532.544 829.888l15.296-12.672c36.928-30.592 70.208-58.112 100.16-83.776 13.44-11.456 14.976-31.68 3.52-45.12-11.456-13.376-31.616-14.976-45.12-3.52-28.288 24.192-59.712 50.176-94.336 78.848-153.024-126.72-237.568-197.248-285.952-289.28C192.32 410.368 183.424 348.736 200.384 296.256 213.12 256.768 240.64 224.896 277.888 206.4c34.944-17.344 77.248-19.136 116.48-4.864 39.872 14.592 72.128 44.544 88.384 82.176 10.112 23.36 48.64 23.36 58.752 0 16.256-37.568 48.448-67.52 88.32-82.112 39.04-14.4 81.536-12.608 116.544 4.8 63.36 31.488 94.656 96.64 83.584 174.336-2.496 17.472 9.664 33.664 27.2 36.16 17.216 2.112 33.728-9.664 36.16-27.2 14.848-104.768-30.528-196.992-118.528-240.64-50.624-25.152-111.552-27.84-166.976-7.616-37.952 13.888-71.04 37.76-95.68 68.288C487.424 179.2 454.336 155.328 416.32 141.44 360.832 121.152 300.032 123.968 249.408 149.12 196.608 175.296 157.568 220.544 139.456 276.544c-15.616 48.32-23.04 127.04 30.08 227.712 54.656 104 149.056 182.208 305.344 311.744l16.768 13.888c5.952 4.928 13.184 7.36 20.416 7.36S526.656 834.816 532.544 829.888z" p-id="2158"></path></svg>
                            `
                            document.body.append(menu)
                            $(menu).on('click',()=>{ 
                                this.emojiList.push(e.target.src);
                                this.saveToLocal()
                                $(menu).remove();
                            })
                            
                            const outsideClickListener = (event) => {
                                const $target = $(event.target);
                                if (!$target.closest(menu).length && $(menu).is(':visible')) {
                                    $(menu).remove();
                                    document.removeEventListener('click', outsideClickListener)
                                }
                            }                        
                            document.addEventListener('click', outsideClickListener)
                        }
                    })
                }
            },
            mounted() {
                if (localStorage.getItem("cure_lastStr")) {
                    this.lastList = JSON.parse(localStorage.getItem("cure_lastStr"));
                    this.emojiList = JSON.parse(localStorage.getItem("cure_listStr"));
                } else {
                    this.lastList = defaultEmojis.slice(0,10);
                    this.emojiList = defaultEmojis;
                    this.saveToLocal()
                }
                $(document).on('click','textarea.reply',e=>{
                    targetArea = e.currentTarget 
                    Object.assign(this.position,getElementLT(targetArea))
                    this.show = true;
                });
                this.initImgClick()
            },
            template:/*html*/
            `<div v-show="show" ref="uploader" class="uploader-warp" :style="btnPosition" >
                <div class="uploader-btn" 
                    @mouseenter="openSmall"
                    @mouseleave="hideSmall"
                    @click="openLarge">
                    <svg t="1612682881603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4973" fill="currentColor"><path d="M1024 512C1024 229.23 794.77 0 512 0S0 229.23 0 512s229.23 512 512 512c117.41 0 228.826-39.669 318.768-111.313 10.79-8.595 12.569-24.308 3.975-35.097-8.594-10.789-24.308-12.568-35.097-3.974C718.47 938.277 618.002 974.049 512 974.049 256.818 974.049 49.951 767.182 49.951 512S256.818 49.951 512 49.951 974.049 256.818 974.049 512c0 87.493-24.334 171.337-69.578 243.96-7.294 11.708-3.716 27.112 7.992 34.405 11.707 7.294 27.11 3.716 34.405-7.991C997.014 701.88 1024 608.898 1024 512z" p-id="4974"></path><path d="M337.17 499.512c34.485 0 62.44-27.955 62.44-62.439s-27.955-62.439-62.44-62.439c-34.483 0-62.438 27.955-62.438 62.44 0 34.483 27.955 62.438 62.439 62.438z m374.635 0c34.484 0 62.439-27.955 62.439-62.439s-27.955-62.439-62.44-62.439c-34.483 0-62.438 27.955-62.438 62.44 0 34.483 27.955 62.438 62.439 62.438zM352.788 768.771c43.377 34.702 100.364 55.424 171.7 55.424 71.336 0 128.322-20.722 171.7-55.424 26.513-21.21 42.695-42.786 50.444-58.284 6.168-12.338 1.168-27.34-11.17-33.509-12.337-6.168-27.34-1.168-33.508 11.17-0.918 1.835-3.462 6.025-7.788 11.793-7.564 10.085-17.239 20.27-29.183 29.825-34.671 27.737-80.71 44.478-140.495 44.478-59.786 0-105.824-16.741-140.496-44.478-11.944-9.556-21.619-19.74-29.182-29.825-4.327-5.768-6.87-9.958-7.788-11.793-6.169-12.338-21.171-17.338-33.509-11.17-12.337 6.169-17.338 21.171-11.169 33.509 7.75 15.498 23.931 37.074 50.444 58.284z"  p-id="4975"></path></svg>
                </div>
                <div :class="showLarge?'lg-board':'small-board'" class="emoji-board" v-show="showSmall || showLarge" 
                    @mouseenter="openSmall"
                    @mouseleave="hideSmall"
                    >
                    <div class="sm-list" v-show="showSmall">
                        <div class="sm-item" v-for="(item,i) in lastList" :key="i" @click="insert(item)">
                            <img :src="item"/>
                        </div>
                    </div> 
                    <div class="toolbar"  v-if="showLarge">
                        <div >
                            <div v-show="setting">
                                <a @click="deleteSelect">删除</a>
                                
                            </div>
                        </div>
                        <div>
                            <a @click="setting=!setting">{{setting?'取消':'设置'}}</a>
                        </div>
                    </div>
                    <div class="lg-list"  v-if="showLarge">
                        <div class="lg-item" v-for="(item,i) in emojiList" :key="i"  @click="()=>{
                            if(setting){
                                toggleSelect(item)
                            }else{
                                insert(item)
                            }
                        }" :class="[(()=>{
                                if(setting){
                                    if(selectList.includes(item)){
                                        return 'lg-item-select'
                                    }else{
                                        return 'lg-item-unselect'
                                    }
                                }else{
                                    return ''
                                }
                        })()]">
                            <img :src="item"/>
                        </div>
                    </div> 

                </div>
            </div>
            
            `
        })
        document.body.appendChild(warp)
        instance.$mount(warp)
    
    
        
    }
    
    /**
     * @param {HTMLElement} el
    */
    function getElementLT(el){
        let {top,left,height} = el.getBoundingClientRect();
        return {
            top:window.scrollY + top,
            left:left,
            bottom:document.body.scrollHeight-window.scrollY-height
        }
    }
    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = /*css*/`
        .uploader-warp{
            position: absolute;
        
        }
        .uploader-btn{
            height:18px;
            width:18px;
            color:#F09199;
            opacity:0.7;
            cursor: pointer;
        }
        .uploader-btn:hover{
            opacity:1;
        }
        .emoji-board{
            position: absolute;
            background:white;
            border-radius:2px;
            bottom:25px;
            left:-20px;
            z-index:99;
            transition:all 0.2s ease-in;
            overflow:hidden;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)
        }
        .small-board{
            width: 164px;
            height: 68px;            
        }
        .lg-board{
            width:320px; 
            height:196px;
        }
        .sm-list{
            display: flex;
            flex-wrap: wrap;
            padding: 2px;           
        }
        .sm-item{
            height: 30px;
            width:30px;
            border:1px solid #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .sm-item:hover {
            background-color: #e2e2e2;
        }
        .sm-item img{
            max-height:30px;
            max-width:30px;
        }
        
        .lg-list{
            padding: 6px;
            height: calc(100% - 34px);
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
        }
        .lg-item{
            height: 55px;
            width:55px;
            border:1px solid #e2e2e2;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position:relative;
        }
        .lg-item:hover {
            background-color: #e2e2e2;
        }
        .lg-item img{
            max-height:55px;
            max-width:55px;
        }
        .lg-item-select::after{
            position: absolute;
            content: '';
            display: block;
            height: 14px;
            width: 14px;
            top: 1px;
            left: 38px;
            border:solid 1px #666;
            background: rgb(56 179 65);
        }
        .lg-item-unselect::after{
            position: absolute;
            content: '';
            display: block;
            height: 14px;
            width: 14px;
            top: 0px;
            left: 38px;
            border:solid 1px #666; 
            
        }
        .toolbar{
            display: flex;
            justify-content:space-between;
            font-size:12px;
            padding:1px 12px;
        }
        .toolbar a{         
            margin-left: 4px;   
            cursor: pointer;
        }

        .meme-contextmenu{
            position: absolute;
            height:30px;
            width:30px;
            background:white;
            border-radius:2px;
            z-index:99;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
            color:rgb(255 146 165);
        }
        .meme-contextmenu:hover{
            background:rgb(255 247 247)
        }
   
    `
    heads[0].append(style)
})()