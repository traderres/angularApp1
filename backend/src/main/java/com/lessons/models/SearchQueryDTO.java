package com.lessons.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchQueryDTO {
    @JsonProperty("index_name")
    private String indexName;

    @JsonProperty("raw_query")
    private String rawQuery;

    @JsonProperty("size")
    private int size;


    // ---- Getters & Setters ----
    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public String getRawQuery() {
        return rawQuery;
    }

    public void setRawQuery(String rawQuery) {
        this.rawQuery = rawQuery;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
