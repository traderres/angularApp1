package com.lessons.services;

import com.lessons.security.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("com.lessons.services.UserService")
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserInfo getUserInfo() {
        // Get the UserInfo object from Spring Security
        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (securityContext == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  SecurityContext is null.  This should never happen.");
        }

        Authentication auth = securityContext.getAuthentication();
        if (auth == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  Authentication is null.  This should never happen.");
        }

        UserInfo userInfo = (UserInfo) auth.getPrincipal();
        if (userInfo == null) {
            throw new RuntimeException("Error in getUserInfoFromSecurity():  UserInfo is null.  This should never happen.");
        }

        return userInfo;
    }


    public String getLoggedInUserName() {
        UserInfo userinfo = getUserInfo();

        return userinfo.getUsername();
    }


    public Integer getLoggedInUserId() {
        UserInfo userInfo = getUserInfo();
        return userInfo.getId();
    }
}
