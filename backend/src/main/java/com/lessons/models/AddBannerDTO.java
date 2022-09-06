package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddBannerDTO {
    @JsonProperty("message")
    private String message;

    @JsonProperty("banner_urgency_id")
    private Integer bannerUrgencyId;

    // ---------------------- Getters & Setters ----------------------

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getBannerUrgencyId() {
        return bannerUrgencyId;
    }

    public void setBannerUrgencyId(Integer bannerUrgencyId) {
        this.bannerUrgencyId = bannerUrgencyId;
    }
}
