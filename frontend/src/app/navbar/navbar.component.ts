import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {

  public reportsNavGroupClosed: boolean = true;
  public analyticsGroupClosed: boolean = true;
  private routeSubscription: Subscription;


  constructor(private router: Router) {
    this.routeSubscription =  router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // The user has navigated to a different page (or opened a new browser to that page)

      if ((event.url == '/page/addReport') || (event.url == '/page/viewReports') ) {
        // User is going to one of the Report navbar pages
        this.analyticsGroupClosed = true;
        this.reportsNavGroupClosed = false;
      }
      else if ((event.url == '/page/chart1') || (event.url == '/page/chart2') ) {
        // User is going to one of the Analytics navbar pages
        this.analyticsGroupClosed = false;
        this.reportsNavGroupClosed = true;
      }
    });
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }




  public toggleNavGroup(aNavGroupNumber: number) {
    if (aNavGroupNumber == 1) {
      // User clicked on the Reports navgroup (so hide the other navgroup)
      this.analyticsGroupClosed = true;

      // Toggle the Reports navgroup (So, it switches from opened to close)(
      this.reportsNavGroupClosed = ! this.reportsNavGroupClosed;
    }
    else if (aNavGroupNumber == 2) {
      // User clicked on the Analytics navgroup (so hide the other navgroups)
      this.reportsNavGroupClosed = true;

      // Toggle the Analytics navgroup
      this.analyticsGroupClosed = ! this.analyticsGroupClosed;
    }
  }
}
