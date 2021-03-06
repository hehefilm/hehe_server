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
         act: act,
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
            //$("#movie-del").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            //$("#movie-edit").css('display', 'none');
            //$("#movie-del").css('display', 'none');
          } else if (act == "del") {
            target.closest('tr').remove();
          } else if (act == 'banner-on') {
            return alert("该作品已成功添加到BANNER。");
          } else if (act == 'banner-off') {
            target.closest('tr').remove();
          } else if (act == 'rcmd-on') {
            return alert("推荐成功。");
          } else if (act == 'rcmd-off') {
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
            //$("#banner-del").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            //$("#banner-edit").css('display', 'none');
            //$("#banner-del").css('display', 'none');
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
            //$("#news-del").css('display', 'block');
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
            //$("#news-edit").css('display', 'none');
            //$("#news-del").css('display', 'none');
          } else if (act == "fst") {
            return alert("置顶成功，前端将展示在新闻首位。");
          } else if (act == "del") {
            target.closest('tr').remove();
          }
        } else {
            return alert(data);
        }
       }
     };
     return $.ajax(params);
    }
  });

  $('.project-op').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    act = target.attr('act');
    if (confirm(target.attr('hint'))) {
     params = {
       url: "/hehebb/project_unit",
       method: 'POST',
       data: {
         act: act,
         proid: target.attr('proid')
       },
       success: function(data, status) {
        if (data == "ok") {
          if (act == "off") {
            target.text("上线");
            target.attr('act', "on");
            target.css('color', "green");
            target.attr('placeholder', "确定将该项目上线吗？");
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
          } else if (act == "fst") {
            return alert("置顶成功，前端将展示在项目首位。");
          } else if (act == "del") {
            target.closest('tr').remove();
          }
        } else {
            return alert(data);
        }
       }
     };
     return $.ajax(params);
    }
  });

  $('.webroll-op').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    act = target.attr('act');
    if (confirm(target.attr('hint'))) {
     params = {
       url: "/hehebb/webroll",
       method: 'POST',
       data: {
         act: act,
         rid: target.attr('rid')
       },
       success: function(data, status) {
        if (data == "ok") {
          if (act == "off") {
            target.text("上线");
            target.attr('act', "on");
            target.css('color', "green");
            target.attr('placeholder', "确定将该伙伴上线吗？");
          } else if (act == "on") {
            target.text("下线");
            target.attr('act', "off");
            target.css('color', "red");
            target.attr('placeholder', "下线后将不在官网展示，确定吗？");
          } else if (act == "fst") {
            return alert("置顶成功，前端将展示在伙伴首位。");
          } else if (act == "del") {
            target.closest('tr').remove();
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
