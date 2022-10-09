$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象
    //需要将请求参数对象提交到服务器
    const qs = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 3,//每页显示几条数据
        cate_id: '',//文章分类的id
        state: ''//当前文章的所处的状态，可选值，已发布，操作，都是字符串类型
    }

    //调用方法
    initTable()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
            success(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面数据
                // 调用模板引擎
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                console.log(res);
                const htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    initCate()



    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        console.log(cate_id);
        console.log(state);
        // 为查询参数对象 q 中对应的属性赋值
        qs.cate_id = cate_id
        qs.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数居条数
            limit: qs.pagesize,//每页显示几条数据
            curr: qs.pagenum,//指定默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],//指定选择每页显示多少个的功能
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(obj, first);
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 qs 这个查询参数对象中
                qs.pagenum = obj.curr
                qs.pagesize = obj.limit
                // 根据最新的 qs 获取对应的数据列表，并渲染表格
                // if (!first) {
                //     initTable()
                // }
                //如果直接进行调用的话会导致死循环的问题
                //应该是用户主动i求耳环页码值的时候去加载列表
                if (typeof first === 'undefined') {
                    initTable()
                }
            }
        })
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的 id
        const id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function () {
            $.ajax({
                method: 'DELETE',
                url: `/my/article/info?id=${id}`,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 获取删除按钮的个数
                    const len = $('.btn-delete').length
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        // 如果已经是第一页了就不要减了
                        qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
                    }

                    initTable()
                }
            })
        })
    })

})