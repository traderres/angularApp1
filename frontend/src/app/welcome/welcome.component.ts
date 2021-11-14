import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Subscription} from "rxjs";


import * as Highcharts from "highcharts";
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
import {DashboardDataDTO} from "../models/dashboard-data-dto";
import {DashboardService} from "../services/dashboard.service";
import {Chart} from "highcharts";
HC_drillDown(Highcharts);


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public  selectedVisibleControls: FormControl;
  public  listOfVisibleCharts: number[] = [1, 2, 3, 4];
  private selectedVisibleControlsSubscription: Subscription;
  public  disableGridDragDrop: boolean = false;
  private pageIsInitialized: boolean = false;
  public  dataIsLoading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private dashboardService: DashboardService) {
  }

  public ngOnInit(): void {
    // Create a form control that lists which controls are visible
    this.selectedVisibleControls = this.formBuilder.control(this.listOfVisibleCharts, null);

    this.selectedVisibleControlsSubscription = this.selectedVisibleControls.valueChanges.subscribe((arrayOfSelectedValues: number[]) => {
      // User selected some values inj the multi-select dropdown

      // Change the public list of numbers (which causes charts to appear/disappear)
      this.listOfVisibleCharts = arrayOfSelectedValues;

      if (this.pageIsInitialized) {
        // Render the charts (if they are set as visible)
        this.reloadData()
      }
    })
  }

  public ngOnDestroy(): void {
    if (this.selectedVisibleControlsSubscription) {
      this.selectedVisibleControlsSubscription.unsubscribe();
    }
  }


  public ngAfterViewInit(): void {
    // Reload chart data
    // NOTE:  This call must be in ngAfterContentInit() and not in ngOnInit()
    this.reloadData();

    this.pageIsInitialized = true;
  }

  public drop(aEvent: CdkDragDrop<number[]>) {
    // Re-order the array
    moveItemInArray(this.listOfVisibleCharts, aEvent.previousIndex, aEvent.currentIndex);
  }


  public userChangedDragAndDropMode(aNewDragMode: number) {
    if (aNewDragMode == 10) {
      // User selected to enable chart drag & drop
      this.disableGridDragDrop = false;
    } else if (aNewDragMode == 11) {
      // User selected to enable Grid drag & drop  (so disable the cdk drag and drop)
      this.disableGridDragDrop = true;
    }
  }




  public reloadData(): void {
    this.dataIsLoading = true;

    // Run this code in setInterval() so the code is executed after angular does a refresh
    // NOTE:  the ms wait does not matter
    let intervalFunction = setInterval(() => {

       this.dashboardService.getAllChartData().subscribe((aData: DashboardDataDTO) => {
           // The REST call came back with data
            if (this.listOfVisibleCharts.includes(1)) {
              // Set the data for chart 1 and *render* chart 1
              this.chartOptions1.series[0].data = aData.chartData1;
              Highcharts.chart('chart1', this.chartOptions1);
            }

            if (this.listOfVisibleCharts.includes(2)) {
              this.chartOptions2.series = aData.chartData2;
              Highcharts.chart('chart2', this.chartOptions2);
            }


      }).add(() => {
        // REST call finally block

        // Redraw all charts on this page (so they fit perfectly in the <mat-card> tags)
        Highcharts.charts.forEach(function (chart: Chart | undefined) {
          chart?.reflow();
        });

        this.dataIsLoading = false;

        // Whether the REST endpoint worked or not, clear the interval
        clearInterval(intervalFunction);
      });

    }, 1);

  } // end of reloadData()





  private chartOptions1: any = {
    credits: {
      enabled: false        // Hide the highcharts.com label
    },
    caption: {
      text: ''
    },
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Pending Case Distribution'
    },
    subtitle: {
      text: ''
    },
    accessibility: {
      announceNewData: {
        enabled: true
      },
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      series: {
        enableMouseTracking: true,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>value: {point.y}'
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> or <b>{point.percentage:.1f}%</b> of total<br/>'
    },
    series: [
      {
        panning: false,
        dragDrop: {
          draggableY: false,
          draggableX: false
        },
        name: "Browsers",
        colorByPoint: true,
        data: [],

        point:{
          events:{
            click: (event: any) => {
              this.logPointInfo(event)
            }
          }
        }

      }
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems:  [
            'viewFullscreen',
            'printChart',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
            'separator',
            'downloadCSV',
            'downloadXLS'
          ]
        }
      }
    },

    annotations: [{
      labels: [{
        point: 'max',
        text: 'Max'
      }],
      draggable: ""
    }]

  };


  public logPointInfo(event: any): void {
    console.log('name=' + event.point.name + '  x=' + event.point.x + '  y=' + event.point.y + '  percent=' + event.point.percentage);
  }

  // Chart 2 is a bar chart2
  private chartOptions2: any = {
    chart: {
      type: 'column'   // Uuse type:'bar' for horizontal chart.  Use type:'column' for vertical bar chart
    },
    credits: {
      enabled: false        // Hide the highcharts.com label
    },
    title: {
      text: 'Case Timeliness of Closes Cases (Days)'
    },
    xAxis: {
      categories: ['0-30', '31-60', '61-90', '91-120', '121-150', '151-180', '181-210', '211-240', '241-270', '271-300', '301+']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Cases'
      }
    },
    legend: {
      reversed: false
    },
    plotOptions: {
      series: {
        enableMouseTracking: true,
        stacking: 'normal'
      }
    },

    series: [],
    exporting: {
      buttons: {
        contextButton: {
          menuItems:  [
            'viewFullscreen',
            'printChart',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
            'separator',
            'downloadCSV',
            'downloadXLS'
          ]
        }
      }
    }
  };



}
