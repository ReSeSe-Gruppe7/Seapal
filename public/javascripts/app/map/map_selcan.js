var rendererOptions = {
			draggable: true
		};

		var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
		var directionsService = new google.maps.DirectionsService();
				
		function initialize() {		
			
			var crosshairShape = {coords:[0,0,0,0],type:'rect'};
			var latlng = new google.maps.LatLng(47.66,9.16);
			
			var mapOptions = {
				zoom:12,
				center:latlng,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				draggableCursor:'crosshair',
				mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU}
			};

			var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
			directionsDisplay.setMap(map);
			
			var weatherLayer = new google.maps.weather.WeatherLayer({
				temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
			});
			weatherLayer.setMap(map);

			var cloudLayer = new google.maps.weather.CloudLayer();
			cloudLayer.setMap(map);
			
			directionsDisplay.setPanel(document.getElementById("directionsPanel"));

			google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
			computeTotalDistance(directionsDisplay.directions);
			});

			calcRoute();		
			
			var marker = new google.maps.Marker({
				map: map,
				icon: 'http://www.daftlogic.com/images/cross-hairs.gif',
				shape: crosshairShape
			});
			marker.bindTo('position', map, 'center'); 	  
			
			var infowindow = new google.maps.InfoWindow();
			
			var marker, i;

			for (i = 0; i < locations.length; i++) {  
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(locations[i][1], locations[i][2]),
					map: map
				});

				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						infowindow.setContent(locations[i][0]);
						infowindow.open(map, marker);
					}
				})(marker, i));
			}		
		}		
		google.maps.event.addDomListener(window, 'load', initialize);
		
	