import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-long-report',
  templateUrl: './long-report.component.html',
  styleUrls: ['./long-report.component.css']
})
export class LongReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public scrollToTarget(aTarget: string): void {
    // Get a reference to the HTML element
    const el: HTMLElement|null = document.getElementById(aTarget);

    // Use the setTimeout to call the scrollIntoView
    if (el) {
      setTimeout(() =>
        el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'}), 0);
    }
  }

}
