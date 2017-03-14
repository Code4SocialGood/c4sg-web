package org.c4sg.mapper;

import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Component;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.PrecisionModel;
import com.vividsolutions.jts.io.WKTReader;

import java.lang.reflect.Type;
import java.util.List;


@Component
public class UserMapper extends ModelMapper {
	
	UserMapper() {
	}
	
	/**
	 * Map user entity into data transfer object
	 * 
	 * @param user User Entity
	 * @return UserDTO
	 */
	public UserDTO getUserDtoFromEntity(User user){
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
		if (user == null)
			return null;
		
		UserDTO userDTO = map(user, UserDTO.class);
		//add mapping for location if point object is not null
		if (point != null) {
			org.springframework.data.geo.Point gp = new Point(point.getX(), point.getY());
			userDTO.setLongitude(Double.toString(point.getX()));
			userDTO.setLatitude(Double.toString(point.getY()));
		}
		userDTO.setDisplayFlag((user.getDisplayFlag() != null && user.getDisplayFlag().booleanValue()) ? "Y" : "N");
		return userDTO;
	}
	
	/**
	 * Map user data transfer object into user entity
	 * 
	 * @param userDTO User Data Transfer object
	 * @return User
	 */	
	public User getUserEntityFromDto(UserDTO userDTO){
		User user = map(userDTO, User.class);
		
		if (userDTO.getLatitude() != null && userDTO.getLongitude() != null){
			GeometryFactory gf = new GeometryFactory(new PrecisionModel(PrecisionModel.FLOATING));
			Coordinate coordinate = new Coordinate(Double.parseDouble(userDTO.getLongitude()),
					Double.parseDouble(userDTO.getLatitude()));
			com.vividsolutions.jts.geom.Point point = gf.createPoint(coordinate);	
			user.setLocation(point);			
		}
		user.setDisplayFlag(Boolean.valueOf(userDTO.getDisplayFlag()));
		return user;
	}

	public List<UserDTO> getDtosFromEntities(List<User> projects){
		Type listTypeDTO = new TypeToken<List<UserDTO>>() {}.getType();
		return map(projects, listTypeDTO);
	}
}