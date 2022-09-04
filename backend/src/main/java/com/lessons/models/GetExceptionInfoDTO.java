package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetExceptionInfoDTO {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("user_full_name")
    private String userFullName;

    @JsonProperty("app_name")
    private String appName;

    @JsonProperty("app_version")
    private String appVersion;

    @JsonProperty("url")
    private String url;

    @JsonProperty("event_date")
    private String eventDate;

    @JsonProperty("message")
    private String message;

    @JsonProperty("cause")
    private String cause;

    @JsonProperty("stack_trace")
    private String stackTrace;

    // ------------------- Getters & Setters ----------------------------------

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
    }
}
