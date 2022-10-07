let layer = layui.layer
$(function () {


    //调用getUserInfo函数获取用户的基本信息
    getUserInfo()

    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.清空本地存储中的token
            localStorage.removeItem('big_news_token')
            //2.重新跳转到登录页面
            location.href = './login.html'
            //关闭confirm询问框
            layer.close(index);
        });
    })
})


//请求用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        
        success: function (res) {
            console.log(res);
            if (res.code !== 0) {
                return layer.msg(res.message)
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res)
        },
    })
}


//渲染用户头像部分
const renderAvatar = (res) => {
    if (res.data.user_pic) {
        //隐藏文本头像
        $('.text-avatar').hide()
        //渲染图片头像
        $('.userinfo img').attr('src', res.data.user_pic).show()
    } else {
        //隐藏图片头像
        $('.layui-nav-img').hide()
        //显示文本头像，取username属性中的第一个字母
        //取nickname和username
        const name = res.data.nickname || res.data.username
        const char = name[0].toUpperCase()
        $('.text-avatar').html(char)
    }
    //渲染文本头像
    $('#text').html(`欢迎&nbsp;&nbsp;${res.data.username}`)
}