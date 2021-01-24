package com.lessons;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Unit test for simple App.
 */
public class AppTest 
{
    /**
     * Rigorous Test :-)
     */
    @Test
    public void shouldAnswerWithTrue()
    {
        String xbdpUserHeaderValue = "AUTH:FOUO;AUTH:U;AUTH:USA;GROUP:BDPUSERS;NAME:bdptest_u_fouo;ROLE:ANALYTIC_RUNNER;ROLE:BDP_ADMIN;ROLE:CITE_USER;ROLE:DATA_ADMIN;ROLE:KIBANA_ADMIN;ROLE:LOGS;ROLE:METRICS;ROLE:OWF_ADMIN;ROLE:OWF_USER;ROLE:SUPERUSER;ROLE:UNITY_ADMIN";

        ArrayList<String> grantedRoles = new ArrayList<>();
        Pattern patMatchRole = Pattern.compile("ROLE:(.*?)(?:;|\\z)", Pattern.CASE_INSENSITIVE);


        // Pull every string that starts with ROLE: and add it to the list
        Matcher matcher = patMatchRole.matcher(xbdpUserHeaderValue);
        while (matcher.find()) {
            String roleName = matcher.group(1);
            String roleNameWithPrefix = "ROLE_" + roleName;
            grantedRoles.add(roleNameWithPrefix);
        }

        assertTrue( true );
    }
}
