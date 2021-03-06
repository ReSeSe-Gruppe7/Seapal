$(function() {

	function loadEntry(routenr) { 
			        	
	    jQuery.get("app_trip_load.html", {'tnr': routenr}, function(data) {
		
	        $('#titel').val(data['titel']);
	        $('#von').val(data['von']);
	        $('#nach').val(data['nach']);
	        $('#tstart').val(data['tstart']);
	        $('#tende').val(data['tende']);
	        $('#tdauer').val(data['tdauer']);
	        $('#skipper').val(data['skipper']);
	        $('#crew').val(data['crew']);
	        $('#motor').val(data['motor']);
	        $('#tank').val(data['tank']);
	
	    }, "json");
	}
	
	function addEntry(tnr, json) {
		
		var entry = "";
		
		entry += "<tr class='selectable'>";
	    entry += "<td>" + json.titel + "</td>";
	    entry += "<td>" + json.skipper + "</td>";
	    entry += "<td>" + json.tstart + "</td>";
	    entry += "<td>" + json.tende + "</td>";
	    entry += "<td>" + json.tdauer + "</td>";
	    entry += "<td>" + json.motor + "</td>";
	    entry += "<td style='width:30px; text-align:right;'><div class='btn-group'>";
		entry += "<a class='btn btn-small view' id='" + tnr + "'><span><i class='icon-eye-open'></i></span></a>";
		entry += "<a class='btn btn-small remove' id='" + tnr + "'><span><i class='icon-remove'></i></span></a>";
		entry += "<a href='app_tripinfo.php?tnr=" + tnr + "' class='btn btn-small redirect' id='" + tnr + "'><span><i class='icon-chevron-right'></i></span></a>";
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
		jQuery.get("app_trip_delete.html", { "tnr": tripnr }, function(data) { 
		
			if (data['tnr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['tnr'].replace(/Error: /, ""));
		    	
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
		
		var query = window.location.search;
		
		var errorList = [];
		var errorIds  = [];
		var checkList = [];
		
		var inputNodes = $('#inputFields > div > div > input');
		var divNodes = $('#inputFields > div div');
		
		for(var i = 0; i < divNodes.length; i++) {
			$('#' + divNodes[i].id + '').attr('class', 'control-group' );
		}
		for(var i = 0; i < divNodes.length; i++) {
			if(divNodes[i].id == "") {
				divNodes.splice(i,1);
			}
		}
		if(errorList.length == 0) {
			errorList.push("</br>");
		}
		for(var i = 0; i < inputNodes.length; i++) {
			if ($('#' + inputNodes[i].id + '').val() == "") {

				errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + "</br>");
				errorIds.push( divNodes[i].id );
			}
			var check = ($('#' + inputNodes[i].id + '').attr("class")).split(" ");
			if(jQuery.inArray("check_number", check) > 0 && isNaN($('#' + inputNodes[i].id + '').val())) {
				errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " ist keine Zahl! </br>");
				errorIds.push( divNodes[i].id );
			}
		}
		
		if (!(errorIds.length === 0)) {
			$('#dialogTitle').text('Fehler');
			$('#dialogMessage').text(
					"Folgende Angaben sind nicht korrekt bzw. nicht ausgefüllt:");
			$('#dialogMessage').append(errorList);	
			
			$('#messageBox').modal('show');
			
			/* run thru the inputfields and set die color to red */
			for(var i = 0; i < errorIds.length; i++) {
				$('#' + errorIds[i] + '').attr('class', '' + $('#' + errorIds[i] + '').attr('class') + ' error');
			}
			
			return;
		}
		
	
		var json = {
            "titel": $('#titel').val(),
            "von": $('#von').val(),
            "nach": $('#nach').val(),
	        "tstart": $('#tstart').val(),
	        "tende": $('#tende').val(),
	        "tdauer": $('#tdauer').val(),
	        "skipper": $('#skipper').val(),
	        "crew": $('#crew').val(),
	        "motor": $('#motor').val(),
	        "tank": $('#tank').val()        
	    };
	
	    jQuery.post("app_trip_insert.html", json, function(data) { 
	    
	    	if (data['tnr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['tnr'].replace(/Error: /, ""));
		    	
	    	} else {
		    	
		    	addEntry( data['tnr'], json );
	    
		    	$('#dialogTitle').text('Success');
		    	$('#dialogMessage').text("Eintrag wurde erfolgreich gespeichert.");
	    	}
	    	
	    	$('#messageBox').modal('show');
	    
	    }, "json");
		
	});
});