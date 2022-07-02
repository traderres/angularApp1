import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from "../../../services/dashboard.service";
import {Router} from "@angular/router";

import * as Highcharts from "highcharts/highcharts-gantt";
import {Chart} from "highcharts";

window.Highcharts = Highcharts;

// Turn on the highchart context menu view/print/download options
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);

// Turn on the highchart context menu *export* options
// NOTE:  This provides these menu options: Download CSV, Download XLS, View Data Table
import HC_exportData from "highcharts/modules/export-data";
HC_exportData(Highcharts);

// Do client-side exporting (so that the exporting does *NOT* go to https://export.highcharts.com/
// NOTE:  This does not work on all web browsers
import HC_offlineExport from "highcharts/modules/offline-exporting";
HC_offlineExport(Highcharts);

// Turn on the drill-down capabilities
import HC_drillDown from "highcharts/modules/drilldown";
import {BarChartDTO} from "../../../models/bar-chart-dto";
import {Constants} from "../../../utilities/constants";
HC_drillDown(Highcharts);


@Component({
  selector: 'app-gantt-chart-little',
  templateUrl: './gantt-chart-little.component.html',
  styleUrls: ['./gantt-chart-little.component.css']
})
export class GanttChartLittleComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChartDiv: ElementRef;

  private chart: Chart;

  constructor(private dashboardService: DashboardService,
              private router: Router) { }


  public ngOnInit(): void {

    // Set options for all highchart menus on this page
    Highcharts.setOptions( {
      lang: {
        thousandsSep: ','	// Set the thousand separator as a comma
      }
    });

  }  // end of ngOnInit()



  /*
   * The HTML div exists.  Now we can render the chart
   */
  public ngAfterViewInit(): void {
    this.reloadPage();
  }



  private reloadPage(): void {
    // Run this code in setInterval() so the code is executed after angular does a refresh
    // NOTE:  The 1 ms number doesn't matter as it will only run once
    let intervalFunction = setTimeout(() => {

      if (this.myChartDiv != undefined) {
        // The chart div HTML exists.  So, now we can tell Highcharts to rener (as the div actually exists

        // Invoke a REST call to get data for the initial page load
        this.dashboardService.getBarChartData().subscribe((aData: BarChartDTO) => {
          // We got row data from the REST call

          // this.chartOptions.series = aData.chartData;
          // this.chartOptions.drilldown = aData.drillDownData;

          if (this.chart != undefined) {
            // Destroy the existing chart
            this.chart.destroy();
          }

          // Render the chart
          this.chart = Highcharts.ganttChart('ganttChart1', this.chartOptions);

          // Resize the chart to fit its container
          this.chart.reflow();
        });

        // Charts are rendered.  So, stop the interval
        clearInterval(intervalFunction);
      }

    }, 1);  // end of setTimeout()

  }  // end of reloadPage()



  public goToFullSizePage(): void {
    this.router.navigate( [Constants.DASHBOARD_GANT_PAGE] ).then();
  }



  private  chartOptions: Highcharts.Options = {
    credits: {
      enabled: false    	// Hide the highcharts.com label
    },
    title: {
      text: ""
    },

    xAxis: {
      min: Date.UTC(2021, 5, 1),
      max: Date.UTC(2021, 5, 30)
    },

    series: [
      {
        type: "gantt",
        name: "Project 1",
        data: [
          {
            name: "Workflow Step 1",
            start: Date.UTC(2021, 5, 1),
            end: Date.UTC(2021, 5, 4),
          },
          {
            name: "Workflow Step 2",
            start: Date.UTC(2021, 5, 4),
            end: Date.UTC(2021, 5, 15)
          },
          {
            name: "Workflow Step 3",
            start: Date.UTC(2021, 5, 15),
            end: Date.UTC(2021, 5, 16)
          },
          {
            name: "Workflow Step 4",
            start: Date.UTC(2021, 5, 16),
            end: Date.UTC(2021, 5, 25)
          }
        ]
      }
    ]
  };


}
