// 建立翻译基础
var messages = {
    en: {
        lang: {
            more: 'More'
        }
    },
    cn: {
        lang: {
            more: '更多'
        }
    }
};
//生成国际化插件实例
const i18n = new VueI18n({
    locale: getCookie('lang'), // set locale
    messages, // set locale messages
});

new Vue({
	i18n,
	el:'.news-div',
	data:{
		news:[],
	},
	created: function() {
		this.getNewsBypg(1);
	},
	methods:{
		getNewsBypg(pg){
			axios.get(`http://staging.hehefilm.com/resources/news?pg=${pg}&num=5`)
			.then(resp => {
				var newList = resp.data.news_li;
				this.news = newList;
				console.log(resp.data);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
		toNewsDetail(nid){
			window.location.href = "news-detail.html?nid="+nid;
		}
	},
});

$(document).ready(function(){
	// invoke the carousel
    $('#news-left').carousel({
      interval: 5000
    });
})
