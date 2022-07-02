import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {DashboardService} from "../../../services/dashboard.service";
import {NavbarService} from "../../../services/navbar.service";
import {BarChartDTO} from "../../../models/bar-chart-dto";
import {Constants} from "../../../utilities/constants";

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
HC_drillDown(Highcharts);


@Component({
  selector: 'app-gantt-chart-page',
  templateUrl: './gantt-chart-page.component.html',
  styleUrls: ['./gantt-chart-page.component.css']
})
export class GanttChartPageComponent  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('myChart') myChartDiv: ElementRef;

  private chart: Chart;
  private navbarSubscription: Subscription;
  private contentIsInitialized: boolean = false;

  constructor(private dashboardService: DashboardService,
              private navbarService: NavbarService) { }

  public ngOnInit(): void {
    // Set options for all highchart menus on this page
    Highcharts.setOptions( {
      lang: {
        thousandsSep: ','	// Set the thousand separator as a comma
      }
    });

    this.navbarSubscription = this.navbarService.getNavbarStateAsObservable().subscribe( () => {
      // Left Side navbar was opened or closed.
      if (this.contentIsInitialized) {
        this.resizeChartsToFitContainers();
      }
    });

  }

  public ngOnDestroy(): void {
    if (this.navbarSubscription) {
      this.navbarSubscription.unsubscribe();
    }
  }

  /*
   * The HTML div exists.  Now we can render the chart
   */
  public ngAfterViewInit(): void {
    this.reloadPage();
    this.contentIsInitialized = true;
  }


  /*
   * Send a 'resize' event
   * This will cause HighCharts to resize all charts to fit inside their parent containers
   */
  private resizeChartsToFitContainers(): void {

    setTimeout(()=> {
      // Send a 'resize' event
      // NOTE:  The window.dispatchEvent() call MUST be in a setTimeout or it will not work
      // NOTE:  The timeout must be ATLEAST 200ms (as the mat-sidenav needs that much time to shrink/grow)
      window.dispatchEvent(new Event('resize'));
    }, 200);
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

      //    this.chartOptions.series = aData.chartData;
       //   this.chartOptions.drilldown = aData.drillDownData;

          if (this.chart != undefined) {
            // Destroy the existing chart
            this.chart.destroy();
          }

          // Render the chart
          this.chart = Highcharts.ganttChart('ganttChartPage1', this.chartOptions);

          // Resize the chart to fit its container
          this.chart.reflow();
        });

        // Charts are rendered.  So, stop the interval
        clearInterval(intervalFunction);
      }

    }, 1);  // end of setTimeout()

  }  // end of reloadPage()



  /*
 * Add this public get method so that we can reference constants in the HTML template
 */
  public get constants(): typeof Constants {
    // Get a reference to the enumerated object
    // -- This is needed so that the html page can use the enum class
    return Constants;
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

    // exporting: {
    //   menuItemDefinitions: {
    //     viewFullscreen: {
    //       onclick: function() {
    //         // @ts-ignore
    //         let container = this.renderTo;
    //
    //         console.log('container.height=', container.height);
    //
    //         if (container.requestFullscreen) {
    //           container.requestFullscreen();
    //         } else if (container.mozRequestFullScreen) {
    //           container.mozRequestFullScreen();
    //         } else if (container.webkitRequestFullscreen) {
    //           container.webkitRequestFullscreen();
    //         } else if (container.msRequestFullscreen) {
    //           container.msRequestFullscreen();
    //         }
    //       },
    //       text: 'View in Full Screen'
    //     }
    //   },
    //   buttons: {
    //     contextButton: {
    //       menuItems:  [
    //         'viewFullscreen',
    //         'printChart',
    //         'separator',
    //         'downloadPNG',
    //         'downloadJPEG',
    //         'downloadPDF',
    //         'downloadSVG',
    //         'separator',
    //         'downloadCSV',
    //         'downloadXLS',
    //       ]
    //     }
    //   }
    // },


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
