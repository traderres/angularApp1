import {AfterContentInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {NavbarService} from "../../services/navbar.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild("leftDiv") leftDiv: ElementRef;   // Used to get the width of left column
  @ViewChild("rightDiv") rightDiv: ElementRef; // used to get the width of right column

  public rightFlexValue: string = "50%";    // Used to set the width of the right column
  public leftFlexValue: string = "50%";     // Used to set the width of the left column
  public showDivider: boolean = true;       // Used to refresh the divider

  public  pdfSrc: string | null = null;           // Has the full path of the pdf file that the viewer will open
  private pdfSrcSampleDirectoryPath: string;      // Holds the url path to get to the assets/sample/ directory


  private secondResize: boolean = false;
  private columnResize: boolean = false;

  private navbarSubscription: Subscription;
  private adjustWidthOffsetForNavbar: number;

  private previousPageWidth: number;
  private previousLeftPageWidth: number;
  private previousRightPageWidth: number;

  constructor(private navbarService: NavbarService) { }


  /*
   * We received a resize event
   *  1) If columnResize==true, then we kicked-off this resize event.  And, we want to ignore it
   *  2) If secondResize==true, then just refresh the divider
   *  3) Else
   *       -- Calculate the left and right divs as *percentages*
   *       -- So, the web page looks good
   */
  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    if (this.columnResize) {
      return;
    }

    if (this.secondResize) {
      this.showDivider = true;
      this.secondResize = false;
      return;
    }

    // Calculate the ratio of the old width to new-width
    let newPageWidth: number = event.target.innerWidth + this.adjustWidthOffsetForNavbar;
    let ratioOfPageWidths: number = newPageWidth / this.previousPageWidth;

    // Calculate the new left and right side iwdths
    let newLeftSideWidth: number = this.previousLeftPageWidth * ratioOfPageWidths;
    let newRightSideWidth: number = this.previousRightPageWidth * ratioOfPageWidths;

    // Set the new widths of the left and right columns
    this.leftFlexValue = String(newLeftSideWidth) + "px";
    this.rightFlexValue = String(newRightSideWidth) + "px";

    // Refresh the divider by hiding it and showing it
    this.showDivider = false;

    // Send a resize event so that the pdf viewer will resize
    setTimeout(() => {
      this.secondResize = true;
      window.dispatchEvent(new Event('resize'));
    }, 1);

    // Store the current page width as (previousPageWidth)
    this.previousLeftPageWidth = newLeftSideWidth;
    this.previousRightPageWidth = newRightSideWidth;
    this.previousPageWidth = newPageWidth;
  }


  public ngAfterContentInit(): void {
    this.previousLeftPageWidth = this.leftDiv.nativeElement.offsetWidth;
    this.previousRightPageWidth = this.rightDiv.nativeElement.offsetWidth;
  }


  public ngOnInit(): void {

    // Setup the path of the sample directory path
    if (environment.production) {
      this.pdfSrcSampleDirectoryPath = "/app1/assets/sample/";
    }
    else {
      this.pdfSrcSampleDirectoryPath = environment.baseUrl + "/assets/sample/";
    }

    // This app-component will listen for messages from the navbarService
    this.navbarSubscription =
      this.navbarService.getNavbarStateAsObservable().subscribe((navbarState) => {
        // We received a message from the navbarService
        // -- Someone has toggled the one of the navbars

        if (navbarState.isAppNavbarDisplayed) {
          // The left-side navbar is visible (so the we need to subtract it from our calculations)
          this.adjustWidthOffsetForNavbar = -200;
        }
        else {
          this.adjustWidthOffsetForNavbar = 0;
        }

        this.previousPageWidth = window.innerWidth + this.adjustWidthOffsetForNavbar;

        this.refreshDivider();

        // Send a resize event so that the pdf viewer will resize
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 1);

      });

  }  // end of ngOnInit()




  public ngOnDestroy(): void {
    if (this.navbarSubscription) {
      this.navbarSubscription.unsubscribe();
    }
  }

  public showSampleFileInPdfViewer(aFilename: string): void {
    // Set the pdfSrc file path
    // NOTE:  IF the pdfSrc file path is valid, then pdf viewer will display the PDF file
    this.pdfSrc = this.pdfSrcSampleDirectoryPath + aFilename;
  }


  public clearPdfViewer(): void {
    this.pdfSrc = null;
  }


  private refreshDivider(): void {
    // Hide the divider
    this.showDivider = false;

    // use setTimeout to show the divider
    // -- Show the divider (which will cause the divider to be placed in the correct spot)
    setTimeout(() => {
      // Show the divider (inside setTimeout, Angular change detection will pick this up)
      this.showDivider = true;

      // Set the columnResize flag to false so that the onResize() method knows to ignore this
      this.columnResize = false;
    }, 1);
  }


  /*
   * The drag-and-drop operation finished
   *
   *  1) Calculate the new width of the left and right columns
   *  2) Set the new widths of the left and right columns
   *  3) Send a resize event (so the pdf-viewer resizes)
   *  4) Show & Hide the divider (so it appears in the correct place)
   */
  public dragEnded(aEvent: CdkDragEnd): void {

    const SMALLEST_LEFT_SIDE_IN_PIXELS: number = 100;
    const SMALLEST_RIGHT_SIDE_IN_PIXELS: number = 325;

    // Get the total number of pixels that were dragged
    let changeInX: number = aEvent.distance.x;

    let oldWidthTotal =  this.leftDiv.nativeElement.offsetWidth + this.rightDiv.nativeElement.offsetWidth;

    // Calculate the new widths of the left and right columns
    let leftSideNewWidth = this.leftDiv.nativeElement.offsetWidth + changeInX;
    let rightSideNewWidth = this.rightDiv.nativeElement.offsetWidth - changeInX;


    if (leftSideNewWidth < SMALLEST_LEFT_SIDE_IN_PIXELS) {
      // The left side is too small.

      // Set the left side=(smallest size) and right side=(what's left)
      leftSideNewWidth = SMALLEST_LEFT_SIDE_IN_PIXELS;
      rightSideNewWidth = oldWidthTotal - leftSideNewWidth;
    }
    else if (rightSideNewWidth < SMALLEST_RIGHT_SIDE_IN_PIXELS) {
      // The right side is too small.

      // Set the right side=(smallest size) and left side=(what's left)
      rightSideNewWidth = SMALLEST_RIGHT_SIDE_IN_PIXELS;
      leftSideNewWidth = oldWidthTotal - rightSideNewWidth;
    }

    // Set the new widths of the left and right columns
    this.leftFlexValue = leftSideNewWidth + "px";
    this.rightFlexValue = rightSideNewWidth + "px";

    // Set columnResize = true (so our own resize listener does nothing)
    this.columnResize = true;

    // Send a resize event so that the pdf viewer will resize
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    // Refresh the divider (so it appears the correct location)
    this.refreshDivider();

  }  // end of dragEnded()

}
