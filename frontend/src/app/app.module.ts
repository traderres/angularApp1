import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddReportComponent } from './reports/add-report/add-report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule, Routes} from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import {WelcomeComponent} from './welcome/welcome.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FileUploadModule} from 'ng2-file-upload';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Chart1Component } from './analytics/chart1/chart1.component';
import { Chart2Component } from './analytics/chart2/chart2.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { UploadReportComponent } from './reports/upload-report/upload-report.component';
import {AgGridModule} from "ag-grid-angular";
import { ViewReportsComponent } from './reports/view-reports/view-reports.component';
import { LongReportComponent } from './reports/long-report/long-report.component';
import { SearchBoxComponent } from './search/search-box/search-box.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { SaveSearchDialogComponent } from './dialogs/save-search-dialog/save-search-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {PageGuard} from "./guards/page.guard";
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { LongPageComponent } from './long-page/long-page.component';
import {ScrollingModule} from "@angular/cdk/scrolling";

const appRoutes: Routes = [
  { path: 'page/addReport',    component: AddReportComponent,  canActivate: [PageGuard] },
  { path: 'page/longReport',   component: LongReportComponent, canActivate: [PageGuard] },
  { path: 'page/viewReports',   component: ViewReportsComponent, canActivate: [PageGuard] },
  { path: 'page/searchResults',   component: SearchResultsComponent, canActivate: [PageGuard] },
  { path: 'page/403',          component: ForbiddenComponent},        // No routes match, so take the user to the "NotFoundComponent"
  { path: 'page/welcome',   component: WelcomeComponent },
  { path: 'page/longPage',  component: LongPageComponent },
  //{ path: '',   redirectTo: 'page/welcome', pathMatch: 'full'},
   { path: '',                    redirectTo: 'page/longPage', pathMatch: 'full' }, // By default, redirect the user to this page (url does change)
   { path: '**',                component: NotFoundComponent}       // No routes match, so take the user to the "NotFoundComponent"
];


@NgModule({
  declarations: [
    AppComponent,
    AddReportComponent,
    NotFoundComponent,
    WelcomeComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    Chart1Component,
    Chart2Component,
    UserNavbarComponent,
    UploadReportComponent,
    ViewReportsComponent,
    LongReportComponent,
    SearchBoxComponent,
    SearchResultsComponent,
    SaveSearchDialogComponent,
    ForbiddenComponent,
    HoverClassDirective,
    LongPageComponent
  ],
  imports: [
    HighchartsChartModule,
    BrowserAnimationsModule,
    BrowserModule,
    AgGridModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    LayoutModule,
    MatProgressBarModule,
    MatListModule,
    FlexLayoutModule,
    MatDialogModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
