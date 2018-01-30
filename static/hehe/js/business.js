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
		project:[],
	},
	created: function() {
		this.getBusinessBypg(1);
	},
	methods:{
		getBusinessBypg(pg){
			axios.get(`http://staging.hehefilm.com/resources/project?pg=${pg}&num=3` + '&lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
			.then(resp => {
				var p = resp.data.project_li;
//				p.push(p[0]);
//				p.push(p[0]);
				this.project = p;
				console.log(resp.data);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
		toBusinessDetail(pid){
			window.location.href = "business-detail.html?pid="+pid;
		}
	},
});

$(document).ready(function(){
	// invoke the carousel
    $('#news-left').carousel({
      interval: 5000
    });
})
