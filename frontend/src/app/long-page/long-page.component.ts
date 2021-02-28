import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-long-page',
  templateUrl: './long-page.component.html',
  styleUrls: ['./long-page.component.css']
})
export class LongPageComponent implements OnInit {

  public fixedSizeData = Array(10000).fill(50);


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
