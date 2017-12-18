// 建立翻译基础
var messages = {
    en: {
        lang: {
            partners: 'Partners',
        },

    },
    cn: {
        lang: {
            partners: '合作伙伴',
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
        friend_li: [
            {
                "rlogo": "/path/to/logo", //LOGO
                "rlink": "http://something.com" //跳转链接
            }
        ],

    },
    created: function () {
        axios.get('http://staging.hehefilm.com/resources/friend')
            .then(resp => {
                this.friend_li = resp.data.friend_li;
                this.friend_li=this.friend_li.concat(resp.data.friend_li).concat(resp.data.friend_li).concat(resp.data.friend_li);
                console.log(resp.data);
            }).catch(err => {
            console.log('请求失败：' + err.status + ',' + err.statusText);
        })
        ;
    },
    methods: {}
    ,

});
