$(function() {

	function loadEntry(waypnr) { 
		
		jQuery.get("app_tripinfo_load.html", {'wnr': waypnr}, function(data) {
	   
	        $('#name').val(data['name']);
	        $('#lat').val(data['lat']);
	        $('#lng').val(data['lng']);
	        $('#btm').val(data['btm']);
	        $('#dtm').val(data['dtm']);
	        $('#sog').val(data['sog']);
	        $('#cog').val(data['cog']);
	        $('#manoever').append("<option>" + data['manoever'] + '</option>');
	        $('#vorsegel').append('<option>' + data['vorsegel'] + '</option>');
	        $('#marker').append('<option>' + data['marker'] + '</option>');
	        $('#wdate').val(data['wdate']);
	        $('#wtime').val(data['wtime']);
	        
	    }, "json");
	}
	
	function addEntry(wnr, json) {
		
		var entry = "";
		
		entry += "<tr class='selectable'>";
	    entry += "<td><span class='wnr' style='display: none;'>" + wnr + "</span>" + json.name + "</td>";
	    entry += "<td>" + json.lat + "</td>";
	    entry += "<td>" + json.lng + "</td>";
	    entry += "<td>" + json.btm + "</td>";
	    entry += "<td>" + json.dtm + "</td>";
	    entry += "<td>" + json.manoever + "</td>";
	    entry += "<td style='width:30px; text-align:right;'><div class='btn-group'>";
	    entry += "<a class='btn btn-small view' id='" + wnr + "'><span><i class='icon-eye-open'></i></span></a>";
		entry += "<a class='btn btn-small remove' id='" + wnr + "'><span><i class='icon-remove'></i></span></a>";
		entry += "<a href='app_waypoint.html?wnr=" + wnr  + "' class='btn btn-small redirect' id='" + wnr + "'><span><i class='icon-chevron-right'></i></span></a>";
		entry += "</div></td>";
	    entry += "</tr>";
	    
		$('#entries').append(entry);
	}	
	
	$('a.view').live("click", function(event) {
		loadEntry($(this).attr('id'));
	});
	
	$('a.remove').live("click", function(event) {
		var buttonID = this;
	 	var waypnr = $(this).attr('id');
		jQuery.get("app_tripinfo_delete.html", { "wnr": waypnr }, function(data) { 
		
			if (data['wnr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['wnr'].replace(/Error: /, ""));
		    	
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
			var check = ($('#' + inputNodes[i].id + '').attr("class")).split(" ");
			var regex = "";
			var result;
			var val = $('#' + inputNodes[i].id + '').val();

			if ($('#' + inputNodes[i].id + '').val() == "") {

				errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + "</br>");
				errorIds.push( divNodes[i].id );
			}
			
			else if(jQuery.inArray("check_number", check) > 0 && isNaN($('#' + inputNodes[i].id + '').val())) {
				errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " ist keine Zahl! </br>");
				errorIds.push( divNodes[i].id );
			}


			else if(jQuery.inArray("check_date", check) > 0) {
				result = val.match(/([0-9]{4})\.([0-9]{2})\.([0-9]{2})/);
				
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Datum! </br>");
					errorIds.push( divNodes[i].id );					
				}

			}
			else if(jQuery.inArray("check_time", check) > 0) {
				result = val.match(/([0-9]{2})(\:[0-9]{2})/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt keine gültige Uhrzeit! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_lat", check) > 0) {
				result = val.match(/([0-9]{2})°([0-9]{2})\.([0-9]{2})\'(N|S)/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_long", check) > 0) {
				result = val.match(/([0-9]{3})°([0-9]{2})\.([0-9]{2})\'(W|E)/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_cog", check) > 0) {
				result = val.match(/([0-9]{1,3})\.([0-9])°/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_sog", check) > 0) {
				result = val.match(/([0-9]{1,4})\.([0-9]) kn/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_btm", check) > 0) {
				result = val.match(/([0-9]{1,4})°/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
			}
			else if(jQuery.inArray("check_dtm", check) > 0) {
				result = val.match(/([0-9]{1,2})\.([0-9]{1,4}) nm/);
				if(!result) {
					errorList.push( "-> " + $('#' + divNodes[i].id + " label:first-child").text() + " besitzt kein gültiges Format! </br>");
					errorIds.push( divNodes[i].id );
				}
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
		
		
		
		var tripnrQuery = query.match(/tnr=\d/);
		var tripnr = tripnrQuery[0].replace(/tnr=/, "");
	
		var json = {
			"tnr": tripnr,
            "name": $('#name').val(),
            "lat": $('#lat').val(),
            "lng": $('#lng').val(),
	        "btm": $('#btm').val(),
	        "dtm": $('#dtm').val(),
	        "sog": $('#sog').val(),
	        "cog": $('#cog').val(),
	        "manoever": $("#manoever :selected").text(),
	        "vorsegel": $("#vorsegel :selected").text(),
	        "marker": $("#marker :selected").text(),
	        "wdate": $('#wdate').val(),
	        "wtime": $('#wtime').val()         
	    };
	
	    jQuery.post("app_tripinfo_insert.html", json, function(data) { 
	    
	    	if (data['wnr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['wnr'].replace(/Error: /, ""));
		    	
	    	} else {
		    	
		    	addEntry( data['wnr'], json ); 
	    
		    	$('#dialogTitle').text('Success');
		    	$('#dialogMessage').text("Eintrag wurde erfolgreich gespeichert.");
	    	}
	    
	    	$('#messageBox').modal('show');
	    	
	    }, "json");
	});

});