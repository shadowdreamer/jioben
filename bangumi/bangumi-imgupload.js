// ==UserScript==
// @name         bamgumi图片上传
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description
// @author       dovahkiin
// @include     /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(ep|blog|subject\/topic|group\/topic)\//
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/vue/2.6.8/vue.min.js
// ==/UserScript==

(function() {
    const box = document.createElement("div");
    document.body.append(box);
    box.innerHTML = `
        <div id="imgupload" >

            <div class = "imgupload-warp">
                <p>{{message}}</p>
                <input
                type="file"
                accept="image/gif,image/jpeg,image/jpg,image/png"
                @change="change($event)">
                <input type="button" value="upload"  @click="upload">

                <div v-show = "uploading" class = "url-box">在传了....</div>
                <div v-show = "!!url"  class = "url-box" >
                    <input   :value="urlWithTag"  id="img-url" readonly>
                    <input  type = "button"  value="点击复制" @click="copyToClipboard()" >
                </div>
            </div>
        <div>`

    const app = new Vue({
    el: "#imgupload",
    data: {
        message: "上传文件:",
        fromData:null,
        url:"",
        withImgTag:true,
        uploading:false,
        },
     computed:{
       urlWithTag(){
           return `[img]${this.url}[/img]`
       }
     },
    methods:{
        change(e){
            const file = e.target.files[0];
            this.formData = new FormData();
            this.formData.append("image_field", file);

        },
        upload(){
            const _this = this;
            _this.uploading = true;
            GM_xmlhttpRequest({
                url:"https://www.niupic.com/api/upload",
                method:"post",
                data:this.formData,
                onload: function(res){
                    _this.uploading = false;
                      if(res.status == 200){
                        _this.url = JSON.parse(
                            res.responseText
                        ).img_puburl
                      }else{
                        _this.url = "失败"
                      }
               }
               })
        },
        copyToClipboard(){
           let focus = document.getElementById("img-url");
           focus.select()
           document.execCommand("copy")
        }
    }
})

const style = document.createElement("style");
const heads = document.getElementsByTagName("head");
style.setAttribute("type", "text/css");
style.innerHTML = `
    .imgupload-warp{
        position:fixed;
        min-height:100px;
        width:300px;
        padding:15px;
        bottom:35px;
        right:20px;
        box-shadow:0 0 15px #aaa;
        z-index:100;
    }
    .url-box{
        cursor: pointer;
        margin:8px 0px;
    }

`
heads[0].append(style)
})();