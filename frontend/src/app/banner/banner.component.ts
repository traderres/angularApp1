import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {GetBannerDTO} from "../models/get-banner-dto";
import {BannerService} from "../services/banner.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(1000, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(0, style({opacity:0}))
      ])
    ])
  ]
})
export class BannerComponent implements OnInit {

  public listOfBannersObs:     Observable<GetBannerDTO[]>;
  public displayedBanner:      GetBannerDTO;
  public showTextForAnimation: boolean = false;

  constructor(private bannerService: BannerService) { }


  public ngOnInit(): void {

    // Initialize the observable
    // NOTE:  The async pipe will subscribe and unsubscribe for us
    this.listOfBannersObs = this.bannerService.getListOfBannersForMainPage().pipe(
      tap( (aData: GetBannerDTO[]) => {
            this.rotateBannerMessages(aData);
      })
    )
  }


  private rotateBannerMessages(aBanners: GetBannerDTO[]) {
    if ((aBanners == null) || (aBanners.length == 0)) {
      // There are no banners to display
      return;
    }
    else if (aBanners.length == 1) {
      // There is a single banner.  So, do not rotate them
      this.displayedBanner = aBanners[0];
      this.showTextForAnimation = true;
    }
    else {
      // There are multiple banners.  So, rotate the banners every 5 seconds

      // Display the 1st banner
      let displayedBannerIndex: number = 0;
      this.displayedBanner = aBanners[displayedBannerIndex];
      this.showTextForAnimation = true;

      // Rotate through the banners
      setInterval( () => {
          displayedBannerIndex++;
          this.displayedBanner = aBanners[displayedBannerIndex];

          // Make this banner disappear and appear
          // NOTE:  Use the setTimeout so that the Angular picks-up the change
          this.showTextForAnimation = false;
          setTimeout( () => {
            this.showTextForAnimation = true;
          });

          if (displayedBannerIndex == (aBanners.length - 1)) {
             displayedBannerIndex = -1;
          }

        }, 5000);  // end of setInterval()

    }
  }  // end of rotateBannerMessages()

}
