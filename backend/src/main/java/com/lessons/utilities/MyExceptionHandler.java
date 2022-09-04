package com.lessons.utilities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.lessons.services.ExceptionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

@ControllerAdvice
public class MyExceptionHandler
{
    private static final Logger logger = LoggerFactory.getLogger(MyExceptionHandler.class);

    @Resource
    private ExceptionService exceptionService;

    @Value("${exception.handler.return_dev_info:false}")
    private boolean showDevelopmentInfo;


    /**
     * Global Exception Handler
     * @param aException holds the exception that was raised (within the Spring Framework)
     * @return ResponseEntity object that is returned to the front-end
     */
    @ExceptionHandler( Exception.class )
    public ResponseEntity<?> handleException(Exception aException)
    {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();

        // Log the error *and* stack trace
        if (null != request) {
            logger.error("Exception raised from call to " + request.getRequestURI(), aException);
        }
        else {
            logger.error("Exception raised from null request.", aException);
        }

        // Return a ResponseEntity with media type as text_plain so that the
        // does not convert this to a JSON map
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        // Save the exception and get the new exception ID  (so we can tell the user)
        Integer newExceptionId = exceptionService.saveException(aException, request.getRequestURI());

        String displayedMessage;
        if (showDevelopmentInfo) {
            // I am in developer mode so send the *real* error message to the front-end

            // Construct the message (to be returned to the frontend)
            displayedMessage = String.format("%s\nRefer to error code %d.", aException.getLocalizedMessage(), newExceptionId);
        }
        else {
            // I am in production mode so send a *generic* error message to the front-end with the new exception ID
            displayedMessage = String.format("An unexpected error occurred.  Refer to error code %d.", newExceptionId);
        }

        // Return the message
        return new ResponseEntity<>(displayedMessage, headers, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}