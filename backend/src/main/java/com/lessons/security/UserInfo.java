
package com.lessons.security;


import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class UserInfo implements UserDetails, Serializable{

    private String usernameUID;                           // The part of the Cn=.... that holds this user's client name (from PKI client cert)
    private String usernameDN;                            // The entire DN string    (from the PKI client cert)
    private List<GrantedAuthority> grantedAuthorities;    // List of roles for this user (found in the database)
    private Integer id;                                   // Holds the user's ID in the database
    private Map<String, Boolean> uiControlAccessMap;


    public Map<String, Boolean> getUiControlAccessMap() {
        return uiControlAccessMap;
    }

    public String getPassword() {
        // Must implement this method in order to implement the UserDetails interface
        // NOTE:  There is no password as we are using PKI authentication
        return null;
    }

    public String getUsername() {
        return this.usernameUID;
    }

    public boolean isAccountNonExpired() {
        // Must implement this method in order to implement the UserDetails interface
        return true;
    }

    public boolean isAccountNonLocked() {
        // Must implement this method in order to implement the UserDetails interface
        return true;
    }

    public boolean isCredentialsNonExpired() {
        // Must implement this method in order to implement the UserDetails interface
        return true;
    }

    public boolean isEnabled() {
        // Must implement this method in order to implement the UserDetails interface
        return true;
    }


    /**
     * @return an array of GrantedAuthority objects for this user
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Must implement this method in order to implement the UserDetails interface
        return this.grantedAuthorities;
    }


    /**
     * @return an array of Strings (for this user)
     */
    public List<String> getRoles() {
        return grantedAuthorities.stream().map(auth -> auth.toString()).collect(Collectors.toList());
    }




    public String getUsernameDN() {
        return this.usernameDN;
    }

    public List<GrantedAuthority> getGrantedAuthorities() {
        return grantedAuthorities;
    }

    public void setGrantedAuthorities(List<GrantedAuthority> grantedAuthorities) {
        this.grantedAuthorities = grantedAuthorities;
    }

    private static class GrantedAuthorityComparator implements Comparator<GrantedAuthority> {
        public int compare(GrantedAuthority object1, GrantedAuthority object2) {
            return object1.getAuthority().compareTo(object2.getAuthority());
        }
    }


    public Integer getId() {
        return id;
    }

    public String toString() {
        return ("Roles=" + StringUtils.join(this.grantedAuthorities, ",") +
                " UID=" + this.usernameUID +
                " DN=" + this.usernameDN);
    }

    public UserInfo withId(Integer id) {
        this.id = id;
        return this;
    }

    public UserInfo withUsernameUID(String usernameUID) {
        this.usernameUID = usernameUID;
        return this;
    }

    public UserInfo withUsernameDn(String usernameDN) {
        this.usernameDN = usernameDN;
        return this;
    }

    public UserInfo withGrantedAuthorities(List<GrantedAuthority> grantedAuthorities) {
        this.grantedAuthorities = grantedAuthorities;
        return this;
    }

    public UserInfo withUiControlAccessMap(Map<String, Boolean> aAccessMap) {
        this.uiControlAccessMap = aAccessMap;
        return this;
    }


}
