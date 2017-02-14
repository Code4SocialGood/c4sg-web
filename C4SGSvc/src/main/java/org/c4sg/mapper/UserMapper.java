package org.c4sg.mapper;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Component;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.PrecisionModel;
import com.vividsolutions.jts.io.WKTReader;



@Component
public class UserMapper extends ModelMapper {
	
	UserMapper() {
	}
	
	/**
	 * Map user entity into data transfer object
	 * 
	 * @param user User Entity
	 * @return UserDto
	 */
	public UserDto getUserDtoFromEntity(User user){	
		//convert geometry object to a point
		Geometry g = null;
		com.vividsolutions.jts.geom.Point point = null;		
		WKTReader reader = new WKTReader();
		try {
			g = reader.read(user.getLocation().toText());
			point = (com.vividsolutions.jts.geom.Point) g;
		}
		catch (Exception e) {
			//do nothing
		}
		//start mapping data into the dto
		UserDto userDto = map(user, UserDto.class);
		//add mapping for location if point object is not null
		if (point != null) {
			org.springframework.data.geo.Point gp = new Point(point.getX(), point.getY());
			userDto.setLongitude(Double.toString(point.getX()));
			userDto.setLatitude(Double.toString(point.getY()));
		}
		userDto.setDisplayFlag((user.getDisplayFlag() != null && user.getDisplayFlag().booleanValue()) ? "Y" : "N"); 
		return userDto;
	}
	
	/**
	 * Map user data transfer object into user entity
	 * 
	 * @param userDto User Data Transfer object
	 * @return User
	 */	
	public User getUserEntityFromDto(UserDto userDto){		
		User user = map(userDto, User.class);
		
		if (userDto.getLatitude() != null && userDto.getLongitude() != null){
			GeometryFactory gf = new GeometryFactory(new PrecisionModel(PrecisionModel.FLOATING));
			Coordinate coordinate = new Coordinate(Double.parseDouble(userDto.getLongitude()), 
					Double.parseDouble(userDto.getLatitude()));
			com.vividsolutions.jts.geom.Point point = gf.createPoint(coordinate);	
			user.setLocation(point);			
		}
		user.setDisplayFlag(Boolean.valueOf(userDto.getDisplayFlag()));
		return user;
	}	
}