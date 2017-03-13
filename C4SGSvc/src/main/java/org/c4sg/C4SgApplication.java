package org.c4sg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class C4SgApplication {
	public static void main(String[] args) {
		SpringApplication.run(C4SgApplication.class, args);
	}
}
