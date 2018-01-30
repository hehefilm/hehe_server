
// 建立翻译基础
var messages = {
    en: {
        lang: {
            news: 'NEWS',
            director: 'Directors',
            producer:'Producer',
            stars: 'Stars',
            release_date: 'Release Date',
            genre: 'Genre',
            lang: 'Language',
            duration: 'Duration',
            country: 'Country',
            release_vision: 'Version'
        }
    },
    cn: {
        lang: {
            news: '新闻',
            director: '导		演',
            producer:'监制',
            stars: '主		演',
            release_date: '上映日期',
            genre: '类		型',
            lang: '语		言',
            duration: '片长',
            country: '制片地区',
            release_vision: '版本'     
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
	el:'#mybody',
	data:{
		news:[],
		rightDetail:{},
		allPage:0,
		nowNumber:1,
		bottom:[]
	},
	created: function() {
		this.getNewsBypg();
		this.getMove();
	},
	methods:{
		getNewsBypg(){
			axios.get(`http://staging.hehefilm.com/resources/news?pg=${this.nowNumber}&num=6` + '&lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
			.then(resp => {
				var newList = resp.data.news_li;
				this.allPage = resp.data.total_pg;
//				this.allPage = 5;
				this.news = newList;
				this.setBottomNum();
				console.log(resp.data);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
		getMove(){
			axios.get(`http://staging.hehefilm.com/resources/movie_recommend` + '&lang=' + (getCookie('lang') == 'en' ? 'en' : 'zh'))
			.then(resp => {
				this.rightDetail = resp.data;
				console.log(resp.data);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
		setBottomNum() {
			this.bottom = [];
			if(this.allPage<6) {
				//页数很少，不需要左右箭头
				for(var i =1;i<=this.allPage;i++) {
					this.bottom.push(''+i);
				}
			} else {
				//需要左右箭头
				if(this.nowNumber == 1 || this.nowNumber == 2) {
					//这个样子< 1 2 ... L>
					this.bottom.push('<');
					this.bottom.push('1');
					this.bottom.push('2');
					this.bottom.push('...');
					this.bottom.push(''+this.allPage);
					this.bottom.push('>');			
				} else if(this.nowNumber == 3){
					//这个样子< 1 2 3 4 ... L >
					this.bottom.push('<');
					this.bottom.push('1');
					this.bottom.push('2');
					this.bottom.push('3');
					this.bottom.push('...');
					this.bottom.push(''+this.allPage);
					this.bottom.push('>');
				} else if(this.nowNumber == this.allPage-2 || this.nowNumber == this.allPage-1 || this.nowNumber == this.allPage) {
					//这个样子< 1 ... L-2 L-1 L>
					this.bottom.push('<');
					this.bottom.push('1');
					this.bottom.push('...');
					this.bottom.push(''+(this.allPage-2));
					this.bottom.push(''+(this.allPage-1));
					this.bottom.push(''+this.allPage);
					this.bottom.push('>');
				} else {
					//这个样子< 1 ... N-1 N N+1 ... L >
					this.bottom.push('<');
					this.bottom.push('1');
					this.bottom.push('...');
					this.bottom.push(''+(this.nowNumber-1));
					this.bottom.push(''+this.nowNumber);
					this.bottom.push(''+(this.nowNumber+1));
					this.bottom.push('...');
					this.bottom.push(''+this.allPage);
					this.bottom.push('>');
				}
				
			}
		},
		toPage(value) {
			if(value == '<') {
				//上一页
				if(this.nowNumber !=1) {
					this.nowNumber--;
					this.getNewsBypg();
				}
				
			} else if(value == '>') {
				//下一页
				if(this.nowNumber !=this.allPage) {
					this.nowNumber++;
					this.getNewsBypg();
				}
			} else if(value == '...') {
				//不能点击
			} else {
				//普通的页数
				this.nowNumber = parseInt(value);
				this.getNewsBypg();
			}
		}
	},
});
