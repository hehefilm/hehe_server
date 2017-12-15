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
    locale: 'en', // set locale
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
			axios.get(`http://staging.hehefilm.com/resources/project?pg=${pg}&num=5`)
			.then(resp => {
				this.project = resp.data.project_li;
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

