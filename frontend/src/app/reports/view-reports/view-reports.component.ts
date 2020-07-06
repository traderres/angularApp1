import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {

  public columnDefs = [
    {field: 'id' ,        headerName: 'Id',           sortable: true, filter: 'agNumberColumnFilter'},
    {field: 'name',       headerName: 'Report Name',  sortable: true, filter: true},
    {field: 'priority',   headerName: 'Priority',     sortable: true},
    {field: 'start_date', headerName: 'Start Date',   sortable: true, filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function(filterLocalDateAtMidnight: any, cellValue: any) {
          let dateAsString = cellValue;
          if (dateAsString == null) return -1;
          let dateParts = dateAsString.split('/');
          let cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0])
          );
          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
            return 0;
          }
          else if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          else {
            return 0;
          }
        },
        browserDatePicker: true,
      },
    },
    {field: 'end_date',   headerName: 'End Date',     sortable: true}
  ];

  public rowData = [
    { id: 1, name: 'Report 1', priority: 'low', 'start_date': '05/01/2019', 'end_date': '05/05/2019'},
    { id: 2, name: 'Report 2', priority: 'medium', 'start_date': '06/01/2019', 'end_date': '06/06/2019'},
    { id: 3, name: 'Report 3', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 4, name: 'Report 4', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 5, name: 'Report 5', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 6, name: 'Report 6', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 7, name: 'Report 7', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 8, name: 'Report 8', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id: 9, name: 'Report 9', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'},
    { id:10, name: 'Report 10', priority: 'high', 'start_date': '07/01/2019', 'end_date': '07/07/2019'}
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
