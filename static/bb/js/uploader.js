
$(function(){
	var $list = $("#thelist"),
		$list_2 = $("#thelist_2"),
		$list_3 = $("#thelist_3"),
		$list_4 = $("#thelist_4"),
		$btn = $("#ctlbtn"),
		tp = $("#uploader").attr("tp"),
		thumbnailWidth = 100,
		thumbnailHeight = 100;

	var uploader = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://staging.hehefilm.com/hehebb/covers"+"?tp="+tp,
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
		if (tp == 'banner-cover-pic') {
			var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmBannerPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			);
		} else if (tp == 'news-cover-pic') {
			var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmNewsPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			);
		} else if (tp == 'project-cover-pic') {
			var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmProjectPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			);
		} else if (tp == 'web-roll-logo') {
			var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmWebRollLogo(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			);
		} else {
			var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmMovieCoverPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			);
		}
		var $img = $li.find("img");

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
			$('#news-cover-picker').css('display', 'none');
		} else if (json.tp == 'banner-cover-pic') {
			$('#banner-cover-pic').val(json.key);
			$('#banner-cover-picker').css('display', 'none');
		} else if (json.tp == 'movie-cover-pic') {
			$('#movie-cover-pic').val(json.key);
			$('#mcover-picker').css('display', 'none');
		} else if (json.tp == 'project-cover-pic') {
			$('#project-cover-pic').val(json.key);
			$('#project-cover-picker').css('display', 'none');
		} else if (json.tp == 'web-roll-logo') {
			$('#web-roll-logo').val(json.key);
			$('#web-roll-picker').css('display', 'none');
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
					'" class="file-item thumbnail" onclick="rmClipPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
					'<input id="i_' + file.id + '" ' +
					'form="movie" type="text" style="display: none;" name="clips[]" value="">' +
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
			console.log('Upload ERROR: '+json.msg);
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


	var uploader_3 = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://staging.hehefilm.com/hehebb/covers"+"?tp="+$("#uploader_3").attr("tp"),
		fileVal: "upfile",
		fileSingleSizeLimit: 20480000,
		pick: "#filePicker_3",
		accept: {
			title: "Images",
			extensions: "gif,jpg,jpeg,bmp,png",
			mimeType: "image/*"
		},
		mehtod: "POST"
	});

	uploader_3.on("fileQueued", function(file){
		var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmPosterPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
					'<input id="mp_' + file.id + '" ' +
					'form="movie" type="text" style="display: none;" name="posters[]" value="">' +
					'</input>' +
				'</div>'
			),
			$img = $li.find("img");

		$list_3.append($li);

		uploader_3.makeThumb(file, function(error, src){
			if (error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr("src", src);
		}, thumbnailWidth, thumbnailHeight);
	});

	uploader_3.on("uploadBeforeSend", function(file, data, header){
		data["tp"] = $("#uploader_3").attr("tp");
		data["fid"] = file.file.id;
	})

	uploader_3.on("uploadProgress", function(file, percentage){
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

	uploader_3.on("uploadSuccess", function(file, ret){
		$('#'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			console.log('Upload ERROR: '+json.msg);
		} else {
			$('#mp_'+file.id).val(json.key);
		}
	});

	uploader_3.on("uploadError", function(file){
		var $li = $("#"+file.id),
			$error = $li.find('div.error');
		if (!error.length) {
			$error = $('<div class="error"></div>').appendTo($li);
		}
		$error.text("上传失败");
	});

	uploader_3.on("uploadComplete", function(file){
		$("#"+file.id).find('.progress').remove();
	});


	var uploader_4 = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://staging.hehefilm.com/hehebb/covers"+"?tp="+$("#uploader_4").attr("tp"),
		fileVal: "upfile",
		fileSingleSizeLimit: 20480000,
		pick: "#filePicker_4",
		accept: {
			title: "Images",
			extensions: "gif,jpg,jpeg,bmp,png",
			mimeType: "image/*"
		},
		mehtod: "POST"
	});

	uploader_4.on("fileQueued", function(file){
		var $li = $(
				'<div id="' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmMovieVideoCover(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
					'<input id="mvc_' + file.id + '" ' +
					'form="movie" type="text" style="display: none;" name="vdo_covers[]" value="">' +
					'</input>' +
				'</div>' +
				'<div id="mvl_' + file.id + '" style="margin-bottom: 5px;">' +
				'<textarea form="movie" name="vdo_links[]" ' +
					'rows="2" cols="25" placeholder="填写视频播放地址。"></textarea>' +
				'</div>'
			),
			$img = $li.find("img");

		$list_4.append($li);

		uploader_4.makeThumb(file, function(error, src){
			if (error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr("src", src);
		}, thumbnailWidth, thumbnailHeight);
	});

	uploader_4.on("uploadBeforeSend", function(file, data, header){
		data["tp"] = $("#uploader_4").attr("tp");
		data["fid"] = file.file.id;
	})

	uploader_4.on("uploadProgress", function(file, percentage){
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

	uploader_4.on("uploadSuccess", function(file, ret){
		$('#'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			console.log('Upload ERROR: '+json.msg);
		} else {
			$('#mvc_'+file.id).val(json.key);
		}
	});

	uploader_4.on("uploadError", function(file){
		var $li = $("#"+file.id),
			$error = $li.find('div.error');
		if (!error.length) {
			$error = $('<div class="error"></div>').appendTo($li);
		}
		$error.text("上传失败");
	});

	uploader_4.on("uploadComplete", function(file){
		$("#"+file.id).find('.progress').remove();
	});

});
