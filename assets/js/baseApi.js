//每次调用$.get()或者$.post()或者$.ajax()的时候会先调用 ajaxPrefilter 这个函数 
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在此处将基准地址拼接一下
    options.url = 'http://big-event-vue-api-t.itheima.net' + options.url
    console.log(options.url);

    //将key=value格式的字符串转换成JSON格式的字符串
    const format2Json = (source) => {
        let target = {}
        source.split('&').forEach((el) => {
            let kv = el.split('=')
            target[kv[0]] = kv[1]
        })
        return JSON.stringify(target)
    }

    //统一设置请求头的Content-Type值
    options.contentType = 'application/json'

    //统一设置请求的参数-post请求
    options.data = format2Json(options.data)
})