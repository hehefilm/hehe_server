// 建立翻译基础
var messages = {
    en: {
        lang: {
            films: 'Films',
            more: 'More'
        },

    },
    cn: {
        lang: {
            films: '影视作品',
            more: '更  多'
        }
    }
};
//生成国际化插件实例
const i18n = new VueI18n({
    locale: getCookie('lang'), // set locale
    messages, // set locale messages
});
var vue = new Vue({
    i18n,
    el: '#vue-page',
    data: {
        page: 1,
        more: false,
        movie_li: [
            {
                // "movie_id": "movie_001",
                // "title": "美人鱼", //片名
                // "director": "徐克", //导演
                // "writer": "周星驰", //编剧
                // "poster": "http://hh.com/something.jpg", //封面图片，海报
                // "release_date": "2017-01-01", //上映日期
                // "genre": "魔幻/喜剧", //类型
                // "duration": 120, //片长
                // "description": "美人鱼不是人。", //简介
                // "stars": "不知道/buzhidao/知道", //主演，演员
                // "clips": ["http://hh.com/1.jpg", "http://hh.com/2.jpg"], //剧照
                // "videos": ["http://hh.com/1.mp4", "http://hh.com/2.mp4"], //宣传视频
                // "store": "http://hehefilm.com", //衍生品地址
                // "lang": "普通话", //语言
                // "release_vision": "3D", //荧幕类型
                // "country": "中国", //制作国家
                // "mknown": "小海怪/Mermaid" //又名
            },

        ]

    },
    created: function () {
        axios.get('http://staging.hehefilm.com/resources/movie?pg=1&num=8')
            .then(resp => {
                var pg=resp.data.pg;
                var total_pg=resp.data.total_pg;
                this.movie_li = resp.data.movie_li;
                var movie = this.movie_li;
                for (var i = movie.length - 1; i >= 0; i--) {
                    if (i > 0) {
                        if (movie[i - 1].release_date.substring(0, 4) != movie[i].release_date.substring(0, 4)) {
                            var item = {};
                            item.year = movie[i].release_date.substring(0, 4);
                            this.movie_li.splice(i, 0, item);
                        }
                    } else {
                        var item = {};
                        item.year = movie[0].release_date.substring(0, 4);
                        this.movie_li.splice(0, 0, item);
                    }
                }

                if (pg!=total_pg) {
                    this.more = true;
                    var item={};
                    item.more=true;
                    this.movie_li.push(item);
                }else{
                    this.more = false;

                }
                console.log(resp.data);
            }).catch(err => {
            console.log('请求失败：' + err.status + ',' + err.statusText);
        })
        ;
    },
    methods: {
        initMore: function () {
            this.page++;
            axios.get('http://staging.hehefilm.com/resources/movie?pg=' + this.page + '&num=8')
                .then(resp => {
                    var pg=resp.data.pg;
                    var total_pg=resp.data.total_pg;
                    this.movie_li.pop();
                    this.movie_li = this.movie_li.concat(resp.data.movie_li);
                    var movie = this.movie_li;
                    for (var i = movie.length - 1; i >= movie.length-resp.data.movie_li.length; i--) {
                        if (movie[i - 1].release_date.substring(0, 4) != movie[i].release_date.substring(0, 4)) {
                                var item = {};
                                item.year = movie[i].release_date.substring(0, 4);
                                this.movie_li.splice(i, 0, item);
                            }
                    }
                    if (pg!=total_pg) {
                        this.more = true;
                        this.more = true;
                        var item={};
                        item.more=true;
                        this.movie_li.push(item);
                    }else{
                        this.more = false;
                    }
                    // console.log(resp.data);
                }).catch(err => {
                console.log('请求失败：' + err.status + ',' + err.statusText);
            })
        }
    },

});

// var data = {list: []};
// var videosPageCur = 1;
//
// function getNews(page) {
//     $.get("http://staging.hehefilm.com/resources/movie?pg=1&num=16",
//         function (rdata, status) {
//             var moreData = {};
//             moreData.list = jQuery.parseJSON(rdata);
//             if (moreData.list.length > 0) {
//             } else {
//                 $(".news-more").css('visibility', 'hidden');
//             }
//         });
// }
//
// getNews(videosPageCur);
//
// function moreNews(event) {
//     videosPageCur++;
//     getNews(videosPageCur);
// }

