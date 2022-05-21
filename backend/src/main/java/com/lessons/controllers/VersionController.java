package com.lessons.controllers;

import com.lessons.models.GetVersionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.PostConstruct;
import java.util.Properties;

@Controller
public class VersionController {
    private static final Logger logger = LoggerFactory.getLogger(VersionController.class);

    private GetVersionDTO getVersionDTO;


    /**
     * Initialize the versionDTO object
     *   1) Read the project.properties
     *   2) Pull out the version info
     *   3) Insert the data into the versionDTO object
     *
     * @throws Exception
     */
    @PostConstruct
    public void init() throws Exception{
        // Read the contents of the project.properties file
        final Properties properties = new Properties();
        properties.load(this.getClass().getClassLoader().getResourceAsStream("project.properties"));

        if (properties == null) {
            throw new RuntimeException("Could not find the project.properties file in the build.");
        }

        // Pull values out of the properties object
        String appVersion = properties.getProperty("appVersion");

        // Insert property values into the GetVersionDTO object
        this.getVersionDTO = new GetVersionDTO(appVersion);

        logger.info("App version is {}", this.getVersionDTO.getVersion());
    }



    /**
     * Get current app version
     * GET /api/version
     *
     * @return the GetVersionDTO containing the current application version
     */
    @RequestMapping(value = "/api/version", method= RequestMethod.GET, produces="application/json")
    @PreAuthorize("hasAnyRole('READER', 'ADMIN')")
    public ResponseEntity<?> getVersion() {

        // Return the GetVersionDTO object to the front end
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.getVersionDTO);
    }

}
