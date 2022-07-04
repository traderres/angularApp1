import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-workflow-indicator',
  templateUrl: './workflow-indicator.component.html',
  styleUrls: ['./workflow-indicator.component.css']
})
export class WorkflowIndicatorComponent implements OnInit, AfterViewInit {

  @ViewChild('outerWrapper', { read: ElementRef }) public outerWrapper: ElementRef;

  public currentCenteredIndex: number


  constructor() { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.currentCenteredIndex = 2;

    // Make sure the 2nd item is visible on page load
    let targetId: string = 'step' + this.currentCenteredIndex;
    this.scrollToTargetIdAndKeepTrying(targetId);
  }


  public scrollBoxes(aBoxNumberClickedOn: number): void {
    if (aBoxNumberClickedOn > this.currentCenteredIndex) {
      this.goForwards();
    }
    else if (aBoxNumberClickedOn < this.currentCenteredIndex) {
      this.goBackwards();
    }
  }


  private goBackwards(): void {

    if (this.currentCenteredIndex <= 2) {
      // Showing the far left or 2nd left element.  So, set currentIndex to 2nd and stop here
      this.currentCenteredIndex=2;
    }
    else {
      // In the middle and user wishes to go backwards
      this.currentCenteredIndex = this.currentCenteredIndex - 1;


      // Scroll backwards
      this.outerWrapper.nativeElement.scrollTo(
        {
          left:      (this.outerWrapper.nativeElement.scrollLeft - 165),
          behavior: 'smooth'
        });
    }

  }


  private goForwards(): void {

    if (this.currentCenteredIndex >= 9) {
      // Showing far right or 2nd right element.  So, est the current index to 2nd last value
      this.currentCenteredIndex=9;
    }
    else {
      // In the middle and user wishes to go forwards
      this.currentCenteredIndex = this.currentCenteredIndex + 1;

      // Scroll forwards
      this.outerWrapper.nativeElement.scrollTo(
        {
          left:      (this.outerWrapper.nativeElement.scrollLeft + 165),
          behavior: 'smooth'
        });
    }

  }




  /*
   * Scroll the target and keep trying
   */
  public scrollToTargetIdAndKeepTrying(aElementId: string): void {

    const TOTAL_ATTEMPTS: number = 100;
    let totalAttemptsTried: number = 0;

    let intervalFunction = setInterval(() => {
      totalAttemptsTried++;

      // Get a reference to the DOM element
      const el: HTMLElement|null = document.getElementById(aElementId);

      if (el) {
        // The DOM element exists.  So, scroll to it.

        setTimeout(() =>
          el.scrollIntoView({behavior: 'smooth', inline: 'nearest'}), 0);

        // Clear the interval
        clearInterval(intervalFunction);
      }
      else if (totalAttemptsTried >= TOTAL_ATTEMPTS) {
        clearInterval(intervalFunction);
        return;
      }


    }, 10);

  }

  public goToChartPage(): void {
    console.log('Take user to full-size chart page');
  }

}
