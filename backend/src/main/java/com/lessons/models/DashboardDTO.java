package com.lessons.models;

import java.util.List;
import java.util.Map;

public class DashboardDTO {
    List<Map<String, Object>> chartData1;

    public List<Map<String, Object>> getChartData1() {
        return chartData1;
    }

    public void setChartData1(List<Map<String, Object>> chartData1) {
        this.chartData1 = chartData1;
    }
}
