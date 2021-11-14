import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public selectedVisibleControls: FormControl;
  public listOfVisibleCharts: number[] = [1, 2, 3, 4];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Create a form control that lists which controls are visible
    this.selectedVisibleControls = this.formBuilder.control(this.listOfVisibleCharts, null);
  }

}
