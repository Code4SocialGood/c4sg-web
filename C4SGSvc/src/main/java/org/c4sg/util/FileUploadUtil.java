package org.c4sg.util;

public class FileUploadUtil {

	public static boolean isValidImageFile(String contentType) {
		/*
		 * TODO Is it better to check for all image content types i.e
		 * contentType.startsWith("image/") or just standard
		 * ones(jpeg,png,ico,png)
		 */
		if (!(contentType.equals("image/pjpeg") || contentType.equals("image/jpeg") || contentType.equals("image/png")
				|| contentType.equals("image/gif") || contentType.equals("image/bmp")
				|| contentType.equals("image/x-png") || contentType.equals("type=image/x-icon"))) {
			return false;
		}
		return true;
	}

}
