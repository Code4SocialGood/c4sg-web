package org.c4sg.util;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;

public abstract class CoordinatesUtil {
	//String Google map Constants
	public static final String GMAPADDRESS = "http://maps.googleapis.com/maps/api/geocode/xml?address=";
	public static final String UTF =  "UTF-8";
	public static final String SENSOR = "&sensor=true";
	public static final String STATUS = "/GeocodeResponse/status";
	public static final String LATITUDE = "//geometry/location/lat";
	public static final String LONGITUDE = "//geometry/location/lng";
	
	/**@param{Object} Address- The physical address of a location
	  * This method returns Geocode coordinates of the Address object.Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway,
	  * Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739).Please give all the physical Address values 
	  * for a precise coordinate. setting none of the values will give a null value for the Latitude and Longitude. 
	  */ 
	public static GeoCode getCoordinates(Address address) throws Exception
	 {
	  GeoCode geo= new GeoCode();
	  String physicalAddress = (address.getAddress1() == null ? "" : address.getAddress1() + ",")
			  + (address.getAddress2() == null ? "" : address.getAddress2() + ",")
			  + (address.getCityName() == null ? "" : address.getCityName() + ",")
			  + (address.getState()    == null ? "" : address.getState() + "-")
			  + (address.getZip()      == null ? "" : address.getZip() + ",")
			  + (address.getCountry()  == null ? "" :  address.getCountry());
	  String api = GMAPADDRESS + URLEncoder.encode(physicalAddress, "UTF-8") + SENSOR;
	  URL url = new URL(api);
	  HttpURLConnection httpConnection = (HttpURLConnection)url.openConnection();
	  httpConnection.connect();
	  int responseCode = httpConnection.getResponseCode();
	  if(responseCode == 200)
	   {
	    DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
	    Document document = builder.parse(httpConnection.getInputStream());
	    XPathFactory xPathfactory = XPathFactory.newInstance();
	    XPath xpath = xPathfactory.newXPath();
	    XPathExpression expr = xpath.compile(STATUS);
	    String status = (String)expr.evaluate(document, XPathConstants.STRING);
	    if(status.equals("OK"))
	     {
	       expr = xpath.compile(LATITUDE);
	       String latitude = (String)expr.evaluate(document, XPathConstants.STRING);
           expr = xpath.compile(LONGITUDE);
	       String longitude = (String)expr.evaluate(document, XPathConstants.STRING);
	       geo.setLatitude(latitude);
	       geo.setLongitude(longitude);
	     }
	    }
	    else
	    {
	    	throw new Exception("Fail to Convert to Geocode");
	    }
		return geo;
	  }
	//GeoCode Coordinates
	static class GeoCode {
		private String latitude;
		private String longitude;
		public String getLatitude() {
			return latitude;
		}
		public void setLatitude(String latitude) {
			this.latitude = latitude;
		}
		public String getLongitude() {
			return longitude;
		}
		public void setLongitude(String longitude) {
			this.longitude = longitude;
		}
	}
	//Address values
	static class Address {
		private String address1;
		private String address2;
		private String cityName;
		private String state;
		private String zip;
		private String country;
		public String getAddress1() {
			return address1;
		}
		public void setAddress1(String address1) {
			this.address1 = address1;
		}
		public String getAddress2() {
			return address2;
		}
		public void setAddress2(String address2) {
			this.address2 = address2;
		}
		public String getCountry() {
			return country;
		}
		public void setCountry(String country) {
			this.country = country;
		}
			public String getCityName() {
			return cityName;
		}
		public void setCityName(String cityName) {
			this.cityName = cityName;
		}
		public String getState() {
			return state;
		}
		public void setState(String state) {
			this.state = state;
		}
		public String getZip() {
			return zip;
		}
		public void setZip(String zip) {
			this.zip = zip;
		}
	}
}

