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
  $('.ajax-delete-pic').click(function(event) {
    var params, target;
    event.preventDefault();
    target = $(event.target);
    //if (confirm(target.attr('hint'))) {
    //  params = {
    //    url: target.attr('href'),
    //    method: 'POST',
    //    data: {
    //      action: 'del-pic-keys',
    //      pids: target.attr('pid')
    //    },
    //    success: function() {
    //      target.parents('li').remove();
    //      return alert('删除成功');
    //    }

    //  };
    //  return $.ajax(params);
    //}
});


function createdToStrftime(created) {
  return ''
}


function expiredTsToStrf(expired) {
  return ''
}
