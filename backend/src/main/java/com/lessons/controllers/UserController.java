package com.lessons.controllers;

import com.lessons.models.GetUserInfoDTO;
import com.lessons.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.Map;

@Controller("com.lessons.controllers.UserController")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Resource
    private UserService userService;

    /**
     * GET /api/users/me REST endpoint that returns information about the user
     */
    @RequestMapping(value = "/api/users/me", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getUserInfo() {

        // Get the user's logged-in name
        String loggedInUsername = userService.getLoggedInUserName();

        // Get the user's access map
        Map<String, Boolean> accessMap = userService.getAccessMapForUser();

        // Create the GetUserInfoDTO object
        GetUserInfoDTO dto = new GetUserInfoDTO(loggedInUsername, accessMap);

        // Return a response of 200 and the DTO object with information
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }
}
