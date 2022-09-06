package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetBannerDTO {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("message")
    private String message;

    @JsonProperty("is_visible")
    private String isVisible;

    @JsonProperty("urgency_label")
    private String urgencyLabel;

    // --------------------- Getters & Setters ---------------------------

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(String isVisible) {
        this.isVisible = isVisible;
    }

    public String getUrgencyLabel() {
        return urgencyLabel;
    }

    public void setUrgencyLabel(String urgencyLabel) {
        this.urgencyLabel = urgencyLabel;
    }
}
