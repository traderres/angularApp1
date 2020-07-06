package com.lessons.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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

}
