
new Vue({
	el:'#news-detail',
	data:{
		newsdetail:"",
	},
	created: function() {
		this.getAboutDetail(); 
	},
	methods:{
		getAboutDetail(){
			axios.get('http://staging.hehefilm.com/resources/about_me?lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
			.then(resp => {
				this.newsdetail = resp.data.adetail;
				console.log(resp.data.adetail);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
	},
});
