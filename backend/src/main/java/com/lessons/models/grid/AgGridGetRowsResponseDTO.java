package com.lessons.models.grid;

import java.util.List;
import java.util.Map;

public class AgGridGetRowsResponseDTO {

    private List<Map<String, Object>> data;
    private int lastRow;
    private List<String> secondaryColumnFields;

    public AgGridGetRowsResponseDTO() { }

    public AgGridGetRowsResponseDTO(List<Map<String, Object>> data, int lastRow, List<String> secondaryColumnFields) {
        this.data = data;
        this.lastRow = lastRow;
        this.secondaryColumnFields = secondaryColumnFields;
    }


    public List<Map<String, Object>> getData() {
        return data;
    }

    public int getLastRow() {
        return lastRow;
    }

    public List<String> getSecondaryColumnFields() {
        return secondaryColumnFields;
    }
}
