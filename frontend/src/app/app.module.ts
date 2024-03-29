import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddReportComponent } from './reports/add-report/add-report.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { WelcomeComponent } from './welcome/welcome.component';
import { ViewReportsComponent } from './reports/view-reports/view-reports.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { NotFoundComponent } from './not-found/not-found.component';
import {RouterModule, Routes} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Chart1Component } from './analytics/chart1/chart1.component';
import { Chart2Component } from './analytics/chart2/chart2.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';

// Setup the routes.  If no route is found, then take the user to the NotFoundComponent
const appRoutes: Routes = [
  { path: 'page/addReport',    component: AddReportComponent },
  { path: 'page/viewReports',  component: ViewReportsComponent },
  { path: 'page/chart1',       component: Chart1Component },
  { path: 'page/chart2',       component: Chart2Component },
  { path: '',                  component: WelcomeComponent},
  { path: '**',                component: NotFoundComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    AddReportComponent,
    WelcomeComponent,
    ViewReportsComponent,
    NotFoundComponent,
    HeaderComponent,
    NavbarComponent,
    Chart1Component,
    Chart2Component,
    UserNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FlexLayoutModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
