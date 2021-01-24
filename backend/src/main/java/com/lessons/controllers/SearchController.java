package com.lessons.controllers;

import com.lessons.models.AutoCompleteDTO;
import com.lessons.models.SearchQueryDTO;
import com.lessons.models.SearchResultDTO;
import com.lessons.services.ElasticSearchService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Controller("com.lessons.controllers.SearchController")
public class SearchController {
    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);


    @Resource
    private ElasticSearchService elasticSearchService;


    /*************************************************************************
     * REST endpoint /api/search/create
     *
     * @return nothing
     *************************************************************************/
    @RequestMapping(value = "/api/search/create", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('ROLE_SUPERUSER')")
    public ResponseEntity<?> createMapping() throws Exception {

        logger.debug("createMapping() started.");

        // Read the mapping from the src/main/resources/repots.json file into this string
        String reportsMappingAsJson = elasticSearchService.readInternalFileIntoString("reports.mapping.json");

        // Create a mapping in ElasticSearch
        elasticSearchService.createIndex("reports" , reportsMappingAsJson);

        // Change the contentType to text-plain as we are returning a simple string back to the frontend
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Successfully Created the mapping reports");
    }


    /*************************************************************************
     * REST endpoint /api/search/add
     *
     * @return nothing
     *************************************************************************/
    @RequestMapping(value = "/api/search/add", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('ROLE_SUPERUSER')")
    public ResponseEntity<?> addRecords() throws Exception {

        logger.debug("addRecords() started.");

        // Construct the JSON for a bulk update
        // NOTE:  You must have the \n at the end of each data line (including the last one)
        String jsonBulkInsert = "" +
                "{ \"index\": { \"_index\": \"reports\", \"_type\": \"record\"}}\n" +
                "{ \"priority\": \"low\",  \"description\": \"he really likes o'reilly\"}\n" +
                "{ \"index\": { \"_index\": \"reports\", \"_type\": \"record\"}}\n" +
                "{ \"priority\": \"LOW\",  \"description\": \"depending on the kind query, you might want to go different ways with it\"}\n";

        // Add 2 records to the Reports mapping and *wait* for it to be refreshed in ES
        elasticSearchService.bulkUpdate(jsonBulkInsert, true);

        // Change the contentType to text-plain as we are returning a simple string back to the frontend
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Successfully added some records.  Here is what was added:  " + jsonBulkInsert);
    }


    /*************************************************************************
     * REST endpoint /api/search/delete
     *
     * @return nothing
     *************************************************************************/
    @RequestMapping(value = "/api/search/delete", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('ROLE_SUPERUSER')")
    public ResponseEntity<?> deleteMapping() throws Exception {

        logger.debug("deleteMapping() started.");

        // Delete this mapping within ElasticSearch
        elasticSearchService.deleteIndex("reports");

        // Change the contentType to text-plain as we are returning a simple string back to the frontend
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body("Successfully deleted the mapping");
    }


    /**
     * REST endpoint /api/search/autocomplete
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api/search/autocomplete", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> runAutoComplete(@RequestBody AutoCompleteDTO aAutoCompleteDTO) throws Exception {

        logger.debug("runAutoComplete() started.");

        return null;
//        // Read the mapping from the src/main/resources/repots.json file into this string
//        List<String> matches = elasticSearchService.runAutoComplete(aAutoCompleteDTO);
//
//        // Return a list of matches (or an empty list if there are no matches)
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(matches);
    }






    /**
     * REST endpoint /api/search
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api/search", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> runSearch(@RequestBody SearchQueryDTO aSearchQueryDTO) throws Exception {

        logger.debug("runSearch() started.");

        if (StringUtils.isBlank( aSearchQueryDTO.getIndexName() )) {
            // The index name was not specified
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The index_name field is required.");
        }
        else if (aSearchQueryDTO.getSize() <= 0) {
            // The size must be greater than 1
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("The size field must be greater than 1.");
        }

        // Run a search
        List<SearchResultDTO> searchResults = elasticSearchService.runSearchGetMatches(aSearchQueryDTO);

        // Return a response with the hard-coded results
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(searchResults);
    }

}
