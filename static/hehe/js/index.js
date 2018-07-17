// 建立翻译基础
var messages = {
    en: {
        lang: {
            films: 'Films',
            cooperation: 'Cooperation'
        }
    },
    cn: {
        lang: {
            films: '影视作品',
            cooperation: '合作伙伴'
        }
    }
};
//生成国际化插件实例
const i18ns = new VueI18n({
    locale: getCookie('lang'), // set locale
    messages, // set locale messages
});
var vue = new Vue({
    i18n:i18ns,
    el: '#vue-page',
    data: {
        films_li: [

        ],
        movie_li: [
        ],
    },
    created: function () {

        axios.get('http://www.hehefilm.com/resources/movie?pg=1&num=1000&lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
            .then(resp => {
                var list = resp.data.movie_li;
                // for (var i = 0; i < 5; i++) {
                //     list = list.concat(resp.data.movie_li);
                // }
                //  add  year
                // var movie=list;
                // for (var i = movie.length - 1; i >= 0; i--) {
                //     if (i > 0) {
                //         if (movie[i - 1].release_date.substring(0, 4) != movie[i].release_date.substring(0, 4)) {
                //             var item = {};
                //             item.year = movie[i].release_date.substring(0, 4);
                //             list.splice(i, 0, item);
                //         }
                //     } else {
                //         var item = {};
                //         item.year = movie[0].release_date.substring(0, 4);
                //         list.splice(0, 0, item);
                //     }
                // }

                var number = 8;
                if (list.length > number) {
                    for (var i = 0; number * i < list.length; i++) {
                        if (i * number + number > list.length) {
                            var item={};
                            item.movie_li=list.slice(i * number, list.length);
                            this.films_li.splice(i,0,item);
                        } else {
                            var item={};
                            item.movie_li=list.slice(i * number, (i + 1) * number);
                            this.films_li.splice(i,0,item);
                        }
                    }
                } else {
                    var item={};
                    item.movie_li=list.slice(0, list.length);
                    this.films_li.splice(i,0,item);
                }
                console.log(this.films_li);
            }).catch(err => {
            console.log('请求失败：' + err.status + ',' + err.statusText);
        });

    },
    methods: {

    }
});

var vuePartners = new Vue({
    i18n:i18ns,
    el: '#vue-partners',
    data: {
        partner_li:[],
        friend_li: [
            // {
            //     "rlogo": "/path/to/logo", //LOGO
            //     "rlink": "http://something.com" //跳转链接
            // }
        ],

    },
    created: function () {
        axios.get('http://www.hehefilm.com/resources/friend?lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
            .then(resp => {
                this.friend_li = resp.data.friend_li;
                var list = resp.data.friend_li;
                // for (var i = 0; i < 3; i++) {
                //     list = list.concat(resp.data.friend_li);
                // }
                var number = 9;
                if (list.length > number) {
                    for (var i = 0; number * i < list.length; i++) {
                        if (i * number + number > list.length) {
                            var item={};
                            item.friend_li=list.slice(i * number, list.length);
                            this.partner_li.splice(i,0,item);
                        } else {
                            var item={};
                            item.friend_li=list.slice(i * number, (i + 1) * number);
                            this.partner_li.splice(i,0,item);
                        }
                    }
                    // 循环轮播到下一个项目
                    //     $("#myPartner").carousel('next');
                    // $('#myPartner').carousel({
                    //     interval: 5000
                    // });

                } else {
                    var item={};
                    item.friend_li=list.slice(0, list.length);
                    this.partner_li.splice(i,0,item);
                }
                console.log(resp.data);
            }).catch(err => {
            console.log('请求失败：' + err.status + ',' + err.statusText);
        })
        ;
    },
    methods: {}
    ,

});







