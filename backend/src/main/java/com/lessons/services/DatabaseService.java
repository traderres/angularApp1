package com.lessons.services;

import com.lessons.models.AddUserSearchDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Service("com.lessons.services.DatabaseService")
public class DatabaseService {

    @Resource
    private DataSource dataSource;

    @Resource
    private UserService userService;

    public Integer getNextId() {
        String sql = "select nextval('seq_table_ids')";
        JdbcTemplate jt = new JdbcTemplate(this.dataSource);
        Integer nextId = jt.queryForObject(sql, Integer.class);
        return nextId;
    }


    public Integer getStartingVersionValue() {
        return 1;
    }

    public void addSearch(AddUserSearchDTO aAddUserSearchDTO) {

        // Get the userid of the logged-in userid
        Integer userid = userService.getLoggedInUserId();

        // Construct the SQL to add this record to the datanbase
        // NOTE:  The userid should be pulled from security
        String sql = "insert into user_searches(userid, page_name, display_name, is_default_search, grid_state) " +
                     "values(:userid, :page_name, :display_name, :is_default_search, :grid_state )";

        // Create a parameter map that holds all of the values
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userid",            userid);
        paramMap.put("page_name",         aAddUserSearchDTO.getPageName() );
        paramMap.put("display_name",      aAddUserSearchDTO.getDisplayName() );
        paramMap.put("is_default_search", aAddUserSearchDTO.getIsDefaultSearch() );
        paramMap.put("grid_state",        aAddUserSearchDTO.getGridState() );


        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);

        // Execute the SQL to add this record to the database
        int rowsAdded = np.update(sql, paramMap);

        if (rowsAdded != 1) {
            throw new RuntimeException("Error in addSearch():  I expected to add one database record.  Instead, I added " + rowsAdded + " records.");
        }
    }


}
