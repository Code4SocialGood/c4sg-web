package org.c4sg.logger;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ApplicationLogger {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Pointcut("execution(* org.c4sg.*.*.*(..))")
    public void defineEntryPoint() {
    }
	
	 @Before("defineEntryPoint()")
     public void beforeMethod(JoinPoint joinPoint) {
            logger.info("Before: {}.{}", joinPoint.getTarget().getClass().getSimpleName(), joinPoint.getSignature().getName());
     }
	 
	 @After("defineEntryPoint()")
     public void afterMethod(JoinPoint joinPoint) {
		 logger.info("After: {}.{}", joinPoint.getTarget().getClass().getSimpleName(), joinPoint.getSignature().getName());
     }
	 
	 @AfterThrowing(pointcut="defineEntryPoint()", throwing="exception")
	 public void onThrow(JoinPoint joinPoint, Exception exception){
		 logger.info("Exception occurred while executing: {}.{}", joinPoint.getTarget().getClass().getSimpleName(), joinPoint.getSignature().getName());
		 logger.error(exception.getMessage(), exception);
	 }
}
