/*global Qiniu */
/*global plupload */

var uploader = Qiniu.uploader({
  runtimes: 'html5,html4',
  browse_button: 'pickfiles',
  // uptoken_url: '',
  uptoken_func: function(){
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'https://shanxiaxuetang.com/sxxtbb/uptkn', false);
    ajax.setRequestHeader("If-Modified-Since", "0");
    ajax.send();
    if (ajax.status === 200) {
      var res = JSON.parse(ajax.responseText);
      // console.log('custom uptoken_func:' + res.uptoken);
      return res.uptoken;
      } else {
        console.log('custom uptoken_func err');
        return '';
      }
  },
  get_new_uptoken: false,
  unique_names: true,
  domain: 'http://qnp.shanxiaxuetang.com/',
  container: 'container',
  max_file_size: '200mb',
  max_retries: 3,
  dragdrop: true,
  drop_element: 'container',
  chunk_size: '4mb',
  auto_start: true,
  init: {
    'FilesAdded': function(up, files) {
      plupload.each(files, function(file) {

      });
    },
    'BeforeUpload': function(up, file) {
      $("#file-input-res").attr("value", "");
    },
    'UploadProgress': function(up, file) {
      $("#sx-vdo-progress").css("width", file.percent+"%");
      $("#sx-vdo-progress").text(file.percent+"%");
    },
    'FileUploaded': function(up, file, info) {
      var res = {};
      if (info.response) {
        res = JSON.parse(info.response);
      } else {
        res = res = JSON.parse(info);
      }
      var source = up.getOption('domain') + res.key;
      $("#file-input").attr("value", res.key);
      $("#file-input-res").attr("value", source);
      $("#rst-up-name").attr("value", file.name);
    },
    'Error': function(up, err, errTip) {

    },
    'UploadComplete': function() {

    },
    'Key': function(up, file) {
      var key = "";
      return key
    }
  }
});

var uploader_pic = Qiniu.uploader({
  runtimes: 'html5,html4',
  browse_button: 'pickfiles-pic',
  // uptoken_url: '',
  uptoken_func: function(){
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'https://shanxiaxuetang.com/sxxtbb/uptkn', false);
    ajax.setRequestHeader("If-Modified-Since", "0");
    ajax.send();
    if (ajax.status === 200) {
      var res = JSON.parse(ajax.responseText);
      // console.log('custom uptoken_func:' + res.uptoken);
      return res.uptoken;
      } else {
        console.log('custom uptoken_func err');
        return '';
      }
  },
  get_new_uptoken: false,
  unique_names: true,
  domain: 'http://qnp.shanxiaxuetang.com/',
  container: 'container',
  max_file_size: '200mb',
  max_retries: 3,
  dragdrop: true,
  drop_element: 'container',
  chunk_size: '4mb',
  auto_start: true,
  init: {
    'FilesAdded': function(up, files) {
      plupload.each(files, function(file) {

      });
    },
    'BeforeUpload': function(up, file) {
      $("#file-input-res").attr("value", "");
    },
    'UploadProgress': function(up, file) {

    },
    'FileUploaded': function(up, file, info) {
      var res = {};
      if (info.response) {
        res = JSON.parse(info.response);
      } else {
        res = res = JSON.parse(info);
      }
      $("#file-input-pic").attr("value", res.key);
    },
    'Error': function(up, err, errTip) {

    },
    'UploadComplete': function() {

    },
    'Key': function(up, file) {
      var key = "";
      return key
    }
  }
});
