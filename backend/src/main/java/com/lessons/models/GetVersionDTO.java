package com.lessons.models;

public class GetVersionDTO {

    private final String version;

    // ---------------- Constructor and Getters ------------------

    public GetVersionDTO(String version) {
        this.version = version;
    }

    public String getVersion() {
        return version;
    }
}
