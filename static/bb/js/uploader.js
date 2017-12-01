
$(function(){
	var $list = $("#thelist"),
		$btn = $("#ctlbtn"),
		thumbnailWidth = 100,
		thumbnailHeight = 100;

	var uploader = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://staging.hehefilm.com/hehebb/covers"+"?tp="+$("#uploader").attr("tp"),
		fileVal: "upfile",
		fileSingleSizeLimit: 20480000,
		pick: "#filePicker",
		accept: {
			title: "Images",
			extensions: "gif,jpg,jpeg,bmp,png",
			mimeType: "image/*"
		},
		mehtod: "POST"
	});

	uploader.on("fileQueued", function(file){
		var $li = $(
				'<div id="' + file.id + '" class="file-item thumbnail">' +
				'<img>' +
				'<div class="info">' + file.name + '</div>'
			),
			$img = $li.find("img");

		$list.append($li);

		uploader.makeThumb(file, function(error, src){
			if (error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr("src", src);
		}, thumbnailWidth, thumbnailHeight);
	});

	uploader.on("uploadBeforeSend", function(file, data, header){
		data["tp"] = $("#uploader").attr("tp");
	})

	uploader.on("uploadProgress", function(file, percentage){
		var $li = $("#"+file.id),
			$percent = $li.find(".progress span");
		if (!$percent.length) {
			$percent = $('<p class="progress"><span></span></p>')
						.appendTo($li)
						.find('span');
		}
		$percent.css('width', percentage*100+'%');
	});

	uploader.on("uploadSuccess", function(file, ret){
		$('#'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			alert(json.msg);
		} else {
			$('#news-cover-pic').val(json.pic_key);
		}
	});

	uploader.on("uploadError", function(file){
		var $li = $("#"+file.id),
			$error = $li.find('div.error');
		if (!error.length) {
			$error = $('<div class="error"></div>').appendTo($li);
		}
		$error.text("上传失败");
	});

	uploader.on("uploadComplete", function(file){
		$("#"+file.id).find('.progress').remove();
	});

	$btn.on('click', function(){
		uploader.upload();
	});

});
