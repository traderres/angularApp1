package com.lessons.services;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyService  {
    private static final Logger logger = LoggerFactory.getLogger(MyService.class);

    /**
     * MyService constructor is here
     */
    public MyService() {
        logger.debug("Constructor started.");
    }


    /**
     * @return the total number of users in the system
     */
    public int getTotalUsers() {
        return 5;
    }
}
