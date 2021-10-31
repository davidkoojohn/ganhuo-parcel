$(function (){
    const $subject = $('.main-menu li').eq(3)
    $subject.on('mouseenter', function (){
        $(this).children('div').show()
    })
    $subject.on('mouseleave', function (){
        $(this).children('div').hide()
    })
    const $item = $('.sub-menu p')
    $item.on('mouseenter', function (){
        $(this).addClass(
            "animate__animated animate__shakeX animate__slow"
        )
        $(this).css('color','#448EF6')
    })
    $item.on('mouseleave', function (){
        $(this).removeClass(
            "animate__animated animate__shakeX animate__slow"
        )
        $(this).css('color',' #222831')
    })
    const timeRelease = function (time){

    }
    let $navItems = [{
        title: "最新",
        type: "All"},
        {
            title: "妹纸",
            type: "Girl"},
        {
            title: "推荐",
            type: "All"}
    ]
    // 干货所有子分类
   $.ajax({
       url:'https://gank.io/api/v2/categories/Article',
       success(res){
           $.each(res.data, function (index, item){
               $navItems.push({
                   title: item.title,
                   type:item.type
               })
           })
           // console.log($navItems)
           $.each($navItems, function (index, item){
               if(index === 0){
                   $('nav').append(`<a data-type="${item.type}"  data-title="${item.title}" href="javascript:void(0)" class="btn-sm active">${item.title}</a>`)
               }else {
                   $('nav').append(`<a data-type="${item.type}"  data-title="${item.title}" href="javascript:void(0)" class="btn-sm ">${item.title}</a>`)
               }
           })
       }
   })
// banner轮播图
    $.ajax({
        url:`https://gank.io/api/v2/banners`,
        success(res){
            $.each(res.data, function (index, item){
                if (index === 0){
                    $('.inners').append(`
                        <div class="carousel-item active items" data-bs-interval="2000">
                            <img src="${item.image}" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block title">
                                <h5>${item.title}</h5>
                            </div>`)
                }else {
                    $('.inners').append(`
                        <div class="carousel-item items" data-bs-interval="2000">
                            <img src="${item.image}" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block title">
                                <h5>${item.title}</h5>
                            </div>`)
                }
            })
        }
    })
    // 左右按钮进出动画
    $('.myCarousel').on('mouseenter', function (){
        $('.myCarousel .carousel-control-prev').css('left', '0')
        $('.myCarousel .carousel-control-next').css('right', '0')
    })
    $('.myCarousel').on('mouseleave', function (){
        $('.myCarousel .carousel-control-prev').css('left', '-70px')
        $('.myCarousel .carousel-control-next').css('right', '-70px')
    })

// 发布文章距今时间和日期
    const toRelease = function (time){
        let data = new Date(time)
        let now = new Date()
        let range = parseInt((now - data) / 1000)
        let toRelease = parseInt(range / 3600 / 24)
       if (toRelease < 30){
           return `${toRelease}天`
       }else if (toRelease > 30 && toRelease < 365){
           return `${parseInt(toRelease / 30)}月`
       }else if (toRelease > 365){
           return `${parseInt(toRelease / 365)}年`
       }
    }
    const year = function (time){
        let data = new Date(time)
        return data.getFullYear()
    }
    const month = function (time){
        let data = new Date(time)
        return `${data.getMonth() + 1}月`
    }
    const date = function (time){
        let data = new Date(time)
        return data.getDate()
    }
    let type = 'All'
    let category = 'GanHuo'
    let title = '最新'
    const page_size = 10
    let page = 1
    let hasNextPage = true
    const getList = function (category = 'GanHuo',type = 'All', title= '最新', page = 1){
        $.ajax({
            url:`https://gank.io/api/v2/data/category/${category}/type/${type}/page/${page}/count/${page_size}`,
            success(res) {
                if (res.data.length < page_size){
                    hasNextPage = false
                }
                $.each(res.data, function (index, item){
                    let time = toRelease(item.publishedAt)
                    let imgUrl = ''
                    if (item.images[0] && item.images[0].startsWith('http')) {
                        imgUrl = item.images[0]
                    } else {
                        imgUrl = '../img/noPhoto.jpg'
                    }
                    $('.list').append(
                        `<div class="item">
                   <a href="javascript:void(0)" class="photo"> <img src="${imgUrl}" alt=""></a>
                    <div class="list-content">
                        <a href="javascript:void(0)" class="list-titles">
                            <span>${title}</span>
                            ${item.title}
                        </a>
                        <p>${item.desc}</p>
                        <div class="footer">
                            <div class="footerL">
                                <img src="../img/Ub.jpg" alt="">
                                <a href="javascript:void(0)" style="color: #9ca0ad">${item.author}</a>
                                <a href="javascript:void(0)"  style="color: #448EF6">—</a>
                                <a href="javascript:void(0)" class="classify">${title}</a>
                            </div>
                            <div class="footerR">${time}前发布</div>
                        </div>
                    </div>
                </div>`
                    )
                })
            }
        })
    }
    // 格式化
    getList()
    //点击刷新数据
    $('nav').on('click', 'a',function (){
        $(this).addClass('active')
            .siblings().removeClass('active')
        // console.log($(this).attr('data-type'))
        hasNextPage = true
        type= $(this).data('type')
        title= $(this).data('title')
        page = 1
        if (type === 'Girl'){
            category = 'Girl'
        }else {
            category = 'GanHuo'
        }
        $('.list').empty()
        getList(category, type, title, page)
        $('.status').html('正在加载数据...')
    })
    // 触底刷新列表
    $(document).on('scroll', function (){
        let pageHeight = $(document).height()
        let viewHeight = $(window).height() + $(document).scrollTop()
        let $right = $('.right')
        // console.log(pageHeight)
        // console.log($(window).height())
        // console.log($right.height())
        // console.log($(document).scrollTop())
        // console.log($right.offset().top)
        // console.log($right.height() + 48 - $(window).height())
        // if ($right.height() + 48 - $(window).height() < $(document).scrollTop()){
        //     $right.css('position', 'fixed')
        //     $right.css('left', `${$right.offset().left}`)
        //     $right.css('top', `${$right.offset().top}`)
        //     $right.css('width', '370px')
        // }else {
        //     $('.right').css('position', 'absolute')
        // }

        if (pageHeight - viewHeight < 5){
             if (hasNextPage){
                 page += 1
                 getList(category, type, title, page)
             }else {
                 $('.status').html('没有更多数据了')
             }
        }
    })

    const refresh = function (){
        $.ajax({
            url:`https://gank.io/api/v2/random/category/Girl/type/Girl/count/1`,
            success(res){
                let imgUrl = ''
                if (res.data[0].images[0] && res.data[0].images[0].startsWith('http')) {
                    imgUrl = res.data[0].images[0]
                } else {
                    imgUrl = '../img/wbb.jpeg'
                }
                let years = year(res.data[0].createdAt)
                let months = month(res.data[0].createdAt)
                let dates = date(res.data[0].createdAt)
                $('.singleCard').append(`
                <img src="${imgUrl}" alt="">
                <div class="overlay-top">
                    <span>${dates}</span>
                    <time>${months}, ${years}</time>
                </div>
                    <div class="list-content">
                        <a href="javascript:void(0)">妹子图${res.data[0].title}</a>
                        <div class="list-footer">
                            <span class="genre">Random Girl</span>
                            <a href="javascript:void(0)"><i class="fa fa-refresh"></i></a>
                        </div>
                    </div>`)
            }
        })
    }
    //格式化妹纸图
    refresh()
    //点击刷新妹纸图
 $('.singleCard').on('click', '.fa-refresh', function (){
     $('.singleCard').empty()
     refresh()
 })
    // 最火妹纸展示
    $.ajax({
        url:`https://gank.io/api/v2/hot/likes/category/Girl/count/3`,
        success(res){
            $.each(res.data, function (index, item){
                let imgUrl = ''
                if (item.images[0] && item.images[0].startsWith('http')) {
                    imgUrl = item.images[0]
                } else {
                    imgUrl = '../img/noPhoto.jpg'
                }
                $('.gallery').append(`<a href="javascript:void(0)">
                        <img src="${imgUrl}" alt="">
                    </a>
                   `)
            })
        }
    })
    // 最热文章展示
    $.ajax({
        url:`https://gank.io/api/v2/hot/views/category/Article/count/5`,
        success(res){
            $.each(res.data, function (index, item){
                let imgUrl = ''
                let time = toRelease(item.publishedAt)
                if (item.images[0] && item.images[0].startsWith('http')) {
                    imgUrl = item.images[0]
                } else {
                    imgUrl = '../img/noPhoto.jpg'
                }
                $('.articleWidget').eq(0).append(`<div class="list-item">
                       <a href="javascript:void(0)" class="photo"> <img src="${imgUrl}" alt=""></a>
                        <div class="listR">
                            <a href="javascript:void(0)" class="list-title">${item.title}</a>
                            <div class="list-footer">${time}前</div>
                        </div>
                    </div>
                   `)
            })
        }
    })
    // 最热文章展示
    $.ajax({
        url:`https://gank.io/api/v2/hot/views/category/GanHuo/count/5`,
        success(res){
            $.each(res.data, function (index, item){
                let imgUrl = ''
                let time = toRelease(item.publishedAt)
                if (item.images[0] && item.images[0].startsWith('http')) {
                    imgUrl = item.images[0]
                } else {
                    imgUrl = '../img/noPhoto.jpg'
                }
                $('.articleWidget').eq(1).append(`<div class="list-item">
                       <a href="javascript:void(0)" class="photo"> <img src="${imgUrl}" alt=""></a>
                        <div class="listR">
                            <a href="javascript:void(0)" class="list-title">${item.desc}</a>
                            <div class="list-footer">${time}前</div>
                        </div>
                    </div>
                   `)
            })
        }
    })
})
