package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddUserSearchDTO {

    @JsonProperty("page_name")
    private String pageName;

    @JsonProperty("display_name")
    private String displayName;

    @JsonProperty("is_default_search")
    private boolean isDefaultSearch;

    @JsonProperty("grid_state")
    private String gridState;

    // -------------- Getters & Setters ---------------


    public String getPageName() {
        return pageName;
    }

    public void setPageName(String pageName) {
        this.pageName = pageName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public boolean getIsDefaultSearch() {
        return isDefaultSearch;
    }

    public void setIsDefaultSearch(boolean defaultSearch) {
        isDefaultSearch = defaultSearch;
    }

    public String getGridState() {
        return gridState;
    }

    public void setGridState(String gridState) {
        this.gridState = gridState;
    }
}
