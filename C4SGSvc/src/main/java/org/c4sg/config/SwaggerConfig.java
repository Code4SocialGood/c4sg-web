package org.c4sg.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.common.base.Predicate;
import com.google.common.base.Predicates;


import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
	
	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.useDefaultResponseMessages(false)
				.apiInfo(apiInfo())
				.select()
				.apis(RequestHandlerSelectors.any())
				.paths(Predicates.not(PathSelectors.regex("/error.*")))
				.build();
	}
	
	private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Code for Social Good Web Application")
                .description("Code for Social Good is a global volunteering platform that provides nonprofit organizations and open source projects with free technical resources.")
                .termsOfServiceUrl("#")
                .contact(new Contact("Code for Social Good", "http://code4socialgood.org/", "info@code4socialgood.org"))
                .license("Licence")
                .licenseUrl("#")
                .version("1.0")
                .build();
    }
	
}
