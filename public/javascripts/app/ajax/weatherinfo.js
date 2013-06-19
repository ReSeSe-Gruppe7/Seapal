


$(function() {

	function loadEntry(routenr) { 
			        	
	    jQuery.get("app_weatherinfo_load.html", {'inr': routenr}, function(data) {
		
	        $('#windstrength').val(data['windstrength']);
	        $('#airpressure').val(data['airpressure']);
	        $('#clouds').val(data['clouds']);
	        $('#wavehight').val(data['wavehight']);
	        $('#time').val(data['time']);
	        $('#winddirection').val(data['winddirection']);
	        $('#temperature').val(data['temperature']);
	        $('#rain').val(data['rain']);
	        $('#wavedirection').val(data['wavedirection']);
	        $('#date').val(data['date']);
	
	    }, "json");
	}
	
	function addEntry(inr, json) {
		
		var entry = "";
		
		entry += "<tr class='selectable'>";
	    entry += "<td>" + json.windstrength + "</td>";
	    entry += "<td>" + json.winddirection + "</td>";
	    entry += "<td>" + json.airpressure + "</td>";
	    entry += "<td>" + json.temperature + "</td>";
	    entry += "<td>" + json.wavehight + "</td>";
	    entry += "<td>" + json.wavedirection + "</td>";
	    entry += "<td style='width:30px; text-align:right;'><div class='btn-group'>";
		entry += "<a class='btn btn-small view' id='" + inr + "'><span><i class='icon-eye-open'></i></span></a>";
		entry += "<a class='btn btn-small remove' id='" + inr + "'><span><i class='icon-remove'></i></span></a>";
		entry += "<a href='app_weatherinfo.php?inr=" + inr + "' class='btn btn-small redirect' id='" + inr + "'><span><i class='icon-chevron-right'></i></span></a>";
		entry += "</div></td>";
	    entry += "</tr>";
	    
		$('#entries').append(entry);
	}

	$('a.view').live("click", function(event) {
		loadEntry($(this).attr('id'));
	});
	
	$('a.remove').live("click", function(event) {
		var buttonID = this;
	 	var tripnr = $(this).attr('id');
		jQuery.get("app_weatherinfo_delete.html", { "inr": tripnr }, function(data) { 
		
			if (data['inr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['inr'].replace(/Error: /, ""));
		    	
	    	} else {
		    	
		    	$(buttonID).parents('tr').remove();  
	    
		    	$('#dialogTitle').text('Succes');
		    	$('#dialogMessage').text("Eintrag wurde erfolgreich gelöscht.");
	    	}
			
			$('#messageBox').modal('show');
		}, "json");		
	});
	
	$('#save').click(function(event) {
	
		event.preventDefault();
	
		var json = {
            "windstrength": $('#windstrength').val(),
            "airpressure": $('#airpressure').val(),
            "clouds": $('#clouds').val(),
	        "wavehight": $('#wavehight').val(),
	        "time": $('#time').val(),
	        "winddirection": $('#winddirection').val(),
	        "temperature": $('#temperature').val(),
	        "rain": $('#rain').val(),
	        "wavedirection": $('#wavedirection').val(),
	        "date": $('#date').val()        
	    };
	
	    jQuery.post("app_weatherinfo_insert.html", json, function(data) { 
	    
	    	if (data['inr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['inr'].replace(/Error: /, ""));
		    	
	    	} else {
		    	
		    	addEntry( data['inr'], json );
	    
		    	$('#dialogTitle').text('Success');
		    	$('#dialogMessage').text("Eintrag wurde erfolgreich gespeichert.");
	    	}
	    	
	    	$('#messageBox').modal('show');
	    
	    }, "json");
		
	});
});