import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {SearchQueryDTO} from "../models/search-query-dto";
import {SearchResultDTO} from "../models/search-result-dto";
import {environment} from "../../environments/environment";
import {IServerSideGetRowsParams} from "ag-grid-community";

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  constructor(private httpClient: HttpClient) { }


  /*
  * This method returns an observable to a list of hard-coded SearchResultDTO objects
  */
  public runSearchHardCoded(aSearchQueryDTO: SearchQueryDTO) : Observable<SearchResultDTO[]> {

    if (aSearchQueryDTO.raw_query == '') {
      // The user is searching for an empty string.  SO, return an empty list (and do not invoke the REST call)
      return of([]);
    }

    let result1: SearchResultDTO = new SearchResultDTO();
    result1.id = 1;
    result1.name = "report 1";
    result1.country = "USA";
    result1.start_year = 2010;
    result1.start_date = "01/05/2010";

    let result2: SearchResultDTO = new SearchResultDTO();
    result2.id = 2;
    result2.name = "report 2";
    result2.country = "USA";
    result2.start_year = 2011;
    result2.start_date = "02/11/2011";

    // Return an observable with the list of hard-coded results
    return of( [result1, result2] );
  }


  /*
   * This method returns an observable to a list of SearchResultDTO objects
   * NOTE:  You must subscribe to this observable to activate the REST call
   */
  public runSearch(aSearchQueryDTO: SearchQueryDTO) : Observable<SearchResultDTO[]> {

    if (aSearchQueryDTO.raw_query == '') {
      // The user is searching for an empty string.  SO, return an empty list (and do not invoke the REST call)
      return of([]);
    }


    const restUrl = environment.baseUrl + '/api/search';

    // Return an observable that holds a list of AutoCompleteMatchDTO objects
    return this.httpClient.post <SearchResultDTO[]>(restUrl, aSearchQueryDTO);
  }

  public runSearchGetRows(aParams: IServerSideGetRowsParams): Observable<ISer>
}
