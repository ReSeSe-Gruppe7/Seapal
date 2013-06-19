package controllers;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import org.codehaus.jackson.node.ObjectNode;

import play.data.DynamicForm;
import play.db.DB;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.*;
import views.html._include.header;
import views.html._include.navigation;
import views.html._include.navigation_app;

public class Weatherinfo extends Controller {
	  public static Result insert() {
		  
		    DynamicForm data = form().bindFromRequest();
		    Connection conn = DB.getConnection();
				Statement query;            
		    ResultSet result;
		    ObjectNode respJSON = Json.newObject();
		    int nextId = 0;


		    try {
			      query = conn.createStatement();

		        query.execute("INSERT INTO seapal.weatherinfo (windstrength, winddirection, airpressure, temperature, clouds, rain, wavehight, wavedirection) VALUES ("
		                + "'" + data.get("windstrength") + "',"
		                + "'" + data.get("winddirection") + "',"
		                + "'" + data.get("airpressure") + "',"
		                + "'" + data.get("temperature") + "',"
		                + "'" + data.get("clouds") + "',"
		                + "'" + data.get("rain") + "',"
		                + "'" + data.get("wavehight") + "',"
		                + "'" + data.get("wavedirection")+ "');");

		         result = query.executeQuery("SHOW TABLE STATUS FROM seapal LIKE 'weatherinfo'");
		         if (result.next()) {
		             nextId = result.getInt("Auto_increment");
		         }
		         conn.close();

		         respJSON.put("inr", "" + (nextId - 1));

		    } catch (Exception e) {
		        respJSON.put("inr", "Error: " + e);
		    }

		    return ok(respJSON);
		  }
		  
		  public static Result delete(int inr) {

		    Connection conn = DB.getConnection();
				Statement query;            
		    ResultSet result;
		    ObjectNode respJSON = Json.newObject();
		  
		    try {
			      query = conn.createStatement();
		        query.execute("DELETE FROM seapal.weatherinfo WHERE inr = " + inr);

		        conn.close();

		        respJSON.put("inr", "ok");

		    } catch (Exception e) {
		        respJSON.put("inr", "Error: " + e);
		    }
		  
		    return ok(respJSON);
		  }
		  
		  public static Result load(int inr) {
		  
		    Connection conn = DB.getConnection();
				Statement query;
		    ResultSet result;
		    ObjectNode respJSON = Json.newObject();

				if(conn != null)
				{
		        try {
		            	
			          query = conn.createStatement();
		    
			          String sql = "SELECT * FROM seapal.weatherinfo WHERE inr = " + inr;
			        
			          result = query.executeQuery(sql);
		            java.sql.ResultSetMetaData rsmd = result.getMetaData();
		            int numColumns = rsmd.getColumnCount();

		            while (result.next()) {
		                for (int i = 1; i < numColumns + 1; i++) {
		                    String columnName = rsmd.getColumnName(i);
		                    respJSON.put(columnName, result.getString(i));
		                }
		            }
		            conn.close();

		        } catch (Exception e) {
			    	   e.printStackTrace();
		        }
		    }
		    return ok(respJSON);
		  }

		  public static Result index() {
		    Connection conn = DB.getConnection();
				
				String data = "";
		    
				if(conn != null)
				{
		            Statement query;
		            ResultSet result;
		            
		            try {
		            	
			            query = conn.createStatement();
			 
			            String sql = "SELECT * " + "FROM seapal.weatherinfo ";
			        
			            result = query.executeQuery(sql);
			        
			            while (result.next()) {
		              
			        		  StringBuilder row = new StringBuilder();

		                row.append("<tr class='selectable' id='" + result.getString("inr") + "'>");
		                row.append("<td>" + result.getString("windstrength") + "</td>");
		                row.append("<td>" + result.getString("winddirection") + "</td>");
		                row.append("<td>" + result.getString("airpressure") + "</td>");
		                row.append("<td>" + result.getString("temperature") + "</td>");
		                row.append("<td>" + result.getString("wavehight") + "</td>");
		                row.append("<td>" + result.getString("wavedirection") + "</td>");
		                row.append("<td style='width:30px; text-align:left;'><div class='btn-group'>");
		                row.append("<a class='btn btn-small view' id='" + result.getString("inr")
		                  + "'><span><i class='icon-eye-open'></i></span></a>");
		                row.append("<a class='btn btn-small remove' id='" + result.getString("inr")
		                  + "'><span><i class='icon-remove'></i></span></a>");
		                row.append("<a class='btn btn-small redirect' id='" + result.getString("inr")
		                  + "' href='app_tripinfo.html?inr=" + result.getString("inr")
		                  + "'><span><i class='icon-chevron-right'></i></span></a>");
		                row.append("</div></td>");
		                row.append("</tr>");
		            
				            data += row.toString();
					    }
		               
			       } catch (Exception e) {
			    	   e.printStackTrace();
			       }
		    }
				
		    return ok(weatherinfo.render(header.render(), navigation.render("app_map"), navigation_app.render("app_weatherinfo"), data));
		  }
}
