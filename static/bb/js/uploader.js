
$(function(){
	var $list = $("#thelist"),
		$list_2 = $("#thelist_2"),
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
					'<div class="info">' + file.name + '</div>' +
				'</div>'
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
			$percent = $li.find(".progress .progress-bar");
		if (!$percent.length) {
			$percent = $('<div class="progress progress-striped active">' +
				'<div class="progress-bar" role="progressbar" style="width: 0%">' +
				'</div>' +
				'</div>').appendTo($li).find('.progress-bar');
		}
		$li.find('p.state').text("上传中...");
		$percent.css('width', percentage*100+'%');
	});

	uploader.on("uploadSuccess", function(file, ret){
		$('#'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			alert(json.msg);
		} else if (json.tp == 'news-cover-pic') {
			$('#news-cover-pic').val(json.key);
		} else if (json.tp == 'banner-cover-pic') {
			$('#banner-cover-pic').val(json.key);
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


	var uploader_2 = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://staging.hehefilm.com/hehebb/covers"+"?tp="+$("#uploader_2").attr("tp"),
		fileVal: "upfile",
		fileSingleSizeLimit: 20480000,
		pick: "#filePicker_2",
		accept: {
			title: "Images",
			extensions: "gif,jpg,jpeg,bmp,png",
			mimeType: "image/*"
		},
		mehtod: "POST"
	});

	uploader_2.on("fileQueued", function(file){
		var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '</div>' +
					'<input id="i_' + file.id + '" ' +
					'form="movie" type="text" style="display: none;" name="clips" value="">' +
					'</input>' +
				'</div>'
			),
			$img = $li.find("img");

		$list_2.append($li);

		uploader_2.makeThumb(file, function(error, src){
			if (error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr("src", src);
		}, thumbnailWidth, thumbnailHeight);
	});

	uploader_2.on("uploadBeforeSend", function(file, data, header){
		data["tp"] = $("#uploader_2").attr("tp");
		data["fid"] = file.file.id;
	})

	uploader_2.on("uploadProgress", function(file, percentage){
		var $li = $("#"+file.id),
			$percent = $li.find(".progress .progress-bar");
		if (!$percent.length) {
			$percent = $('<div class="progress progress-striped active">' +
				'<div class="progress-bar" role="progressbar" style="width: 0%">' +
				'</div>' +
				'</div>').appendTo($li).find('.progress-bar');
		}
		$li.find('p.state').text("上传中...");
		$percent.css('width', percentage*100+'%');
	});

	uploader_2.on("uploadSuccess", function(file, ret){
		$('#'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			alert(json.msg);
		} else {
			$('#i_'+file.id).val(json.key);
		}
	});

	uploader_2.on("uploadError", function(file){
		var $li = $("#"+file.id),
			$error = $li.find('div.error');
		if (!error.length) {
			$error = $('<div class="error"></div>').appendTo($li);
		}
		$error.text("上传失败");
	});

	uploader_2.on("uploadComplete", function(file){
		$("#"+file.id).find('.progress').remove();
	});

});
