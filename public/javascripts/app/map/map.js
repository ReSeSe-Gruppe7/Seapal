$(document).ready(function() {
	//initialize(false);
	$("#accordion").accordion({
		heightStyle : "fill",
		collapsible : true,
	});

});
$(function() {
	$("#accordion-resizer").resizable({
		minHeight : 140,
		minWidth : 200,
		resize : function() {
			$("#accordion").accordion("refresh");
		}
	});
});

var map = null;

var overlay = new google.maps.OverlayView();

var MODE = {
	DEFAULT : {
		value : 0,
		name : "default"
	},
	ROUTE : {
		value : 1,
		name : "route"
	},
	DISTANCE : {
		value : 2,
		name : "distance"
	},
	NAVIGATION : {
		value : 3,
		name : "navigation"
	}
};
var currentMode = MODE.DEFAULT;

var currentPositionMarker = null;
var followCurrentPosition = false;
var noToggleOfFollowCurrentPositionButton = false;

var temporaryMarker = null;
var temporaryMarkerInfobox = null;
var temporaryMarkerTimeout = null;

var fixedMarker = null;
var fixedMarkerInfoBox = null;
var fixedMarkerCount = 0;
var fixedMarkerArray = new Array();

var selectedMarker = null;

var currentPositionMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/boat.png', new google.maps.Size(50, 50), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(25, 40) // offset point
);

var temporaryMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/cross_hair.png', new google.maps.Size(43, 43), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(22, 22) // offset point
);

var fixedMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/flag6.png', new google.maps.Size(40, 40), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(9, 32) // offset point
);

var routeMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/flag4.png', new google.maps.Size(40, 40), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(7, 34) // offset point
);

var distanceMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/flag5.png', new google.maps.Size(40, 40), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(7, 34) // offset point
);

var destinationMarkerImage = new google.maps.MarkerImage(
		'/assets/images/icons/destination.png', new google.maps.Size(28, 31), // size
		new google.maps.Point(0, 0), // origin point
		new google.maps.Point(7, 9) // offset point
);
function MarkerWithInfobox(marker, infobox, counter) {
	this.reference = marker;
	this.infobox = infobox;
	this.counter = counter;
}

// initialize map and all event listeners
function initialize() {

	// set different map types
	var mapTypeIds = [ "roadmap", "satellite", "OSM" ];
	var crosshairShape = {
		coords : [ 0, 0, 0, 0 ],
		type : 'rect'
	};

	// set map Options
	var mapOptions = {
		center : new google.maps.LatLng(47.65521295468833, 9.2010498046875),
		zoom : 14,
		zoomControl : true,
		panControl : true,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		draggableCursor : 'crosshair',
		mapTypeControlOptions : {
			style : google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			mapTypeIds : mapTypeIds
		},
		disableDefaultUI : true,
		mapTypeControl : true
	};

	// set route menu position
	document.getElementById('followCurrentPositionContainer').style.width = document.body.offsetWidth
			+ "px";
	document.getElementById('routeMenuContainer').style.width = document.body.offsetWidth
			+ "px";
	document.getElementById('routeMenuContainer').style.display = "none";
	document.getElementById('distanceToolContainer').style.width = document.body.offsetWidth
			+ "px";
	document.getElementById('distanceToolContainer').style.display = "none";
	document.getElementById('navigationContainer').style.width = document.body.offsetWidth
			+ "px";
	document.getElementById('navigationContainer').style.display = "none";
	document.getElementById('chat').style.display = "none";

	// initialize map
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	map.mapTypes.set("OSM", new google.maps.ImageMapType({
		getTileUrl : function(coord, zoom) {
			return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x
					+ "/" + coord.y + ".png";
		},
		tileSize : new google.maps.Size(256, 256),
		name : "OpenStreetMap",
		maxZoom : 18
	}));
	var marker = new google.maps.Marker({
		map : map,
		icon : 'http://www.daftlogic.com/images/cross-hairs.gif',
		shape : crosshairShape
	});

	marker.bindTo('position', map, 'center');
	var weatherLayer = new google.maps.weather.WeatherLayer({
		temperatureUnits : google.maps.weather.TemperatureUnit.CELSIUS
	});
	weatherLayer.setMap(map);

	var cloudLayer = new google.maps.weather.CloudLayer();
	cloudLayer.setMap(map);

	// set client position
	currentPosition = new google.maps.LatLng(47.65521295468833, 9.2010498046875)

	var currentMarkerOptions = {
		position : currentPosition,
		map : map,
		icon : currentPositionMarkerImage
	}

	// get JSON forcast Object
	getWeatherInfofromPosition(map.getCenter().toUrlValue());

	google.maps.event.addListener(map, 'center_changed', function() {
		getWeatherInfofromPosition(map.getCenter().toUrlValue());
	});

	// initialize marker for current position
	currentPositionMarker = new google.maps.Marker(currentMarkerOptions);

	// set map types
	google.maps.event.addListener(currentPositionMarker, 'position_changed',
			function() {
				// Send Position to OpenSeemapApi
				if (followCurrentPosition) {
					map.setCenter(currentPositionMarker.getPosition());

				}
				if (currentMode == MODE.NAVIGATION) {
					updateNavigation(currentPositionMarker.position,
							destinationMarker.position);
				}
			});

	map.overlayMapTypes.push(new google.maps.ImageMapType({
		getTileUrl : function(coord, zoom) {
			return "http://tiles.openseamap.org/seamark/" + zoom + "/"
					+ coord.x + "/" + coord.y + ".png";
		},
		tileSize : new google.maps.Size(256, 256),
		name : "OpenSeaMap",
		maxZoom : 18
	}));


	// add rain map ------------------//
	

		map.overlayMapTypes.push(new google.maps.ImageMapType({
			getTileUrl : function(coord, zoom) {
				return "http://tile.openweathermap.org/map/precipitation/"
						+ zoom + "/" + coord.x + "/" + coord.y + ".png";
			},
			tileSize : new google.maps.Size(256, 256),
			name : "OpenWeatherMap",
			maxZoom : 12,
			opacity : .5
		}));


	overlay.draw = function() {
	};
	overlay.setMap(map);

	// click on map
	google.maps.event.addListener(map, 'click', function(event) {

		// handler for default mode
		if (currentMode == MODE.DEFAULT) {
			setTemporaryMarker(event.latLng);
		} else if (currentMode == MODE.ROUTE || currentMode == MODE.DISTANCE) {
			addRouteMarker(event.latLng);
		}
	});

	google.maps.event.addListener(map, 'center_changed', function() {
		if (followCurrentPosition && !noToggleOfFollowCurrentPositionButton) {
			toggleFollowCurrentPosition();
		} else {
			noToggleOfFollowCurrentPositionButton = false;
		}
	});
	google.maps.event.addListener(map, 'dragend', function() {
		console.log("Position geändert. Wird ein neues Diagramm gezeichnet.");
		drawDia(map);
	});

	google.maps.event.addListener(map,'zoom_changed',function() {
						console.log("Zoom-position geändert. Wird ein neues Diagramm gezeichnet.");

						drawDia(map);
					});
	drawDia(map);
}

function drawDia(map) {
	var curd = new Date();
	var d = new Date(curd.getFullYear(), curd.getMonth(), curd.getDate());
	var s = Math.round((d.getTime()) / 1000) - 3600 * 24 * 1;
	var lat = map.getCenter().lat();
	var lng = map.getCenter().lng();
	// console.log(s);
	var jsonurl = "http://openweathermap.org/data/2.5/forecast?lat=" + lat
			+ "&lon=" + lng + "&cnt=10&start=" + s;

	getWeather(jsonurl, function(JSONobject) {

		console.log(JSONobject);
		data = JSONobject.list;

		// showSimpleChart('chart-simple', data);

		showBarsDouble('chart4', data);
		// showTempMinMax('chart2', data);
		// showIconsChart('chart3', data);

		// showTemp('chart5', data);
		// showWind('chart6', data);

		// chartSpeed('chart3', data);
		showPolarSpeed('chart-wind', data);
		// showPolar('chart-wind', data);
		// chartDoublePress('chart-wind', data);
	});
	jsonurl = "http://openweathermap.org/data/2.5/forecast/daily?lat=" + lat
			+ "&lon=" + lng + "&cnt=10&start=" + s;
	getWeather(jsonurl, function(JSONobject) {
		data = JSONobject.list;
		showHourlyForecastChart('chart_small', data);
	});

}
// weather functions ---------------------------------------------------------
// //

var time_zone = 1000 * (new Date().getTimezoneOffset()) * (-60);

// jsonp script-teil aufgebaut und den serverseite vertraut
function getWeather(weather, callback) {
	// var weather =
	// "http://openweathermap.org/data/2.5/forecast?lat=47.65521295468833&lon=9.2010498046875&cnt=10";
	$.ajax({
		dataType : "jsonp",
		url : weather,
		success : callback
	});
}


// show Diagramm --------------//
function showHourlyForecastChart(chartName, forecast) {

	var curdate = new Date((new Date()).getTime() - 180 * 60 * 1000);

	var cnt = 0;

	var time = new Array();
	var tmp = new Array();
	var wind = new Array();
	var prcp = new Array();

	for ( var i = 0; i < forecast.length; i++) {

		var dt = new Date(forecast[i].dt * 1000);

		if (curdate > dt)
			continue;
		if (cnt > 10)
			break;
		cnt++;

		/*
		 /tmp.push( Math.round(10*(forecast[i].temp.morn-273.15))/10  );
		var mornTime=new Date( forecast[i].dt * 1000 + time_zone);
		mornTime.setHours(9+time_zone);
		time.push(  mornTime);
		 */
		tmp.push(Math.round(10 * (forecast[i].temp.day - 273.15)) / 10);
		time.push(new Date(forecast[i].dt * 1000 + time_zone));
		wind.push(forecast[i].speed);

		var p = 0;
		if (forecast[i]['rain'] && forecast[i]['rain'])
			p += forecast[i]['rain'];
		if (forecast[i]['snow'] && forecast[i]['snow'])
			p += forecast[i]['snow'];
		prcp.push(Math.round(p * 10) / 10);
	}

	$('#chart_small').highcharts(
			{
				chart : {
					zoomType : 'xy'
				},
				 title: {
				        text: 'Temperature and Rain variation by days'
				    },

				xAxis : {
					categories : time,
					type : 'datetime',
					labels : {
						formatter : function() {
							return Highcharts.dateFormat('%H:%M', this.value);
						}
					}
				},
				yAxis : [ {
					labels : {
						format : '{value}°C',
						style : {
							color : 'blue'
						}
					},
					opposite : true,
					title : NaN
				}, {
					labels : {
						format : '{value}mm',
						style : {
							color : '#4572A7'
						}
					},
					opposite : true,
					title : NaN
				} ],
				tooltip : {
					useHTML : true,
					shared : true,
					formatter : function() {
						var s = '<small>'
								+ Highcharts.dateFormat('%d %b. %H:%M', this.x)
								+ '</small><table>';
						$.each(this.points, function(i, point) {
							s += '<tr><td style="color:' + point.series.color
									+ '">' + point.series.name + ': </td>'
									+ '<td style="text-align: right"><b>'
									+ point.y + '</b></td></tr>';
						});
						return s + '</table>';
					}
				},
				legend : {
					layout : 'vertical',
					align : 'left',
					x : 410,
					verticalAlign : 'top',
					y : 0,
					floating : true,
					backgroundColor : '#FFFFFF'
				},
				series : [ {
					name : 'Precipitation',
					type : 'column',
					color : '#A0A0A0',
					yAxis : 1,
					data : prcp
				}, {
					name : 'Temperature',
					type : 'spline',
					color : 'blue',
					data : tmp
				} ]
			});

};


// temporary marker context menu ----------------------------------------- //
$(function() {
	$.contextMenu({
		selector : '#temporaryMarkerContextMenu',
		events : {
			hide : function() {
				startTimeout();
			}
		},
		callback : function(key, options) {

			if (key == "marker") {
				setFixedMarker(temporaryMarker.position)
			} else if (key == "startroute") {
				startNewRoute(temporaryMarker.position, false);
			} else if (key == "distance") {
				startNewRoute(temporaryMarker.position, true);
			} else if (key == "destination") {
				startNewNavigation(currentPositionMarker.position,
						temporaryMarker.position);
			} else if (key == "delete") {
				temporaryMarker.setMap(null);
				temporaryMarkerInfobox.setMap(null);
			}
		},
		items : {
			"marker" : {
				name : "Markierung setzen",
				icon : "marker"
			},
			"startroute" : {
				name : "Neue Route setzen",
				icon : "startroute"
			},
			"distance" : {
				name : "Distanz messen",
				icon : "distance"
			},
			"destination" : {
				name : "Zum Ziel machen",
				icon : "destination"
			},
			"sep1" : "---------",
			"delete" : {
				name : "L&ouml;schen",
				icon : "delete"
			}
		}
	});
});

// fixed marker context menu ------------------------------------------------ //
$(function() {
	$.contextMenu({
		selector : '#fixedMarkerContextMenu',
		callback : function(key, options) {
			if (key == "destination") {

				startNewNavigation(currentPositionMarker.position,
						selectedMarker.reference.position);

			} else if (key == "delete") {
				selectedMarker.reference.setMap(null);
				selectedMarker.infobox.setMap(null);
				fixedMarkerArray.splice(fixedMarkerArray
						.indexOf(selectedMarker), 1);
			}
		},
		items : {
			"destination" : {
				name : "Zum Ziel machen",
				icon : "destination"
			},
			"sep1" : "---------",
			"delete" : {
				name : "L&ouml;schen",
				icon : "delete"
			}
		}
	});
});

// helper functions --------------------------------------------------------- //

// start marker timout
function startTimeout() {

	temporaryMarkerTimeout = setTimeout(function() {
		temporaryMarker.setMap(null);
		temporaryMarkerInfobox.setMap(null);
	}, 5000);
}

// stop marker timout
function stopTimeout() {
	clearTimeout(temporaryMarkerTimeout);
}

// draw temporaryMarkerInfobox
function drawTemporaryMarkerInfobox(latLng) {
	customTxt = "<div class='markerInfoBox well' id='temporaryMarkerInfobox'>"
			+ formatCoordinate(latLng.lat(), "lat")
			+ " "
			+ formatCoordinate(latLng.lng(), "long")
			+ "</br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspDTM "
			+ getDistance(latLng, currentPositionMarker.position) + "m</div>";
	// return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map,
	// -110, -60);
	// $('body').append("<span>" + latLng.lat() + " " + latLng.lng() +
	// "</span><br>");
	return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map, -113,
			-92);
}

// draw fixedMarkerInfobox
function drawFixedMarkerInfobox(latLng, counter) {

	customTxt = "<div class='markerInfoBox label' id='fixedMarkerInfobox'>"
			+ "Markierung " + (counter) + "</div>";
	return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map, 40,
			-29);
}

function getMarkerWithInfobox(event) {

	for ( var i = 0; i < fixedMarkerArray.length; i++) {
		if (fixedMarkerArray[i].reference.position == event.latLng) {
			return fixedMarkerArray[i];
		}
	}
	return null;
}

function setTemporaryMarker(position) {

	var temporaryMarkerOptions = {
		position : position,
		map : map,
		icon : temporaryMarkerImage,
		draggable : true
	}

	// delete temp marker & infobox
	if (temporaryMarker != null) {
		temporaryMarker.setMap(null);
	}
	if (temporaryMarkerInfobox != null) {
		temporaryMarkerInfobox.setMap(null);
	}

	stopTimeout();
	temporaryMarker = new google.maps.Marker(temporaryMarkerOptions);

	// click on marker
	google.maps.event.addListener(temporaryMarker, 'click', function(event) {
		var pixel = fromLatLngToPixel(event.latLng);

		if (currentMode == MODE.DEFAULT) {
			$('#temporaryMarkerContextMenu').contextMenu({
				x : pixel.x,
				y : pixel.y
			});
		}

		stopTimeout();
	});

	// marker is dragged
	google.maps.event.addListener(temporaryMarker, 'drag', function(event) {
		temporaryMarkerInfobox.setMap(null);
		temporaryMarkerInfobox = drawTemporaryMarkerInfobox(event.latLng);
	});

	// marker drag start
	google.maps.event.addListener(temporaryMarker, 'dragstart',
			function(event) {
				stopTimeout();
			});

	// marker drag end
	google.maps.event.addListener(temporaryMarker, 'dragend', function(event) {
		startTimeout();
	});

	startTimeout();
	temporaryMarkerInfobox = drawTemporaryMarkerInfobox(position);
}

function setFixedMarker(position) {

	temporaryMarker.setMap(null);
	temporaryMarkerInfobox.setMap(null);
	stopTimeout();

	fixedMarkerCount++;
	var fixedMarkerOptions = {
		position : position,
		map : map,
		title : 'Markierung ' + fixedMarkerCount,
		icon : fixedMarkerImage,
		draggable : true
	}

	fixedMarker = new google.maps.Marker(fixedMarkerOptions);

	// click on fixed marker
	google.maps.event.addListener(fixedMarker, 'click', function(event) {
		selectedMarker = getMarkerWithInfobox(event);
		var pixel = fromLatLngToPixel(event.latLng);

		if (currentMode != MODE.NAVIGATION) {
			$('#fixedMarkerContextMenu').contextMenu({
				x : pixel.x,
				y : pixel.y
			});
		}
	});

	// marker is dragged
	google.maps.event.addListener(fixedMarker, 'drag', function(event) {
		selectedMarker = getMarkerWithInfobox(event);
		selectedMarker.infobox.setMap(null);
		selectedMarker.infobox = drawFixedMarkerInfobox(event.latLng,
				selectedMarker.counter);
	});

	fixedMarker.setMap(map);
	fixedMarkerInfoBox = drawFixedMarkerInfobox(temporaryMarker.position,
			fixedMarkerCount);
	fixedMarkerArray.push(new MarkerWithInfobox(fixedMarker,
			fixedMarkerInfoBox, fixedMarkerCount));
}

function getDistance(coord1, coord2) {
	return Math.round(google.maps.geometry.spherical.computeDistanceBetween(
			coord1, coord2));
}

function fromLatLngToPixel(latLng) {

	var pixel = overlay.getProjection().fromLatLngToContainerPixel(latLng);
	pixel.x += document.getElementById('map_canvas').offsetLeft;
	pixel.y += document.getElementById('map_canvas').offsetTop;
	return pixel;
}

function toggleFollowCurrentPosition() {
	followCurrentPosition = !followCurrentPosition;
	if (followCurrentPosition) {
		document.getElementById("followCurrentPositionbutton").value = "Eigener Position nicht mehr folgen";
		noToggleOfFollowCurrentPositionButton = true;
		map.setCenter(currentPositionMarker.getPosition());
	} else {
		document.getElementById("followCurrentPositionbutton").value = "Eigener Position folgen";
	}
	document.getElementById('followCurrentPositionContainer').style.width = document.body.offsetWidth
			+ "px";
}

// ---------- //

function toggleFollowCurrentPosition() {
	followCurrentPosition = !followCurrentPosition;
	if (followCurrentPosition) {
		document.getElementById("followCurrentPositionbutton").value = "Eigener Position nicht mehr folgen";
		noToggleOfFollowCurrentPositionButton = true;
		map.setCenter(currentPositionMarker.getPosition());
	} else {
		document.getElementById("followCurrentPositionbutton").value = "Eigener Position folgen";
	}
	document.getElementById('followCurrentPositionContainer').style.width = document.body.offsetWidth
			+ "px";
}
function getWeatherInfofromPosition(position) {
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="
			+ position.split(",")[0] + "&lon=" + position.split(",")[1]
			+ "&cnt=4&mode=json";
	$.ajax({
		url : url,
		type : 'POST',
		contentType : "application/json",
		dataType : 'jsonp',
		success : function(json) {
			getInfofromJSON(json);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$("#floatingResultContainer").append(
					"XMLHttpRequest: " + XMLHttpRequest + "</br>"
							+ "</br> textStatus: " + textStatus
							+ "</br> errorThrown: " + errorThrown);
		}
	});
}


function getInfofromJSON(json) {
	$("#cityName").html(json.city.name);
	$("#cityCountry").html(json.city.country);
	$("#citylon").html(json.city.coord.lon);
	$("#citylat").html(json.city.coord.lat);
	$.each(json.list, function(i, el) {
		$("#img" + i).attr(
				"src",
				"/assets/images/WeatherIcons/" + $(this)[0].weather[0].icon
						+ ".png");
		$("#desc" + i).html($(this)[0].weather[0].description);
		var temday = parseInt($(this)[0].temp.day) - 272.15;
		$("#tempday" + i).html(temday.toPrecision(2));
		var temday1 = parseInt($(this)[0].temp.night) - 272.15;
		$("#tempnight" + i).html(temday1.toPrecision(2));
		$("#humidity" + i).html($(this)[0].humidity);
		$("#pressure" + i).html($(this)[0].pressure);
		$("#speed" + i).html($(this)[0].speed);
	});
}