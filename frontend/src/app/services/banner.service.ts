import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PreferenceService} from "./preference.service";
import {GetOnePreferenceDTO} from "../models/preferences/get-one-preference-dto";
import {GetBannerDTO} from "../models/get-banner-dto";
import {AddBannerDTO} from "../models/add-banner-dto";

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private bannerStateSubject: BehaviorSubject<boolean>;

  constructor(private httpClient: HttpClient,
              private preferenceService: PreferenceService) { }


  public getStateAsObservable(): Observable<boolean> {
    return this.bannerStateSubject.asObservable();
  }

  public hideBanner(): void {
    this.setLatestValue(false).subscribe( () => {
      // REST call came back successfully

      // Send a message with false  (to tell anyone listening to hide the banner)
      this.bannerStateSubject.next(false);
    })
  }


  public showBanner(): void {
    this.setLatestValue(true).subscribe( () => {
      // REST call came back successfully

      // Send a message with false  (to tell anyone listening to hide the banner)
      this.bannerStateSubject.next(true);
    })
  }

  public getLatestValueFromBackend(): Observable<GetOnePreferenceDTO> {
    // invoke the preference service to get the show-banner boolean value
    return this.preferenceService.getPreferenceValueWithoutPage("show.banner");
  }

  private setLatestValue(aBannerInfo: boolean): Observable<string> {
    // Use the preference service to set the show-banner boolean value
    return this.preferenceService.setPreferenceValueWithoutPage("show.banner",aBannerInfo);
  }


  public initialize(aBannerInfo: boolean) {
    // Send out a message that (to anyone listening) with the current value
    // Anyone who listens later, gets this initial message
    this.bannerStateSubject = new BehaviorSubject<boolean>(aBannerInfo);
  }


  /*
   * Returns an observable that holds an array of GetBannerDTO objects
   */
  public getListOfBanners(): Observable<GetBannerDTO[]> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/banners/list';

    // Return an observable
    return this.httpClient.get <GetBannerDTO[]>(restUrl);
  }

  /*
   * Returns an observable that adds a banner to the system
   */
  public addBanner(aAddBannerDTO: AddBannerDTO): Observable<string> {
    // Construct the URL for the REST endpoint (so it works in dev and prod mode)
    const restUrl = environment.baseUrl + '/api/banners/add';

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.post(restUrl, aAddBannerDTO, {responseType: 'text'});
  }


  /*
   * Returns an observable that delete a banner to the system
   */
  public deleteBanner(aBannerId: number): Observable<string> {
    // Construct the URL for the REST endpoint (so it works in dev and prod mode)
    const restUrl = environment.baseUrl + `/api/banners/delete/${aBannerId}`;

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.post <string>(restUrl, {});
  }



}
