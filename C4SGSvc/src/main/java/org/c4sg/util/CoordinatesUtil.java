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
import org.springframework.util.StringUtils;
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
	  GeoCode geo = new GeoCode();
	  String address1="";
	  String address2="";
	  String cityName="";
	  String state="";
	  String zip="";
	  String country="";
	  if(!StringUtils.isEmpty(address.getAddress1())){address1=address.getAddress1();}
	  if(!StringUtils.isEmpty(address.getAddress2())){address2=address.getAddress2();}
	  if(!StringUtils.isEmpty(address.getCityName())){cityName=address.getCityName();}
	  if(!StringUtils.isEmpty(address.getState())){state=address.getState();}
	  if(!StringUtils.isEmpty(address.getZip())){zip=address.getZip();}
	  if(!StringUtils.isEmpty(address.getCountry())){country=address.getCountry();}
	  String physicalAddress = address1+","+address2+","+cityName+","+state+","+zip+","+country;
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
}
