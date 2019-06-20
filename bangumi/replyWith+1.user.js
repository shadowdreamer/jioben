// ==UserScript==
// @name         给帖子楼层快速+1
// @namespace    https://github.com/shadowdreamer/jioben/tree/master/bangumi
// @version      0.1
// @description  *
// @author       cureDovahkiin
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==
(function () {
    const $mainForm = $('#ReplyForm')
        , $form_action = $mainForm.attr('action')
        , $lastview_timestamp = $mainForm.find('[name=lastview]')
        , $formhash = $mainForm.find('[name=formhash]').val();
    $('.tip_i').each(function () {
        const paramas = this.onclick.toString().split(','),
            [type, topic_id, post_id, sub_reply_id, sub_reply_uid, post_uid] = paramas
        if (sub_reply_id == 0) {
            const counter = $(this).parent().find('.sub_reply_collapse').length,
                data = {
                    topic_id: topic_id,
                    related: post_id,
                    sub_reply_uid: sub_reply_uid,
                    post_uid: post_uid,
                    content: `+${counter + 1}`,
                    related_photo: 0,
                    lastview: $lastview_timestamp.val(),
                    formhash: $formhash,
                    submit: 'submit'
                }
            const plus = document.createElement('a')
            plus.innerHTML = '+1'
            $(plus).click(function () {
                $(this).removeAttr('onclick').text('').removeClass('reply-plus-one').addClass('reply-plus-loading')
                $.ajax({
                    type: "POST",
                    url: $form_action + '?ajax=1',
                    data: data,
                    dataType: 'json',
                    success: json => {
                        $('div.subreply_textarea').remove()
                        $(this).remove()
                        chiiLib.ajax_reply.insertJsonComments('#comment_list', json)
                        $lastview_timestamp.val(json.timestamp)
                    },
                })
                return false
            }).addClass('reply-plus-one')
            $(this).after(plus)
        }
    })
    const style = document.createElement("style")
    const heads = document.getElementsByTagName("head")
    style.setAttribute("type", "text/css")
    style.innerHTML = `
    a.reply-plus-one {
        display: inline-block;
        margin: 0 6px;
        padding: 0 3px;
        border: 1px solid #ccc;
        line-height: 12px;
        border-radius: 3px;
        color: #ccc;
        cursor: pointer;
    }
    a.reply-plus-one:hover {
        background-color: #bbb;
        color: #fff;
    }
    reply-plus-loading:{
        display: inline-block;
        margin: 0 6px;
        height: 12px;
        width: 12px;
        background-image: url(/img/loading_s.gif);
        background-repeat: no-repeat;
        background-position: center;
    }
`
    heads[0].append(style)
})();