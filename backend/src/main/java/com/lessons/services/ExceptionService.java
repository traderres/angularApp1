package com.lessons.services;

import com.lessons.models.GetExceptionInfoDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.*;

@Service
public class ExceptionService {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionService.class);

    @Resource
    private DataSource dataSource;

    @Resource
    private UserService userService;

    @Resource
    private DatabaseService databaseService;

    private String APPLICATION_VERSION;
    private String APPLICATION_NAME = "angularApp1";

    private final int LAST_1_DAY_FILTER_NUMBER = 1;
    private final int LAST_7_DAYS_FILTER_NUMBER = 2;
    private final int LAST_30_DAYS_FILTER_NUMBER = 3;
    private final int YEAR_TO_DATE_FILTER_NUMBER = 4;
    private final int MATCH_ALL_DATA_FILTER_NUMBER = 5;


    @PostConstruct
    public void init() throws Exception{
        // Read the contents of the project.properties file
        final Properties properties = new Properties();
        properties.load(this.getClass().getClassLoader().getResourceAsStream("project.properties"));

        // Get the version info from the property file
        this.APPLICATION_VERSION = properties.getProperty("appVersion");
    }

    /**
     * Save the Exception information to the database
     * @param aException holds the Exception object that was raised
     * @param aRequestURI holds the URL of the request
     * @return unique ID of the added record
     */
    public Integer saveException(Exception aException, String aRequestURI) {
        if (aRequestURI == null) {
            logger.error("Error in saveException(): Exception object is null");
            return null;
        }

        // Generate a unique ID for the exception
        Integer exceptionId = databaseService.getNextId();

        // Get the stack trace as a string separated by newline characters
        String stackTraceAsString = getStackTraceAsString(aException);

        // Capture the cause of the traceback if it is known, otherwise set it to null
        String causeAsString = null;
        if (aException.getCause() != null) {
            causeAsString = aException.getCause().toString();
        }

        // Construct the SQL to insert this record into the exceptions table
        String sql = "insert into exceptions(id, user_id, user_name, url, event_date, message, cause, app_name, app_version, stack_trace)\n" +
                    "values(:id, :user_id, :user_name, :url, now(), :message, :cause, :app_name, :app_version, :stack_trace);\n";

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("id",             exceptionId);
        paramMap.put("user_id",        userService.getLoggedInUserId());
        paramMap.put("user_name",      userService.getLoggedInUserName());
        paramMap.put("url",            aRequestURI);
        paramMap.put("message",        aException.getLocalizedMessage());
        paramMap.put("cause",          causeAsString);
        paramMap.put("stack_trace",    stackTraceAsString);
        paramMap.put("app_version",    this.APPLICATION_VERSION);
        paramMap.put("app_name",       this.APPLICATION_NAME);

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);

        // Run the SQL to add the record to the exceptions table
        int rowsAdded = np.update(sql, paramMap);

        if (rowsAdded != 1) {
            // Failed to save the exception.  But, we do not want to throw an exception
            logger.error("Error in saveException():  Failed to save the exception");
            return null;
        }

        // Return the newly-generated exceptionId
        return exceptionId;
    }


    /**
     * @param aException holds the exception object to examine
     * @return the stack trace as a string with newlines
     */
    private String getStackTraceAsString(Exception aException) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : aException.getStackTrace()) {
            sb.append(element.toString());
            sb.append("\n");
        }
        return sb.toString();
    }


    /**
     * Get a list of ExceptionInfoDTO objects (based on the passed-in filter number)
     * @param aFilterNumber holds the filter number
     * @return List of GetExceptionInfoDTO objects
     */
    public List<GetExceptionInfoDTO> getExceptionList(Integer aFilterNumber) {
        logger.debug("getExceptionList() started");

        String whereClause;
        if (aFilterNumber == LAST_1_DAY_FILTER_NUMBER) {
            whereClause = "where e.event_date between (now() - interval '1 days') and now()";
        }
        else if (aFilterNumber == LAST_7_DAYS_FILTER_NUMBER) {
            whereClause = "where e.event_date between (now() - interval '7 days') and now()";
        }
        else if (aFilterNumber == LAST_30_DAYS_FILTER_NUMBER) {
            whereClause = "where e.event_date between (now() - interval '30 days') and now()";
        }
        else if (aFilterNumber == YEAR_TO_DATE_FILTER_NUMBER) {
            whereClause = "where e.event_date BETWEEN date_trunc('year', now()) AND now()";
        }
        else if (aFilterNumber == MATCH_ALL_DATA_FILTER_NUMBER) {
            whereClause = "";
        }
        else {
            throw new RuntimeException("Error in getExceptionList():  The passed-in filter number is invalid.");
        }


        // Construct the SQL to get the list of exceptions
        String sql = "select u.full_name as user_full_name, e.id as id, e.user_name, e.app_name, e.app_version, e.url, e.message, e.cause, e.stack_trace,\n" +
                     "to_char(e.event_date, 'mm/dd/yyyy hh24:mi:ss') as event_date\n" +
                     "from exceptions e\n" +
                     "left join users u on (e.user_id = u.id)\n" +
                      whereClause + "\n" +
                      "order by e.event_date desc";

        JdbcTemplate jt = new JdbcTemplate(this.dataSource);

        BeanPropertyRowMapper<GetExceptionInfoDTO> rowMapper = new BeanPropertyRowMapper<>(GetExceptionInfoDTO.class);

        // Exception the SQL and convert it to a list of GetExceptionInfoDTO objects
        List<GetExceptionInfoDTO> listOfExceptions = jt.query(sql, rowMapper);

        return listOfExceptions;
    }


}
