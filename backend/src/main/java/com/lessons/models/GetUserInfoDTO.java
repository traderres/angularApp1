package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class GetUserInfoDTO {
    @JsonProperty("name")
    private final String name;

    @JsonProperty("pageRoutes")
    private final Map<String, Boolean> accessMap;


    public GetUserInfoDTO(String aName, Map<String, Boolean> aAccessMap) {
        this.name = aName;
        this.accessMap = aAccessMap;
    }

    public String getName() {
        return name;
    }

    public Map<String, Boolean> getAccessMap() {
        return accessMap;
    }
}
