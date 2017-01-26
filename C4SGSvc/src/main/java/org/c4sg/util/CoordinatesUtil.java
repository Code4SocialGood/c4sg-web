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



public class CoordinatesUtil {
	
		//String Google map Constants
		public static final String GMAPADDRESS = "http://maps.googleapis.com/maps/api/geocode/xml?address=";
	    public static final String UTF =  "UTF-8";
		public static final String SENSOR = "&sensor=true";
		public static final String STATUS = "/GeocodeResponse/status";
		public static final String LATITUDE = "//geometry/location/lat";
		public static final String LONGITUDE = "//geometry/location/lng";

		
	
	/* *This method returns Geocode coordinates of the Address object.
	 * Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway,
	 *  Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739).
	 *  Please give all the physical Address values for a precise coordinate. 
	 * */
	public static GeoCode getCoordinates(Address address) throws Exception
	  {
		
		GeoCode geo = new GeoCode();
		String physicalAddress = new StringBuffer()
				                 .append(address.getDoorNo())
				                 .append(address.getStreetName())
				                 .append(address.getCityName())
				                 .append(address.getState())
				                 .append(address.getCountry())
				                 .append(address.getZip()).toString();
	    String api = GMAPADDRESS + URLEncoder.encode(physicalAddress, "UTF-8") + SENSOR;
	    URL url = new URL(api);
	    HttpURLConnection httpConnection = (HttpURLConnection)url.openConnection();
	    httpConnection.connect();
	    int responseCode = httpConnection.getResponseCode();
	    
	    if(responseCode == 200)
	    {
	      DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();;
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
}
