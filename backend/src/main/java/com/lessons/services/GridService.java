package com.lessons.services;

import com.lessons.models.grid.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class GridService {
    private static final Logger logger = LoggerFactory.getLogger(GridService.class);


    /**
     *  1. Run a search
     *  2. Put the results into a list
     *  3. Create a GridGetRowsResponseDTO object
     *  4. Return the GridGetRowsResponseDTO object
     *
     * @param aGridRequestDTO holds information about the request
     * @return holds the response object (that holds the list of data and meta data)
     */
    public GridGetRowsResponseDTO getPageOfData(String aIndexName, List<String> aFieldsToSearch, GridGetRowsRequestDTO aGridRequestDTO) throws Exception {

        logger.debug("getPageOfData()  startRow={}   endRow={}", aGridRequestDTO.getStartRow(), aGridRequestDTO.getEndRow() );


        Map<String, Object> map1 = new HashMap<>();
        map1.put("id", 1);
        map1.put("display_name", "Report 1");
        map1.put("priority", "low");
        map1.put("description", "This is the description of report 1");

        Map<String, Object> map2 = new HashMap<>();
        map2.put("id", 2);
        map2.put("display_name", "Report 2");
        map2.put("priority", "low");
        map2.put("description", "This is the description of report 2");

        Map<String, Object> map3 = new HashMap<>();
        map3.put("id", 3);
        map3.put("display_name", "Report 3");
        map3.put("priority", "medium");
        map3.put("description", "This is the description of report 3");

        List<Map<String, Object>> listOfData = Arrays.asList(map1, map2, map3);

        int totalMatches = 3;


        int agGridLastRow;

        // Set the lastRow  (so the ag-grid's infinite scrolling works correctly)
        if (aGridRequestDTO.getEndRow() < totalMatches ) {
            // This is not the last page.  So, set lastRow=-1  (which turns on infinite scrolling)
            agGridLastRow = -1;
        }
        else {
            // This is the last page.  So, set lastRow=totalMatches (which turns off infinite scrolling)
            agGridLastRow = totalMatches;
        }


        // Create a responseDTO object that has the information that ag-grid needs
        GridGetRowsResponseDTO responseDTO = new GridGetRowsResponseDTO(listOfData, totalMatches, agGridLastRow, null);

        return responseDTO;
    }

}
