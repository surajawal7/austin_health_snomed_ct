jQuery.fn.tableToCSV = function() {

    var clean_text = function(text){
        text = text.replace(/"/g, '""');
        return '"'+text+'"';
    };

	$(this).each(function(){
			var table = $(this);
			var caption = $(this).find('caption').text();
			var title = [];
			var rows = [];
			var nestedParent = $(this).find('.agpv1').length;

			if(nestedParent > 0){
				$(this).find('tr').each(function(index){
					var data = [];

					$(this).find('td').not('.tgt_code').not('.tgt_label').not('.parents').each(function(){
						if(index == 0){
							if($(this).hasClass('oldPreferredParent')){
								data.push('tgt_code');
							}else if($(this).hasClass('oldPreferredParentLable')){
								data.push('tgt_label');
							}else{
								var text = clean_text($(this).text());
								data.push(text);
							}
						}else{
							var text = clean_text($(this).text());
							data.push(text);
						}
					});
					data = data.join(",");
					rows.push(data);
				});
			}else{
				$(this).find('tr').each(function(){
					var data = [];
					$(this).find('th').each(function(){
	                    var text = clean_text($(this).text());
						title.push(text);
						});
					$(this).find('td').not('.parents').each(function(){
	                    var text = clean_text($(this).text());
						data.push(text);
						});
					data = data.join(",");
					rows.push(data);
				});
			}


			title = title.join(",");
			rows = rows.join("\n");

			var csv = title + rows;
			var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
			var download_link = document.createElement('a');
			download_link.href = uri;
			var ts = new Date().getTime();
			if(caption==""){
				download_link.download = ts+".csv";
			} else {
				download_link.download = caption+"-"+ts+".csv";
			}
			document.body.appendChild(download_link);
			download_link.click();
			document.body.removeChild(download_link);
	});

};
