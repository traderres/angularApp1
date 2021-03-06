package com.lessons.controllers;

import com.lessons.Application;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class HomeController {
    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);


    /**
     * This page endpoint is needed to ensure that all page routes to the Angular Frontend
     *
     * NOTE:  If the user is going to /app1/page/view/reports, then
     *         1. Spring will redirect the user to the /index.html
     *         2. Angular routes will redirect the user to the route for view/reports
     * @return String leading users to the index.html main page
     */
    @RequestMapping(value = {"/", "/page/**"}, method = RequestMethod.GET)
    public String home() {

        // This method handles two cases:
        // Case 1: The user goes to http://localhost:8080/app1  --> Take users to the index.html
        // Case 2: The user goes to http://localhost:8080/app1/page/addReport and presses refresh --> Take users to the index.html
        return "forward:/index.html";
    }

    @RequestMapping(value = "/api/time", method=RequestMethod.GET)
    @PreAuthorize("hasRole('ROLE_SUPERUSER')")
    public ResponseEntity<?> getDateTime() {
        logger.debug("getDateTime() started.");

        DateFormat dateFormat = new SimpleDateFormat("yyyy/mm/dd HH:mm:ss");
        Date date = new Date();
        String formattedDateTime = dateFormat.format(date);

        // Return the date/time string as plain text
        return ResponseEntity
                    .status(HttpStatus.OK)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(formattedDateTime);
    }


    @RequestMapping(value = "/api/time2", method=RequestMethod.GET)
    @PreAuthorize("hasRole('ROLE_AMAZING_USER')")
    public ResponseEntity<?> getDateTime2() {
        logger.debug("getDateTime() started.");

        DateFormat dateFormat = new SimpleDateFormat("yyyy/mm/dd HH:mm:ss");
        Date date = new Date();
        String formattedDateTime = dateFormat.format(date);

        // Return the date/time string as plain text
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(formattedDateTime);
    }


    /*
     * GET /api/help
     * Allow users to download an internally-stored help.pdf file
     */
    @RequestMapping(value = "/api/help", method = RequestMethod.GET)
    public  ResponseEntity<?>  downloadHelpFile() {
        logger.debug("downloadHelpFile started.");

        // Read the /src/main/resources/help.pdf as an inputStream
        InputStream inputStream =  Application.class.getResourceAsStream("/help.pdf");

        // Convert the InputStream into an InputStreamResource
        InputStreamResource inputStreamResource = new InputStreamResource(inputStream);

        // Create an HttpHeaders object  (this holds your list of headers)
        HttpHeaders headers = new HttpHeaders();

        // Set a header with the default name to save this file as
        // -- So, the browser will do a Save As….
        headers.setContentDispositionFormData("attachment", "help.pdf");

        // Return the inputStreamResource back
        return new ResponseEntity<InputStreamResource>(inputStreamResource, headers, HttpStatus.OK);
    }




}
