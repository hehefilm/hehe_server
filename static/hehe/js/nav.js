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
				<img src="../../static/hehe/images/logo.png"/>
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

//<li>
//	<a href="../../static/hehe/business.html">{{ $t("lang.business") }}</a>
//</li>
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
		        search_plc: 'Search',
		        address:'',
		        cname:'',
		        tel:'TEL',
		        alink:'Links',
		        albb:'Alibaba Pictures',
		        first:'Xining FIRST International Film Festival',
		        bcye:'Bingchi Pictures',
		        hhjj:'Hehe Capital',
		    	mt:'Maxtimes',
		    	zlhc:'Joyway',
		    	hmy:'Black Ant Film',
		    	fo:'Fortissimo Films',
		    	kgwh:'Kunge Culture',
		    	ch:'',
		    	hhhy:'Hehe Garden',
		    	qht:'Qiu He Tou',
		    	hxwh:'Hexi Culture',
		    	smtz:'',
		    	ylyx:'',
		    	xyxs:'',
		    	wdsj:'',
		    	bq:'Hehe Pictures Co., Ltd. All Rights Reserved. 京ICP备15067368号-1'
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
		        search_plc: '搜索',
		        address:'北京市朝阳区姚家园南路1号惠通时代广场7号楼C座5楼',
		        cname:'和和（上海）影业有限公司',
		        tel:'电话',
		        alink:'友情链接',
		        albb:'阿里巴巴影业',
		        first:'FIRST青年电影展',
		        bcye:'并驰影业',
		        hhjj:'和和基金',
		    	mt:'麦特',
		    	zlhc:'至乐汇粹',
		    	hmy:'黑蚂蚁',
		    	fo:'FORTISSIMO',
		    	kgwh:'坤歌文化',
		    	ch:'春和',
		    	hhhy:'和和花园',
		    	qht:'球和头',
		    	hxwh:'和曦文化',
		    	smtz:'三目童子',
		    	ylyx:'原来影像',
		    	xyxs:'形影相随',
		    	wdsj:'屋顶世界',
		    	bq:'版权所有 和和（上海）影业有限公司 京ICP备15067368号-1'
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
	template:`
		<footer>
	        <div class="footer-container">
	            <div class="footer-content">
	                <div class="footer-info">
	                    {{$t('lang.cname')}}<br>
	                    {{$t('lang.address')}}<br>
	                    Hehe Pictures Co., Ltd.<br>
	                    5th Floor, Zone C, Builing No.7, HuiTong Office Park, No.1 Yaojiayuan<br>
	                    South Road, Chaoyang District, 100025 Beijing, China<br>
	                    {{$t('lang.tel')}}：+86 10 85565969
	                </div>
	                <div class="footer-link">
	                    <strong>{{$t('lang.alink')}}</strong><br>
	                    <a href="javascript:void(0)">{{$t('lang.albb')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.first')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.bcye')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.hhjj')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.mt')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.zlhc')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.hmy')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.fo')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.kgwh')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.ch')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.hhhy')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.qht')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.hxwh')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.smtz')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.ylyx')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.xyxs')}}</a>
	                    <a href="javascript:void(0)">{{$t('lang.wdsj')}}</a>
					    <br>{{$t('lang.bq')}}
	                </div>
	                <div class="footer-qr">
	                    <img src="../../static/hehe/images/hehe-wb.jpg">
	                    <img src="../../static/hehe/images/hehe-wx.jpg">
	                </div>
	            </div>
	        </div>
	    </footer>`
});
new Vue({ //这里的vm也是一个组件，称为根组件Root
	i18n:nav_i18n,
	el:'#my-footer',
	data:{
		msg:'和和影业'
	}
});	


document.write(unescape('%3Cdiv id="bdcs"%3E%3C/div%3E'));
var bdcs = document.createElement('script');
bdcs.type = 'text/javascript';
bdcs.async = true;
bdcs.src = 'http://znsv.baidu.com/customer_search/api/js?sid=7972134502849772219' + '&plate_url=' + encodeURIComponent(window.location.href) + '&t=' + Math.ceil(new Date() / 3600000);
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(bdcs, s);

