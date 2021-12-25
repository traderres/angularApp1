package com.lessons.controllers;

import com.lessons.models.grid.GridGetRowsRequestDTO;
import com.lessons.models.grid.GridGetRowsResponseDTO;
import com.lessons.services.GridService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

@Controller
public class GridController {
    private static final Logger logger = LoggerFactory.getLogger(GridController.class);

    @Resource
    private GridService gridService;


    /**
     * The AG-Grid calls this REST endpoint to load the grid in server-side mode
     *
     * @param aGridRequestDTO holds the Request information
     * @return ResponseEntity that holds a GridGetRowsResponseDTO object
     * @throws Exception if something bad happens
     */
    @RequestMapping(value = "/api/grid/getRows", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> getRows(@RequestBody GridGetRowsRequestDTO aGridRequestDTO) throws Exception {
        logger.debug("getRows() started.");

        // Create an array of ES fields to search
        List<String> esFieldsToSearch = Arrays.asList("id.sort", "description", "display_name.sort", "priority.sort");

        // Invoke the GridService to run a search
        GridGetRowsResponseDTO responseDTO = gridService.getPageOfData("reports", esFieldsToSearch, aGridRequestDTO);

        // Return the responseDTO object and a 200 status code
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseDTO);
    }

}


