package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.weathermap;
import views.html._include.footer;
import views.html._include.header;
import views.html._include.header_app;
import views.html._include.navigation;
import views.html._include.navigation_app;

public class Weathermap extends Controller {
  
  public static Result index() {
	
	 return ok(weathermap.render(header.render(),header_app.render(),navigation.render("app_map"), navigation_app.render("app_weathermap")));
    
  } 
}