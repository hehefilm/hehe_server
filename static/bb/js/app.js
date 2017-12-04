//(function($) {
//  'use strict';

//  $(function() {
//    var $fullText = $('.admin-fullText');
//    $('#admin-fullscreen').on('click', function() {
//      $.AMUI.fullscreen.toggle();
//    });

//    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
//      $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
//    });
//  });
//})(jQuery);

$(document).ready(function() {
  $('.movie-op').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    act = target.attr('act');
    if (confirm(target.attr('hint'))) {
     params = {
       url: "/hehebb/movie",
       method: 'POST',
       data: {
         act: target.attr('act'),
         mid: target.attr('mid')
       },
       success: function(data, status) {
        if (data == "ok") {
          if (act == "off") {
            target.text("上线");
            target.attr('act', "on");
            target.css('color', "green");
            target.attr('placeholder', "确定要上线该作品吗？");
            //$("#movie-edit").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            $("#movie-edit").css('display', none);
          } else if (act == "del") {
            target.closest('li').remove();
          }
        } else {
            return alert(data);
        }
       }
     };
     return $.ajax(params);
    }
  });

  $('.banner-op').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    act = target.attr('act');
    if (confirm(target.attr('hint'))) {
     params = {
       url: "/hehebb/banner",
       method: 'POST',
       data: {
         act: act,
         bid: target.attr('bid')
       },
       success: function(data, status) {
        if (data == "ok") {
          if (act == "off") {
            target.text("上线");
            target.attr('act', "on");
            target.css('color', "green");
            target.attr('placeholder', "确定将该内容上线吗？");
            //$("#banner-edit").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            $("#banner-edit").css('display', none);
          } else if (act == "fst") {
            return alert("置顶成功，前端将展示在banner首位");
          } else if (act == "del") {
            target.closest('li').remove();
          }
        } else {
            return alert(data);
        }
       }
     };
     return $.ajax(params);
    }
  });

  $('.news-op').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    act = target.attr('act');
    if (confirm(target.attr('hint'))) {
     params = {
       url: "/hehebb/news_unit",
       method: 'POST',
       data: {
         act: act,
         nid: target.attr('nid')
       },
       success: function(data, status) {
        if (data == "ok") {
          if (act == "off") {
            target.text("上线");
            target.attr('act', "on");
            target.css('color', "green");
            target.attr('placeholder', "确定将该新闻上线吗？");
            //$("#news-edit").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            $("#news-edit").css('display', none);
          } else if (act == "fst") {
            return alert("置顶成功，前端将展示在山下新闻首位。");
          } else if (act == "del") {
            target.closest('li').remove();
          }
        } else {
            return alert(data);
        }
       }
     };
     return $.ajax(params);
    }
  });

});

function createdToStrftime(created) {
  return ''
}


function expiredTsToStrf(expired) {
  return ''
}
