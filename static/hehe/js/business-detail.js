
new Vue({
	el:'#news-detail',
	data:{
		newsdetail:"",
	},
	created: function() {
		var urlinfo=window.location.href; //获取当前页面的url 
		var newsid=this.getURLParameter('pid');//得到参数值 
		this.getNewsDetail(newsid); 
	},
	methods:{
		getURLParameter(name) {
		    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		},
		getNewsDetail(newsid){
			axios.get(`http://staging.hehefilm.com/resources/project/${newsid}`+ '?lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
			.then(resp => {
				this.newsdetail = resp.data.pdetail;
				console.log(resp.data.pdetail);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
	},
});
