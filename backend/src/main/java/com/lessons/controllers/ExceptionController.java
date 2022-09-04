package com.lessons.controllers;

import com.lessons.models.GetExceptionInfoDTO;
import com.lessons.services.ExceptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.List;

@Controller
public class ExceptionController {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionController.class);

    @Resource
    private ExceptionService exceptionService;

    /**
     * GET /api/throw-error
     * @return nothing.  This REST endpoint **SIMULATES** throwing an exception
     */
    @RequestMapping(value = "/api/throw-error", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasAnyRole('READER', 'ADMIN')")
    public ResponseEntity<?> throwFakeException() {

        int bogusNumber = 5;
        if (bogusNumber == 5) {
            throw new RuntimeException("Something bad happened (in this REST call)");
        }

        // This code will never get called
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }


    /**
     * /api/admin/get-exceptions/{filter-number} REST Endpoint
     *
     * @param aFilterNumber holds the filter number
     * @return List of GetExceptionInfoDTO objects
     */
    @RequestMapping(value="/api/admin/get-exceptions/{filterNumber}", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getExceptionList(@PathVariable(name="filterNumber") Integer aFilterNumber) {
        logger.debug("getExceptionList() started");

        // Make sure the filter number falls in the range of 1-5
        if (aFilterNumber < 1 || aFilterNumber > 5) {
            // The number is outside the range
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Filter number was not valid");
        }

        // Get the list of exceptions
        List<GetExceptionInfoDTO> dtoList = exceptionService.getExceptionList(aFilterNumber);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(dtoList);
    }


}
