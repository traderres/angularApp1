import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  public selectedVisibleControls: FormControl;
  public listOfVisibleCharts: number[] = [1, 2, 3];
  private selectedVisibleControlsSubscription: Subscription;
  public disableGridDragDrop: boolean = false;


  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    // Create a form control that lists which controls are visible
    this.selectedVisibleControls = this.formBuilder.control(this.listOfVisibleCharts, null);

    this.selectedVisibleControlsSubscription = this.selectedVisibleControls.valueChanges.subscribe((arrayOfSelectedValues: number[]) => {
      // User selected some values in the multi-select dropdown

      // Tell the *ngFor loop to re-render the components
      //   1) set the listOfVisibleCharts to be empty
      //   2) use setTimeout to set the listOfVisibleCharts to hold the new array
      //      This causes components to be re-rendered in the updated *ngFor loop
      this.listOfVisibleCharts = [ ];
      setTimeout( () => {
        this.listOfVisibleCharts = arrayOfSelectedValues;
      });

    })
  }



  public ngOnDestroy(): void {
    if (this.selectedVisibleControlsSubscription) {
      this.selectedVisibleControlsSubscription.unsubscribe();
    }
  }


  public drop(aEvent: CdkDragDrop<number[]>) {
    // Re-order the array
    moveItemInArray(this.listOfVisibleCharts, aEvent.previousIndex, aEvent.currentIndex);
  }


  public userChangedDragAndDropMode(aNewDragMode: number) {
    if (aNewDragMode == 10) {
      // User selected to enable chart drag & drop
      this.disableGridDragDrop = false;
    }
    else if (aNewDragMode == 11) {
      // User selected to enable Grid drag & drop  (so disable the cdk drag and drop)
      this.disableGridDragDrop = true;
    }
  }


}

