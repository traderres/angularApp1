package com.lessons.services;

import com.lessons.models.LookupDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;

@Service("com.lessons.services.LookupService")
public class LookupService {

    private static final Logger logger = LoggerFactory.getLogger(LookupService.class);

    @Resource
    private DataSource dataSource;

    public boolean doesLookupTypeExist(String aLookupType) {
        String sql = "select id from lookup_type where name=?";

        // Execute the SQL
        JdbcTemplate jt = new JdbcTemplate(this.dataSource);
        SqlRowSet rs = jt.queryForRowSet(sql, aLookupType);

        return rs.next();
    }


    public List<LookupDTO> getLookupsWithType(String aLookupType, String aOrderBy) {
        String sql = "select l.id, l.name " +
                     "from lookup l " +
                     "join lookup_type lt on (lt.id=l.lookup_type) " +
                     "where lt.name=?";

        if (StringUtils.isNotEmpty(aOrderBy)) {
            sql = sql + " order by " + aOrderBy;
        }

        // Execute the SQL, generating a list of LookupDTO objects
        BeanPropertyRowMapper rowMapper = new BeanPropertyRowMapper(LookupDTO.class);
        JdbcTemplate jt = new JdbcTemplate(this.dataSource);
        List<LookupDTO> lookups = jt.query(sql, rowMapper, aLookupType);

        // Return the list of lookupDTO objects (or an empty list)
        return lookups;
    }

}
