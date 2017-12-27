var navHeight = 70;

var t = document.documentElement.scrollTop || document.body.scrollTop;
if (t >= navHeight) {
    $("#my-nav").css('background-color', '#1A1C21');
} else {
    $("#my-nav").css('background-color', 'transparent');
}

window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t >= navHeight) {
        $("#my-nav").css('background-color', '#1A1C21');
        $("#my-nav").css('transition-duration', '0.25s');
    } else {
        $("#my-nav").css('background-color', 'transparent');
    }
}

if (!GetQueryString('movie_id')) {
    window.location = "index.html";
}

// 建立翻译基础
var messages = {
    en: {
        lang: {
            director: 'Directors',
            writer: 'Writers',
            producer: 'Producer',
            stars: 'Stars',
            release_date: 'Release Date',
            genre: 'Genre',
            lang: 'Language',
            duration: 'Duration',
            country: 'Country',
            release_vision: 'Version',
            description: 'Description',
            store: 'Buy Products',
            trailer: 'Trailer',
            poster: 'Poster',
            photo: 'Photo'
        }
    },
    cn: {
        lang: {
            director: '导演',
            writer: '编剧',
            producer: '监制',
            stars: '主演',
            release_date: '上映日期',
            genre: '类型',
            lang: '语言',
            duration: '片长',
            country: '制片地区',
            release_vision: '版本',
            description: '故事梗概',
            store: '购买周边',
            trailer: '预告片',
            poster: '海报',
            photo: '剧照'
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
        title: "",
        posters: [],
        mcover: "",
        store: "",
        director: "", //导演
        writer: "", //编剧
        producer: "", //监制
        release_date: "", //上映日期
        genre: "", //类型
        duration: 0, //片长
        description: "", //简介
        stars: "", //主演，演员
        clips: [], //剧照
        videos: [], //宣传视频
        lang: "", //语言
        release_vision: "", //荧幕类型
        country: "", //制作国家
        mknown: "", //又名
        // currentPreviewTitle: "",
        currentPreviewIndex: 0,
        currentThumbnailIndex: 0,
    },
    created: function () {
        axios.get('http://staging.hehefilm.com/resources/movie/' + GetQueryString('movie_id'))
        .then(resp => {
            this.title = resp.data.title;
            this.mcover = resp.data.mcover;
            this.posters = resp.data.posters;
            this.store = resp.data.store;
            this.director = resp.data.director;
            this.writer = resp.data.writer;
            this.producer = resp.data.producer;
            this.release_date = resp.data.release_date;
            this.genre = resp.data.genre;
            this.duration = resp.data.duration;
            this.description = resp.data.description;
            this.stars = resp.data.stars;
            this.clips = resp.data.clips;
            this.videos = resp.data.videos;
            this.lang = resp.data.lang;
            this.release_vision = resp.data.release_vision;
            this.country = resp.data.country;
            this.mknown = resp.data.mknown;
        }).catch(err => {
            console.log('请求失败：'+err.status+','+err.statusText);
        });
    },
    updated: function () {
        // this.currentPreviewTitle = this.videos[0].title;
        document.title = '和和影业 - ' + this.title;
        $('#film-posters-slides').slick({
	        // dots: true,
	        infinite: false,
	        // slidesToShow: 4,
	        variableWidth: true,
	        arrows: true,
	        prevArrow: $("#film-posters-left"),
	        nextArrow: $("#film-posters-right"),
	        // centerPadding: '40px',
	        // centerMode: true,
	    });
	    $('#film-images-slides').slick({
	        // dots: true,
	        infinite: false,
	        // slidesToShow: 4,
	        variableWidth: true,
	        arrows: true,
	        prevArrow: $("#film-images-left"),
	        nextArrow: $("#film-images-right"),
	        // centerPadding: '40px',
	        // centerMode: true,
	    });
	
	    $('[data-fancybox]').fancybox({
	        infobar: false,
	        toolbar: false,
	        idleTime: 0,
	        btnTpl: {
	            arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
	                    '<img src="../../static/hehe/images/arrow-left-hh.png">' +
	                  '</button>',
	            arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
	                    '<img src="../../static/hehe/images/arrow-right-hh.png">' +
	                  '</button>',
	        }
	    })
    },
    methods: {
        sliceVideos: function (n) {
            return this.videos.slice((n - 1) * 3, n * 3);
        },
        thumbnailClick: function (index) {
            // this.currentPreviewTitle = this.videos[index].title;
            this.currentPreviewIndex = index;
            this.currentThumbnailIndex = Math.floor(index / 3);
            if (lastSelectedThumbnailIndex != index) {
                $("#moviePreview").carousel(index);
                $("#movieThumbnail").carousel(Math.floor(index / 3));
                lastSelectedThumbnailIndex = index;
            }
        },
    }
})

var lastSelectedThumbnailIndex = 0;

$('#movieThumbnail').on('slid.bs.carousel', function () {
    index = $('#movieThumbnail > .carousel-inner > div.active').index();
    vue.currentThumbnailIndex = index;
});
$('#moviePreview').on('slid.bs.carousel', function () {
    index = $('#moviePreview > .carousel-inner > div.active').index();
    vue.currentPreviewIndex = index;
    vue.currentThumbnailIndex = Math.floor(index / 3);
    if (lastSelectedThumbnailIndex != index) {
        $("#movieThumbnail").carousel(Math.floor(index / 3));
        lastSelectedThumbnailIndex = index;
    }
});


//full screen video play
var videoPlayCur = 0;

function updateFSArrowStatus() {
    if (videoPlayCur == 0) {
        $(".fs-video-arrow-left").addClass("fs-video-arrow-disable");
    } else {
        $(".fs-video-arrow-left").removeClass("fs-video-arrow-disable");
    }
    if (videoPlayCur == data.list.length - 1) {
        $(".fs-video-arrow-right").addClass("fs-video-arrow-disable");
    } else {
        $(".fs-video-arrow-right").removeClass("fs-video-arrow-disable");
    }
}

function showFSVideoContainer(index) {
    var item = data.list[index];
    if ($(window).width() > 768) {
        $(".fs-video-container").show();
        $("body").css({overflow: "hidden"});

        videoPlayCur = index;
        var item = data.list[index];

        var videoPlayer = videojs('fs-videojs-player');
        videoPlayer.src(item.url);
        videoPlayer.ready(function () {
            videoPlayer.play();
        });
        updateFSArrowStatus();
    }
    // else if (getMobileOperatingSystem() == 'iOS11') {
    // 	$('.videos-item-thumbnail').eq(index)[0].play();
    // }
}

function hideFSVideoContainer() {

    $(".fs-video-container").hide();
    $("body").css({overflow: "auto"});

    var videoPlayer = videojs('fs-videojs-player');
    videoPlayer.pause();
    videoPlayer.currentTime(0);
}

function prevFSVideo() {

    $(".fs-video-container").show();
    $("body").css({overflow: "hidden"});

    var prevIndex = videoPlayCur - 1;
    if (prevIndex >= 0) {
        videoPlayCur = prevIndex;
        var item = data.list[prevIndex];

        var videoPlayer = videojs('fs-videojs-player');
        videoPlayer.src(item.url);
        videoPlayer.ready(function () {
            videoPlayer.play();
        });
        updateFSArrowStatus();
    }
    stopBubble();
}

function nextFSVideo() {

    $(".fs-video-container").show();
    $("body").css({overflow: "hidden"});

    var nextIndex = videoPlayCur + 1;
    if (nextIndex < data.list.length) {
        videoPlayCur = nextIndex;
        var item = data.list[nextIndex];

        var videoPlayer = videojs('fs-videojs-player');
        videoPlayer.src(item.url);
        videoPlayer.ready(function () {
            videoPlayer.play();
        });
        updateFSArrowStatus();
    }
    stopBubble();

}




