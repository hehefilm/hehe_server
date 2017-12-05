
function rmClipPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#i_"+obj.id).val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmMovieEditClipPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $(obj).attr("pkey")
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmPostPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#movie-cover-pic").val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
          $("#poster-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmBannerPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#banner-cover-pic").val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
          $("#banner-cover-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmNewsPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#news-cover-pic").val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
          $("#news-cover-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmProjectPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#project-cover-pic").val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
          $("#project-cover-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}
