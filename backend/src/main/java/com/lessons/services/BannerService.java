package com.lessons.services;

import com.lessons.models.AddBannerDTO;
import com.lessons.models.GetBannerDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BannerService {
    private static final Logger logger = LoggerFactory.getLogger(BannerService.class);

    @Resource
    private DataSource dataSource;

    @Resource
    private DatabaseService databaseService;

    /**
     * Get a list of all banner records from the database
     * @return List of GetBannerDTO objects
     */
    public List<GetBannerDTO> getAllBanners() {
        String sql = "select b.id as id, b.message as message, bu.displayed_value as urgency_label,\n" +
                     "       case\n" +
                     "          WHEN b.is_visible = true then 'Yes'\n" +
                     "          ELSE 'No'\n" +
                     "        end as is_visible\n" +
                     "from banners b\n" +
                     "join banner_urgency bu on (b.banner_urgency_id = bu.id)\n" +
                     "order by b.id desc";

        // Use the rowMapper to convert the results into a list of ReportDTO objects
        BeanPropertyRowMapper<GetBannerDTO> rowMapper = new BeanPropertyRowMapper<>(GetBannerDTO.class);

        JdbcTemplate jt = new JdbcTemplate(this.dataSource);

        // Execute the SQL and convert the recordset into a list of Java objects
        List<GetBannerDTO> bannerList = jt.query(sql, rowMapper);

        return bannerList;
    }


    /**
     * Add a new banner to the system
     * @param aAddBannerDTO holds the DTO with information about this new banner
     */
    public void addBanner(AddBannerDTO aAddBannerDTO) {
        logger.debug("addBanner() started");

        String sql = "insert into banners(id, message, is_visible, banner_urgency_id) " +
                     "values( :banner_id , :message, true, :banner_urgency_id) ";

        // Get the unique ID for this banner record
        Integer newBannerId = this.databaseService.getNextId();

        // Build the parameter map
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("banner_id", newBannerId);
        paramMap.put("message",      aAddBannerDTO.getMessage());
        paramMap.put("banner_urgency_id", aAddBannerDTO.getBannerUrgencyId());

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);
        int rowsAdded = np.update(sql, paramMap);

        if (rowsAdded != 1) {
            throw new RuntimeException("Error in addBanner().  I expected to insert one record.  Instead, " + rowsAdded + " records were added.");
        }

    }


    /**
     * Delete an existing banner from the system
     * @param aBannerId holds the id of the banner to delete
     */
    public void deleteBanner(Integer aBannerId) {
        logger.debug("deleteBanner() started");

        String sql = "delete from banners where id=:id";

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("id", aBannerId);

        NamedParameterJdbcTemplate np = new NamedParameterJdbcTemplate(this.dataSource);
        int rowsDeleted = np.update(sql, paramMap);

        if (rowsDeleted != 1) {
            throw new RuntimeException("Error in deleteBanner().  I expected to delete one record.  Instead, " + rowsDeleted + " records were deleted.");
        }

    }


    public boolean doesBannerIdExist(Integer aBannerId) {
        String sql = "select id from banners where id=?";

        JdbcTemplate jt = new JdbcTemplate(this.dataSource);

        SqlRowSet rs = jt.queryForRowSet(sql, aBannerId);
        return rs.next();
    }
}
