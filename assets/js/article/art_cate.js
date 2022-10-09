$(function () {
    const layer = layui.layer
    const form = layui.form
    initArtCateList()
    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    console.log(res.code);
                    return layer.msg(res.message)
                }
                // console.log(res);
                // 调用模板引擎
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    //通过代理的形式，为我们的form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res.code);
                if (res.code !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })


    //通过代理的形式，为btn-edit 按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        const id = $(this).attr('data-id')
        console.log(id);
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res.data);
                form.val('addFormFilter', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'PUT',
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id')
        console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id=' + id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    // layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})
