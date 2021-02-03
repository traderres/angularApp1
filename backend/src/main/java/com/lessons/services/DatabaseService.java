package com.lessons.services;

import com.lessons.models.AddUserSearchDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        // Get the userid of the logged-in user   id
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


    public Map<String, Boolean> getUiControlAccessMap(List<GrantedAuthority> aGrantedRoleAuthorities) {
        // Construct the SQL to get list of all ui-contols with true if allowed and false if not allowed
        String sql =
                "-- Get the uicontrols in this role\n" +
                "select distinct ui.name, true as access\n" +
                "from uicontrols ui\n" +
                "         join roles r on (r.name IN ( :roleList ))\n" +
                "         join roles_uicontrols ru ON (r.id=ru.role_id) AND (ui.id=ru.uicontrol_id)\n" +
                "\n" +
                "UNION\n" +
                "\n" +
                "-- Get the roles not in this role\n" +
                "select name, false as access\n" +
                "from uicontrols ui\n" +
                "where ui.id NOT IN (\n" +
                "    select distinct ui.id\n" +
                "    from uicontrols ui\n" +
                "        join roles r on (r.name IN (  :roleList ))\n" +
                "        join roles_uicontrols ru ON (r.id=ru.role_id) AND (ui.id=ru.uicontrol_id)\n" +
                ")";


        // Convert the list of granted authority objects into a list of strings (and strip-off the _ROLE)
        List<String> roleList = aGrantedRoleAuthorities.stream().map(auth -> {
            String authString = auth.toString();
            if (authString.startsWith("ROLE_")) {
                return authString.substring(5);
            }
            else {
                return authString;
            }
        }).collect(Collectors.toList());

        // Create a parameter map (required to use bind variables with postgres IN clause)
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("roleList", roleList);


        // Execute the query
        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);
        SqlRowSet rs = np.queryForRowSet(sql, paramMap);

        // Create the map
        Map<String, Boolean> accessMap = new HashMap<>();

        // Loop through the SqlRowSet, putting the results into a map
        while (rs.next() ) {
            accessMap.put( rs.getString("name"), rs.getBoolean("access") );
        }

        // Return the map
        return accessMap;
    }
}
