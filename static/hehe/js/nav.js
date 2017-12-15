function GetQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";  
    if (r != null)  
         context = r[2];  
    reg = null;  
    r = null;  
    return context == null || context == "" || context == "undefined" ? "" : context;  
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    if (cname == "lang") {
    	return "cn";
    }
    return "";
}
/**
 * 直接创建组件(推荐)
 */
Vue.component('my-nav',{
	template:`
		<div class="nav-wai">
			<a id="pcLogo" class="nav-brand" href="../../static/hehe/index.html">
				<img class="nav-brand" src="../../static/hehe/images/logo.png"/>
			</a>
			<ul class="nav-ul">
				<li>
					<a href="../../static/hehe/about.html">{{ $t("lang.about") }}</a>
				</li>
				<li>
					<a href="../../static/hehe/films.html">{{ $t("lang.films") }}</a>
				</li>
				<li>
					<a href="../../static/hehe/news.html">{{ $t("lang.news") }}</a>
				</li>
				<li>
					<a href="../../static/hehe/business.html">{{ $t("lang.business") }}</a>
				</li>
				<li>
					<a href="../../static/hehe/partners.html">{{ $t("lang.cooperation") }}</a>
				</li>
				<li>
					<a href="../../static/hehe/contactus.html">{{ $t("lang.contactus") }}</a>
				</li>
			</ul>
			<div class="nav-search">
				<form>
					<input id="bdcsMain" v-bind:placeholder="$t('lang.search_plc')" />
				</form>
				<img src="../../static/hehe/images/search.png"/>
			</div>
		</div>`
});

var nav_i18n = new VueI18n({
    locale: getCookie('lang'),
    messages: {
		en: {
		    lang: {
		        about: 'About',
		        films: 'Films',
		        news: 'News',
		        business: 'Business',
		        cooperation: 'Cooperation',
		        contactus: 'Contact',
		        search_plc: 'Search'
		    }
		},
		cn: {
		    lang: {
		        about: '关于我们',
		        films: '影视作品',
		        news: '新闻资讯',
		        business: '商业项目',
		        cooperation: '合作伙伴',
		        contactus: '联系我们',
		        search_plc: '搜索'
		    }
		}
	},
});

new Vue({
	i18n: nav_i18n,
	el:'#my-nav',
	data:{
		msg:'和和影业'
	}
});	

Vue.component('my-footer',{
	template:'\
		<footer>\
	        <div class="footer-container">\
	            <hr>\
	            <div class="footer-content">\
	                <div class="footer-info">\
	                    和和（上海）影业有限公司<br>\
	                    北京市朝阳区姚家园南路1号惠通时代广场7号楼C座5楼<br>\
	                    Hehe ( Shanghai ) Pictures Co., Ltd<br>\
	                    5th Floor, Zone C, Builing No.7, HuiTong Office Park<br>\
	                    No.1 Yaojiayuan South Road, Chaoyang District, 100025 Beijing, China<br>\
	                    电话：010-85565969\
	                </div>\
	                <div class="footer-link">\
	                    友情链接Links<br>\
	                    <a href="http://www.alibabapictures.com/">阿里巴巴影业</a>     \
	                    <a href="http://www.firstfilm.org.cn/">FIRST青年电影展</a>     \
	                    <a href="http://weibo.com/u/5754144206">并驰影业</a>     \
	                    <a href="javascript:void(0)">和和基金</a>     \
	                    <a href="javascript:void(0)">麦特</a>     \
	                    <a href="javascript:void(0)">至乐汇粹</a>     \
	                    <a href="javascript:void(0)">黑蚂蚁</a>     \
	                    <a href="javascript:void(0)">FOTISSIMO</a>     \
	                    <a href="javascript:void(0)">坤哥文化</a>     \
	                    <a href="javascript:void(0)">春和</a>     \
	                    <a href="javascript:void(0)">和和花园</a>     \
	                    <a href="javascript:void(0)">球和头</a>     \
	                    <a href="javascript:void(0)">和曦文化</a>     \
	                    <a href="javascript:void(0)">三目童子</a>     \
	                    <a href="javascript:void(0)">原来影像</a>     \
	                    <a href="javascript:void(0)">形影相随</a>     \
	                    <a href="javascript:void(0)">屋顶世界</a>     \
	                </div>\
	                <div class="footer-qr">\
	                    <img src="../../static/hehe/images/hehe-wb.jpg">\
	                    <img src="../../static/hehe/images/hehe-wx.jpg">\
	                </div>\
	            </div>\
	        </div>\
	    </footer>'
});
new Vue({ //这里的vm也是一个组件，称为根组件Root
	el:'#my-footer',
	data:{
		msg:'和和影业'
	}
});	