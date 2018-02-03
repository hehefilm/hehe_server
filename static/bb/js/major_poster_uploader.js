
$(function(){
	var $list_5 = $("#thelist_5"),
		$btn = $("#ctlbtn"),
		tp = $("#uploader_5").attr("tp"),
		thumbnailWidth = 100,
		thumbnailHeight = 100;

	var uploader_5 = WebUploader.create({
		auto: true,
		swf: "/static/bb/uploader/Uploader.swf",
		server: "http://www.hehefilm.com/hehebb/covers"+"?tp="+tp,
		fileVal: "upfile",
		fileSingleSizeLimit: 20480000,
		pick: "#filePicker_5",
		accept: {
			title: "Images",
			extensions: "gif,jpg,jpeg,bmp,png",
			mimeType: "image/*"
		},
		mehtod: "POST"
	});

	uploader_5.on("fileQueued", function(file){
		var $li = $(
				'<div id=major_"' + file.id + '" hint="删除不可恢复，确定删除吗？' +
					'" class="file-item thumbnail" onclick="rmMajorPosterPic(this)">' +
					'<img>' +
					'<div class="info">' + file.name + '&nbsp;可删除' + '</div>' +
				'</div>'
			),
			$img = $li.find("img");

		$list_5.append($li);

		uploader_5.makeThumb(file, function(error, src){
			if (error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr("src", src);
		}, thumbnailWidth, thumbnailHeight);
	});

	uploader_5.on("uploadBeforeSend", function(file, data, header){
		data["tp"] = $("#uploader_5").attr("tp");
		data["fid"] = file.file.id;
	})

	uploader_5.on("uploadProgress", function(file, percentage){
		var $li = $("#major_"+file.id),
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

	uploader_5.on("uploadSuccess", function(file, ret){
		$('#major_'+file.id).addClass('upload-state-done');
		var responseText = (ret._raw || ret),
			json = JSON.parse(responseText);
		if (json.state == 'ERROR') {
			console.log('Upload ERROR: '+json.msg);
		} else {
			$('#movie-major-p').val(json.key);
			$('#movie-major-picker').css('display', 'none');
		}
	});

	uploader_5.on("uploadError", function(file){
		var $li = $("#major_"+file.id),
			$error = $li.find('div.error');
		if (!error.length) {
			$error = $('<div class="error"></div>').appendTo($li);
		}
		$error.text("上传失败");
	});

	uploader_5.on("uploadComplete", function(file){
		$("#major_"+file.id).find('.progress').remove();
	});

});
