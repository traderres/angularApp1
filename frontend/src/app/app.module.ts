import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddReportComponent } from './reports/add-report/add-report.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AddReport2Component } from './reports/add-report2/add-report2.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ErrorDialogComponent } from './errorHandler/error-dialog/error-dialog.component';
import {ErrorInterceptor} from "./errorHandler/error.interceptor";
import { EditReportComponent } from './reports/edit-report/edit-report.component';
import {FileUploadModule} from "ng2-file-upload";
import { UploadReportComponent } from './reports/upload-report/upload-report.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { LongViewInnerReportComponent } from './reports/long-view-inner-report/long-view-inner-report.component';
import { LongViewOuterReportComponent } from './reports/long-view-outer-report/long-view-outer-report.component';
import { LongViewInternalNavReportComponent } from './reports/long-view-internal-nav-report/long-view-internal-nav-report.component';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { HighchartsChartModule } from 'highcharts-angular';
import { UsaMapComponent } from './analytics/usa-map/usa-map.component';
import {ChartDrillDownComponent} from "./analytics/chart-drill-down/chart-drill-down.component";
import { BannerComponent } from './banner/banner.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { SearchBoxComponent } from './search/search-box/search-box.component';
import { SearchBoxDetailsComponent } from './search/search-box-details/search-box-details.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import {PageGuard} from "./guards/page.guard";
import {Constants} from "./utilities/constants";
import {AgGridModule} from "ag-grid-angular";
import { ReportGridViewComponent } from './reports/report-grid-view/report-grid-view/report-grid-view.component';
import { PriorityCellCustomRendererComponent } from './reports/report-grid-view/priority-cell-custom-renderer/priority-cell-custom-renderer.component';
import { ReportGridActionCellRendererComponent } from './reports/report-grid-view/report-grid-action-cell-renderer/report-grid-action-cell-renderer.component';
import { UpdatePriorityDialogComponent } from './reports/report-grid-view/update-priority-dialog-component/update-priority-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {QuillModule} from "ngx-quill";
import { ReportSubmitMarkdownComponent } from './reports/report-submit-markdown/report-submit-markdown.component';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import { PdfViewerComponent } from './reports/pdf-viewer/pdf-viewer.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import { ThemeChangerMenuComponent } from './theme-changer-menu/theme-changer-menu.component';
import {MatTabsModule} from "@angular/material/tabs";
import { TabGroupComponent } from './tab-group/tab-group.component';
import { ServerSideGridComponent } from './reports/server-side-grid/server-side-grid.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';
import { TabHistoryComponent } from './tab-history/tab-history.component';
import { GridPageComponent } from './analytics/dashboard2/grid-page/grid-page.component';
import { DashboardLayoutComponent } from './analytics/dashboard2/dashboard-layout/dashboard-layout.component';
import { UsaMapPageComponent } from './analytics/dashboard2/usa-map-page/usa-map-page.component';
import { UsaMapLittleComponent } from './analytics/dashboard2/usa-map-little/usa-map-little.component';
import { GridLittleComponent } from './analytics/dashboard2/grid-little/grid-little.component';
import { BarChartLittleComponent } from './analytics/dashboard2/bar-chart-little/bar-chart-little.component';
import {BarChartPageComponent} from "./analytics/dashboard2/bar-chart-page/bar-chart-page.component";
import { UserAcknowledgeDialogComponentComponent } from './dialogs/user-acknowledge-dialog-component/user-acknowledge-dialog-component.component';
import {UserAcknowledgeGuard} from "./guards/user-acknowledge.guard";
import { GridTabGroupPageComponent } from './analytics/grid-tab-group/grid-tab-group-page/grid-tab-group-page.component';
import { CriticalReportsGridComponent } from './analytics/grid-tab-group/critical-reports-grid/critical-reports-grid.component';
import { AllReportsGridComponent } from './analytics/grid-tab-group/all-reports-grid/all-reports-grid.component';
import { EditDetailsPageComponent } from './analytics/grid-tab-group/edit-details-page/edit-details-page.component';
import { CriticalReportsActionRendererComponent } from './analytics/grid-tab-group/critical-reports-action-renderer/critical-reports-action-renderer.component';
import { UserIsLoggedOutDialogComponent } from './dialogs/user-is-logged-out-dialog/user-is-logged-out-dialog.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { DerivativeDropdownsComponent } from './reports/derivative-dropdowns/derivative-dropdowns.component';
import { ListExceptionsGridComponent } from './admin/list-exceptions-grid/list-exceptions-grid.component';
import { ManageBannersGridComponent } from './admin/manage-banners/manage-banners-grid/manage-banners-grid.component';
import {AddBannerDialogComponent} from "./admin/manage-banners/add-banner-dialog/add-banner-dialog.component";
import {DeleteBannerDialogComponent} from "./admin/manage-banners/delete-banner-dialog/delete-banner-dialog.component";
import { ManageBannersGridActionRendererComponent } from './admin/manage-banners/manage-banners-grid-action-renderer/manage-banners-grid-action-renderer.component';
import { AdvancedSearchDialogComponent } from './dialogs/advanced-search/advanced-search-dialog/advanced-search-dialog.component';

// Setup the routes.  If no route is found, then take the user to the NotFoundComponent
const appRoutes: Routes = [
  { path: Constants.ADD_REPORTS_ROUTE,    component: AddReportComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.REPORTS_GRID_VIEW_ROUTE,    component: ReportGridViewComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.ADD_REPORTS2_ROUTE,    component: AddReport2Component,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.VIEW_REPORTS_ROUTE,  component: ViewReportsComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.DASHBOARD_ROUTE,    component: DashboardComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.USA_MAP_ROUTE,      component: UsaMapComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.CHART_DRILLDOWN_ROUTE,   component: ChartDrillDownComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.LONGVIEW_INTERNAL_NAV_REPORT + ':id',  component: LongViewInternalNavReportComponent ,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.EDIT_REPORT_ROUTE +':id', component: EditReportComponent ,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.SEARCH_DETAILS_ROUTE + 'id', component: SearchBoxDetailsComponent ,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.UPLOAD_REPORT_ROUTE, component: UploadReportComponent ,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.CHART1_ROUTE,       component: Chart1Component,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.CHART2_ROUTE,       component: Chart2Component,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.LONGVIEW_REPORT,     component: LongViewOuterReportComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.REPORT_SUBMIT_MARKDOWN,    component: ReportSubmitMarkdownComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.REPORT_PDFVIEWER_ROUTE,         component: PdfViewerComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.TAB_GROUP_ROUTE,   component: TabGroupComponent, canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.SERVER_SIDE_GRID_ROUTE,   component: ServerSideGridComponent, canActivate: [UserAcknowledgeGuard, PageGuard] },

  { path: Constants.DASHBOARD_BAR_CHART_PAGE,   component: BarChartPageComponent, canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.DASHBOARD_USA_MAP_PAGE,   component: UsaMapPageComponent, canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.DASHBOARD_GRID_PAGE,   component: GridPageComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },
  { path: Constants.DASHBOARD_LAYOUT_ROUTE,   component: DashboardLayoutComponent,  canActivate: [UserAcknowledgeGuard, PageGuard] },

  { path: Constants.GRID_TAB_GROUP_ROUTE + ':startingTab',   component: GridTabGroupPageComponent, canActivate: [PageGuard] },
  { path: Constants.GRID_TAB_GROUP_EDIT_DETAILS_ROUTE + ':id',   component: EditDetailsPageComponent, canActivate: [PageGuard] },
  { path: Constants.DERIVATIVE_DROPDOWNS_ROUTE,   component: DerivativeDropdownsComponent },
  { path: Constants.LIST_EXCEPTIONS_ROUTE,   component: ListExceptionsGridComponent, canActivate: [PageGuard] },
  { path: Constants.MANAGE_BANNERS_ROUTE,   component: ManageBannersGridComponent, canActivate: [PageGuard] },

  { path: Constants.FORBIDDEN_ROUTE,     component: ForbiddenComponent },
  { path: '',                  component: DashboardLayoutComponent,  canActivate: [UserAcknowledgeGuard] },
  { path: '**',                component: NotFoundComponent}
];

// @ts-ignore
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
    UserNavbarComponent,
    AddReport2Component,
    ErrorDialogComponent,
    EditReportComponent,
    UploadReportComponent,
    LongViewInnerReportComponent,
    LongViewOuterReportComponent,
    LongViewInternalNavReportComponent,
    DashboardComponent,
    UsaMapComponent,
    ChartDrillDownComponent,
    BannerComponent,
    SearchBoxComponent,
    SearchBoxDetailsComponent,
    ForbiddenComponent,
    ReportGridViewComponent,
    PriorityCellCustomRendererComponent,
    ReportGridActionCellRendererComponent,
    UpdatePriorityDialogComponent,
    ReportSubmitMarkdownComponent,
    PdfViewerComponent,
    ThemeChangerMenuComponent,
    TabGroupComponent,
    ServerSideGridComponent,
    TimelineComponent,
    TimelineItemComponent,
    TabHistoryComponent,
    GridLittleComponent,
    GridPageComponent,
    DashboardLayoutComponent,
    UsaMapLittleComponent,
    UsaMapPageComponent,
    BarChartLittleComponent,
    BarChartPageComponent,
    UserAcknowledgeDialogComponentComponent,
    GridTabGroupPageComponent,
    CriticalReportsGridComponent,
    AllReportsGridComponent,
    EditDetailsPageComponent,
    CriticalReportsActionRendererComponent,
    UserIsLoggedOutDialogComponent,
    PhoneMaskDirective,
    DerivativeDropdownsComponent,
    ListExceptionsGridComponent,
    ManageBannersGridComponent,
    AddBannerDialogComponent,
    DeleteBannerDialogComponent,
    ManageBannersGridActionRendererComponent,
    AdvancedSearchDialogComponent
  ],
  imports: [
    AppRoutingModule,
    AgGridModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FileUploadModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    NgxExtendedPdfViewerModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
