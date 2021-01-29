import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveSearchDialogFormData} from "../dialogs/save-search-dialog/save-search-dialog.component";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }


  public addSearch(aFormData: SaveSearchDialogFormData): Observable<any> {
    // Construct the DTO that has the information this REST call needs
    let addSearchDTO = {

      page_name:        "Search Results",
      display_name:      aFormData.name,
      is_default_search: aFormData.is_default,
      grid_state:        null
    }

    const restUrl = environment.baseUrl + '/api/user/search';

    // Return an observable
    return this.httpClient.post <Response>(restUrl, addSearchDTO);
  }
}
