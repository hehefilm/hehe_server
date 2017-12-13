
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

function rmPosterPic(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#mp_"+obj.id).val()
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

function rmMovieEditPosterPic(obj) {
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

function rmMovieCoverPic(obj) {
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
          $("#mcover-picker").css('display', 'block');
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

function rmWebRollLogo(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#web-roll-logo").val()
      },
      success: function(data, status) {
        if (data == "ok") {
          obj.remove();
          $("#web-roll-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmMovieVideoCover(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $("#mvc_"+obj.id).val()
      },
      success: function(data, status) {
        if (data == "ok") {
          $("#mvl_"+obj.id).remove();
          obj.remove();
          $("#movie-video-cover-picker").css('display', 'block');
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}

function rmMovieEditVideoCover(obj) {
  if (confirm($(obj).attr("hint"))) {
    var params = {
      url: "/hehebb/remove_resource",
      method: 'POST',
      data: {
        key: $(obj).attr("pkey")
      },
      success: function(data, status) {
        if (data == "ok") {
          $("#"+obj.id+"-link").remove();
          obj.remove();
        } else {
          return alert(data);
        }
      }
    };
    return $.ajax(params);
  }
}
