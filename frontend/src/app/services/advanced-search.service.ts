import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {RecentSearchDTO} from "../models/recent-search-dto";

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  constructor() { }

  public getRecentSearches(): Observable<RecentSearchDTO[]> {
    let data: RecentSearchDTO[] = [
      {
        id: 1,
        createdDate: '01/13/2023 15:42:53',
        query: 'john smith'
      },
      {
        id: 2,
        createdDate: '01/11/2023 14:21:00',
        query: '1.2.3.4'
      },
      {
        id: 3,
        createdDate: '01/11/2023 14:20:53',
        query: 'jane smith'
      },
    ];

    return of(data);
  }


}
