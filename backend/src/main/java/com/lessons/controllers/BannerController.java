package com.lessons.controllers;

import com.lessons.models.AddBannerDTO;
import com.lessons.models.GetBannerDTO;
import com.lessons.services.BannerService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.List;

@Controller
public class BannerController {
    private static final Logger logger = LoggerFactory.getLogger(BannerController.class);


    @Resource
    private BannerService bannerService;


    /**
     * GET /api/banners/list REST call
     *
     * Returns a list of GetBannerDTO objects as JSON
     */
    @RequestMapping(value = "/api/banners/list", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getAllBanners()  {
        logger.debug("getAllBanners() started.");

        // Get all banners in the system
        List<GetBannerDTO> bannerList = this.bannerService.getAllBanners();

        // Return the list of GetBannerDTo objects back to the front-end and a 200 status code
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(bannerList);
    }


    /**
     * POST /api/banners/add REST call
     *
     * Add a new banner to the system
     */
    @RequestMapping(value = "/api/banners/add", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> addBanner(@RequestBody AddBannerDTO aDTO)  {
        logger.debug("addBanner() started.");

        if (StringUtils.isBlank(aDTO.getMessage())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The passed-in message is blank");
        }

        // Get all banners in the system
        this.bannerService.addBanner(aDTO);

        // Return 200 status code
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

}
