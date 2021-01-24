package com.lessons.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lessons.config.ElasticSearchResources;
import com.lessons.models.SearchQueryDTO;
import com.lessons.models.SearchResultDTO;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.Response;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service("com.lessons.services.ElasticSearchService")
public class ElasticSearchService {

    private static final Logger logger = LoggerFactory.getLogger(ElasticSearchService.class);

    @Resource
    private ElasticSearchResources elasticSearchResources;


    private String elasticSearchUrl;
    private AsyncHttpClient asyncHttpClient;
    private final int ES_REQUEST_TIMEOUT_IN_MILLISECS = 90000;   // All ES requests timeout after 90 seconds

    private ObjectMapper objectMapper;


    @PostConstruct
    public void init() {
        logger.debug("init() started.");

        // In order to make outgoing calls to ElasticSearch you need 2 things:
        //   1) The elastic search url -- e.g., "http://localhost:9201"
        //   2) The initialiaed AsyncHttpClient object
        this.elasticSearchUrl = elasticSearchResources.getElasticSearchUrl();
        this.asyncHttpClient = elasticSearchResources.getAsyncHttpClient();

        this.objectMapper = new ObjectMapper();

        logger.debug("init() finished.  elasticSearchUrl={}", this.elasticSearchUrl);
    }


    /**
     * Helper method to read an entire file into a String -- handy for reading in JSON mapping files
     * @param aFilename holds the name of the file (found in /src/main/resources
     * @return the file's contents as a String
     * @throws Exception if there are problems reading from the file
     */
    public String readInternalFileIntoString(String aFilename) throws Exception {
        try (InputStream inputStream =  ElasticSearchService.class.getResourceAsStream("/" + aFilename)) {
            return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        }
    }


    /**
     * Create a new ES Index
     * @param aIndexName holds the name of the new index to create
     * @param aJsonMapping holds the mapping of this index
     * @throws Exception
     */
    public void createIndex(String aIndexName, String aJsonMapping) throws Exception {
        logger.debug("createIndex() started.  aIndexName={}", aIndexName);

        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        String url = this.elasticSearchUrl + "/" + aIndexName;
        logger.debug("Going to this url:  {}", url);

        // Make a synchronous POST call to ElasticSearch to create this an index
        Response response = this.asyncHttpClient.preparePut(url)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aJsonMapping)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in createIndex:  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }

        logger.info("Successfully created this ES index: {}", aIndexName);
    }


    /**
     * Do a bulk update within ES
     * @param aBulkUpdateJson Holds the JSON bulk string
     * @param aWaitForRefresh Holds TRUE if we will wait for a refresh
     * @throws Exception
     */
    public void bulkUpdate(String aBulkUpdateJson, boolean aWaitForRefresh) throws Exception {
        if (StringUtils.isEmpty(aBulkUpdateJson)) {
            throw new RuntimeException("The passed-in JSON is null or empty.");
        }

        String url = this.elasticSearchUrl + "/_bulk";
        if (aWaitForRefresh) {
            url = url + "?refresh=wait_for";
        }

        // Make a synchronous POST call to do a bulk-index request
        Response response = this.asyncHttpClient.preparePost(url)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(aBulkUpdateJson)
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in bulkUpdate:  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }
    }


    /**
     * Delete the index from ElasticSearch
     * @param aIndexName  holds the index name (or alias name)
     */
    public void deleteIndex(String aIndexName) throws Exception {
        if (StringUtils.isEmpty(aIndexName)) {
            throw new RuntimeException("The passed-in aIndexName is null or empty.");
        }

        // Make a synchronous POST call to delete this ES Index
        Response response = this.asyncHttpClient.prepareDelete(this.elasticSearchUrl + "/" + aIndexName)
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .execute()
                .get();

        if (response.getStatusCode() != 200) {
            // ElasticSearch returned a non-200 status response
            throw new RuntimeException("Error in deleteIndex:  ES returned a status code of " + response.getStatusCode() + " with an error of: " + response.getResponseBody());
        }
    }


    private String generateSearchJson(SearchQueryDTO aSearchQueryDTO) {
        String cleanedQuery = cleanupRawQuery( aSearchQueryDTO.getRawQuery() );

        // Convert the cleaned query to lowercaes (which is required as all ngrams are lowercase)
        cleanedQuery = cleanedQuery.toLowerCase();

        String jsonRequest =
                "{" +
                        "  \"query\": {\n" +
                        "    \"query_string\": {\n" +
                        "      \"query\": \"" + cleanedQuery + "\"\n" +
                        "    }" +
                        "  }," +
                        "  \"size\": " + aSearchQueryDTO.getSize()  +
                        "}";

        return jsonRequest;
    }


    /**
     * @param aRawQuery holds the raw query
     * @return a cleaned-up string
     */
    private String cleanupRawQuery(String aRawQuery) {
        String cleanedQuery = aRawQuery;

        if (cleanedQuery == null) {
            cleanedQuery = "";
        }

        return cleanedQuery;
    }


    /**
     * Run an ElasticSearch and return a list of SearchResultDTO objects
     *
     *  1. Construct the JSON query
     *  2. Invoke the REST call to ElasticSearch
     *  3. If the response is invalid, then throw a RuntimeException
     *  4. Else loop through the results
     *       Add matches to the list of matches
     * @param aSearchQueryDTO holds the DTO with the search criteria
     * @return a list of SearchResultDTO objects
     */
    public List<SearchResultDTO> runSearchGetMatches(SearchQueryDTO aSearchQueryDTO) throws Exception {

        // Construct the search query (as a json string)
        String jsonSearchQuery = generateSearchJson(aSearchQueryDTO);

        // Make a synchronous POST call to execute a search
        Response response = this.asyncHttpClient.prepareGet(this.elasticSearchUrl + "/" + aSearchQueryDTO.getIndexName() + "/_search")
                .setRequestTimeout(this.ES_REQUEST_TIMEOUT_IN_MILLISECS)
                .setHeader("accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .setBody(jsonSearchQuery)
                .execute()
                .get();


        if (response.getStatusCode() != 200) {
            throw new RuntimeException("Critical error in runSearchGetMatches():  ElasticSearch returned a response status code of " +
                    response.getStatusCode() + ".  Response message is " + response.getResponseBody() + "\n\n" + response.getResponseBody());
        }

        List<SearchResultDTO> searchResults = new ArrayList<>();


        // Convert the response JSON string into a map and examine it to see if the request really worked
        Map<String, Object> mapResponse = objectMapper.readValue(response.getResponseBody(), new TypeReference<Map<String, Object>>() {});

        Map<String, Object> outerHits = (Map<String, Object>) mapResponse.get("hits");
        if (outerHits == null) {
            throw new RuntimeException("Error in runSearchGetMatches():  The outer hits value was not found in the JSON response");
        }

        List<Map<String, Object>> innerHits = (List<Map<String, Object>>) outerHits.get("hits");
        if (innerHits == null) {
            throw new RuntimeException("Error in runSearchGetMatches():  The inner hits value was not found in the JSON response");
        }

        if (innerHits.size() > 0) {
            for (Map<String, Object> hit: innerHits) {
                Map<String, Object> sourceMap = (Map<String, Object>) hit.get("_source");
                if (sourceMap == null) {
                    throw new RuntimeException("Error in runSearchGetMatches():  The source map was null in the JSON response");
                }

                // Create one SearchResultDTO object
                SearchResultDTO searchResult = new SearchResultDTO();

                Integer id = (Integer) sourceMap.get("id");
                searchResult.setId(id);

                String name = (String) sourceMap.get("name");
                searchResult.setName(name);

                String priority = (String) sourceMap.get("priority");
                searchResult.setPriority(priority);

                Integer startYear = (Integer) sourceMap.get("start_year");
                searchResult.setStartYear(startYear);

                String startDate = (String) sourceMap.get("start_date");
                searchResult.setStartDate(startDate);

                // Add this one SearchResultDTO object to the list
                searchResults.add(searchResult);
            }
        }

        // Return a list of SearchResultDTO objects
        return searchResults;
    }




}
