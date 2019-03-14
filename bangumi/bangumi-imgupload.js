// ==UserScript==
// @name         bamgumi图片上传
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  上传图片到牛图网，catbox,管理历史上传记录
// @author       dovahkiin
// @include      http*://bgm.tv*
// @include      http*://bangumi.tv*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/vue/2.6.8/vue.min.js
// ==/UserScript==

(function () {
    const box = document.createElement("div");
    document.body.append(box);
    box.innerHTML = `
    <div id="imgupload">
    <div class="openUpload imgupload-toggle" @click="open = !open">upload</div>
    <div class="openHistory imgupload-toggle" @click="openHistory = !openHistory">history</div>
    <transition name="warp">
        <div class="imgupload-warp upload-layout" v-show="open">
            <p>{{message}}</p>
            <span>选择上传网站：</span>
            <select  v-model="uploadApi" >
                <option value="niupic">niupic</option>
                <option value="catbox">Catbox</option>
            </select>
            <input
                type="file"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="change($event)"
            >
            <input type="button" value="upload" @click="upload">

            <div v-show="uploading" class="url-box">在传了....</div>
            <div v-show="!!url" class="url-box">
                <input :value="urlWithTag" id="img-url" readonly>
                <input type="button" value="点击复制" @click="copyToClipboard()">
            </div>
        </div>
    </transition>
    <transition name="warp">
        <div class="imgupload-warp history-layout" v-show="openHistory">
            <ul>
                <li v-for="(url,index) in urlList" :key="index">
                    <img :src="url | addHttp">
                    <button @click="deleteThisImg(index)">删除</button>
                </li>
            </ul>
        </div>
    </transition>
</div>`

    const app = new Vue({
        el: "#imgupload",
        data() {
            return {
                message: "上传文件:",
                file: null,
                url: "",
                uploading: false,
                open: false,
                openHistory: false,
                urlList: [],
                uploadApi: 'niupic',
            };
        },
        computed: {
            urlWithTag() {
                return `[img]${this.url}[/img]`;
            }
        },
        methods: {
            change(e) {
                this.file = e.target.files[0];
                this.url = '';
            },
            upload() {
                if(!this.file)return;
                const formData = new FormData();
                let url = "";
                this.uploading = true;
                switch (this.uploadApi) {
                    case "niupic":
                        url = "https://www.niupic.com/api/upload";
                        formData.append("image_field", this.file);
                        break;
                    case "catbox":
                        url = "https://catbox.moe/user/api.php";
                        formData.append("fileToUpload", this.file)
                        formData.append("reqtype", "fileupload")
                        break;
                }
                GM_xmlhttpRequest({
                    url: url,
                    method: "post",
                    data: formData,
                    onload: res => {
                        this.uploading = false;
                        console.log(res)
                        if (res.status == 200) {
                            switch (this.uploadApi) {
                                case "niupic":
                                    this.url = JSON.parse(res.responseText).img_puburl;
                                    break;
                                case "catbox":
                                    this.url = res.responseText;
                                    break;
                            }
                            this.saveToLocal(this.url);
                        } else {
                            this.url = "失败";
                        }
                    }
                });
            },
            copyToClipboard() {
                let focus = document.getElementById("img-url");
                focus.select();
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
        },
        filters:{
            addHttp(url){
                if(/^http(s)?/.test(url)){
                    return url
                }else{
                    return "https://" +url
                }
            }
        },
        mounted() {
            if (localStorage.getItem("imgUrl")) {
                this.urlList = JSON.parse(localStorage.getItem("imgUrl"));
            } else {
                localStorage.setItem("imgUrl", "[]");
            }
        }
    })


    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
.imgupload-warp {
	position: fixed;
	width: 300px;
	padding: 15px;
	box-sizing: border-box;
	background-color: #eee;
	border-radius: 5px;
	box-shadow: 0 0 15px #aaa;
	z-index: 99;
}
.upload-layout {
	min-height: 100px;
	top: 93px;
	right: 60px;
}
.history-layout {
	height: 300px;
	right: 60px;
	top: 260px;
	overflow-y: scroll;
}
.history-layout img {
	height: 60px;
        vertical-align: middle;

}
.url-box {
	margin: 8px 0px;
}
.imgupload-toggle {
	position: fixed;
	height: 50px;
	width: 50px;
    font-size:12px;
	line-height: 48px;
	text-align: center;
	border-radius: 50%;
	background-color: #fff;
	opacity: 0.7;
	cursor: pointer;
	box-shadow: 0 0 15px #aaa;
	user-select: none;
	z-index: 99;
}
.imgupload-toggle:hover {
	opacity: 1;
}
.openUpload {
	top: 203px;
	right: 10px;
}
.openHistory {
	top: 260px;
	right: 10px;
}
.warp-enter-active,
.warp-leave-active {
	transition: opacity 0.5s;
}
.warp-enter,
.warp-leave-to {
	opacity: 0;
}
`
    heads[0].append(style)
})();