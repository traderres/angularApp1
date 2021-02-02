package com.lessons.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;


@Component("com.lessons.security.RequestHeaderAuthFilter")
public class MyRequestHeaderAuthFilter extends RequestHeaderAuthenticationFilter
{
    private static final Logger logger = LoggerFactory.getLogger(MyRequestHeaderAuthFilter.class);

    @Resource
    private MyAuthenticationManager myAuthenticationManager;

    @Value("${use.hardcoded.principal}")
    private boolean useHardcodePrincipal;

    @PostConstruct
    public void init() {
        this.setAuthenticationManager(myAuthenticationManager);
    }


    /**************************************************************
     * getPreAuthenticatedPrincipal()
     *
     * This is called when a request is made, the returned object identifies the
     * user and will either be {@literal null} or a String.
     *
     * This method will throw an exception if
     * exceptionIfHeaderMissing is set to true (default) and the required header is missing.
     **************************************************************/
    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request)
    {
        logger.debug("getPreAuthenticatedPrincipal() called");

        // Get the principal from the header
        String userDnFromHeader = (String) request.getHeader("SSL_CLIENT_S_DN");
        logger.debug("userDnFromHeader from header -->{}<---", userDnFromHeader);

        if (userDnFromHeader == null) {
            if (useHardcodePrincipal) {
                // No header was found, but I am in dev mode or "local prod" mode.  So, set a hard-coded user name
                logger.debug("No header was found, so using hard-dcoded header 'Bogus_user'");
                userDnFromHeader = "Bogus_user";
            }
        }

        // If this method returns null, then the user will see a 403 Forbidden Message
        logger.debug("getPreAuthenticatedPrincipal() returns -->{}<--", userDnFromHeader);
        return userDnFromHeader;
    }

    /**************************************************************
     * logHeaders()
     **************************************************************/
    private void logHeaders(HttpServletRequest aRequest)
    {
        if (logger.isDebugEnabled())
        {
            Enumeration<String> enumHeaders = aRequest.getHeaderNames();
            while (enumHeaders.hasMoreElements()) {
                String sHeaderName = enumHeaders.nextElement();
                String sHeaderValue = aRequest.getHeader(sHeaderName);
                logger.debug("header({}) holds -->{}<---", sHeaderName, sHeaderValue);
            }
        }
    }

}
