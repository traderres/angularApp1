package com.lessons.controllers;

import com.lessons.models.AddReportDTO;
import com.lessons.services.AsyncService;
import com.lessons.services.ElasticSearchService;
import com.lessons.services.ReportService;
import com.lessons.workers.LongRunningWorker;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;

@Controller("com.lessons.controllers.ReportController")
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Resource
    private ReportService reportService;

    @Resource
    private AsyncService asyncService;

    @Resource
    private ElasticSearchService elasticSearchService;


    /**
     * REST endpoint /api/reports/add
     * @param aAddReportDTO
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api/reports/add", method = RequestMethod.POST, produces = "application/json")
    @PreAuthorize("hasRole('ROLE_SUPERUSER')")
    public ResponseEntity<?> addReport(@RequestBody AddReportDTO aAddReportDTO) throws Exception {

        logger.debug("addReport() started.");

        // Add a record to the database
        reportService.addReport(aAddReportDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("");
    }


    /**
     * REST endpoint /api/reports/upload
     * @param aMultipartFile
     * @return
     */
    @RequestMapping(value = "/api/reports/upload", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(
            @RequestParam(value = "file", required = true) MultipartFile aMultipartFile) throws Exception
    {
        logger.debug("uploadFileWithParams() started. ");

        String uploadedFilename = aMultipartFile.getOriginalFilename();
        long uploadedFileSize = aMultipartFile.getSize();

        logger.debug("Submitted file name is {}", uploadedFilename );
        logger.debug("Submitted file is {} bytes",uploadedFileSize );


        // Construct the JSON for a bulk update
        // NOTE:  You must have the \n at the end of each data line (including the last one)
        String jsonBulkInsert = "" +
                "{ \"index\": { \"_index\": \"reports\", \"_type\": \"record\"}}\n" +
                "{ \"priority\": \"low\", \"description\": \"he really likes o'reilly\"}\n" +
                "{ \"index\": { \"_index\": \"reports\", \"_type\": \"record\"}}\n" +
                "{ \"priority\": \"LOW\",  \"description\": \"depending on the kind query, you might want to go different ways with it\"}\n";

        // Add 2 records to the Reports mapping and *wait* for ES to refresh
        elasticSearchService.bulkUpdate(jsonBulkInsert, true);


        // Return a message back to the front-end
        String returnedMessage = "You uploaded the file called " + uploadedFilename + " with a size of " + uploadedFileSize + " bytes";

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(returnedMessage);

    }


    /**
     * REST endpoint /api/reports/uploadAsync
     * @param aMultipartFile
     * @return
     */
    @RequestMapping(value = "/api/reports/uploadAsync", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFileAsync(
            @RequestParam(value = "file", required = true) MultipartFile aMultipartFile)
    {
        logger.debug("uploadFileAsync() started. ");

        String uploadedFilename = aMultipartFile.getOriginalFilename();
        long uploadedFileSize = aMultipartFile.getSize();

        logger.debug("Submitted file name is {}", uploadedFilename );
        logger.debug("Submitted file is {} bytes",uploadedFileSize );

        // Create the backend worker
        LongRunningWorker worker = new LongRunningWorker();

        // Submit the worker to run in the background
        asyncService.submit(worker);

        // The REST call returns information immediately

        // Return a message back to the front-end
        String returnedMessage = "You uploaded the file called " + uploadedFilename + " with a size of " + uploadedFileSize + " bytes";

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(returnedMessage);

    }

}
