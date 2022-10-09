$(function () {
    const form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            // data: $(this).serialize(),
            data:form.val('pwdForm'),
            success: function (res) {
                if (res.code !== 0) {
                    console.log(res.code);
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 重置表单(先拿到jquery对象)
                $('.layui-form')[0].reset()
            }
        })
    })
})