
var banner = [];
new Vue({
	el:'#mysection',
	data:{
		banner:banner,
	},
	created: function() {
		this.getBanner();
	},
	methods:{
		getBanner(){
			axios.get(`http://staging.hehefilm.com/resources/banner?pg=1&num=10`)
			.then(resp => {
				var banner = resp.data.banner_li;
//				banner.push(banner[0]);
//				banner.push(banner[0]);
//				banner.push(banner[0]);
//				banner.push(banner[0]);
				this.banner = banner;
				console.log(resp.data);
			}).catch(err => {
				console.log('请求失败：'+err.status+','+err.statusText);
			});
		},
	},
});


$(document).ready(function(){
	// invoke the carousel
    $('#mybanner').carousel({
      interval: 5000
    });

	// scroll slides on mouse scroll 
//	$('#myCarousel').bind('mousewheel DOMMouseScroll', function(e){
//
//      if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
//          $(this).carousel('prev');
//			
//      }
//      else{
//          $(this).carousel('next');
//			
//      }
//  });

	//scroll slides on swipe for touch enabled devices 

 	$("#mybanner").on("touchstart", function(event){

        var yClick = event.originalEvent.touches[0].pageY;
    	$(this).one("touchmove", function(event){

        var yMove = event.originalEvent.touches[0].pageY;
        if( Math.floor(yClick - yMove) > 1 ){
            $(".carousel").carousel('next');
        }
        else if( Math.floor(yClick - yMove) < -1 ){
            $(".carousel").carousel('prev');
        }
    });
    $(".carousel").on("touchend", function(){
            $(this).off("touchmove");
    });
});
    
});
