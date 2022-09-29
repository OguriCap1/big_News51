$(function () {
    // 从layui中获取form对象
    const form = layui.form
    const layer = layui.layer


    //点击登录
    $('#go2Reg').on('click', function () {
        $('.login-wrap').hide()
        $('.reg-wrap').show()
    })
    //点击注册
    $('#go2Login').on('click', function () {
        $('.login-wrap').show()
        $('.reg-wrap').hide()
    })


    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须是6~12位并且不能有空格'],
        //通过形参value拿到的是确认密码框中的内容
        //还需要拿到密码框中的内容
        //然后进行一次等于的判断
        //如果判断失败，则return一个提示消息即可
        repwd: function (value) {
            const pwd = $('.reg-wrap [name=password]').val()
            if (value !== pwd) {
                return '两次密码不一致,请重新输入'
            }
        }
    })

    //监听注册表单的提交事件
    $('#formReg').on('submit', function (e) {
        //阻止表单提交默认行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reg',
            // contentType: 'application/json',
            data: $(this).serialize(),
            success(res) {
                // console.log(res.code);
                if (res.code !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#go2Login').click()
            }
        })
    })
    //监听登录表单的提交事件
    $('#formLogin').on('submit', function (e) {
        //阻止表单提交默认行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // contentType: 'application/json',
            data: $(this).serialize(),
            success(res) {
                // console.log(res.code);
                if (res.code !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 储存token
                localStorage.setItem('big_news_token', res.token)
                // 跳转到主页
                location.href = './index.html'
            }
        })
    })
})