import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable, of} from "rxjs";
import {UserInfoDTO} from "../models/user-info-dto";
import {environment} from "../../environments/environment";
import {catchError, map, shareReplay} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  // Internal cache of the userInfo object
  private cachedObservable: Observable<UserInfoDTO> | null = null;

  /*
   * Return an observable that holds an object with information about the user -- e.g., user's name, user's role
   */
  public getUserInfo(): Observable<UserInfoDTO>  {

    if (this.cachedObservable != null) {
      // This observable is in the cache.  So, return it from the cache
      return this.cachedObservable;
    }

    const restUrl = environment.baseUrl + '/api/users/me';


    // Setup this observable so that it calls shareReplay(1) to replay the previous value
    this.cachedObservable = this.httpClient.get <UserInfoDTO>(restUrl).pipe(
      map( (userInfoDTO: UserInfoDTO) => {

        // Convert the userInfoDTO.pageRoutes into a map
        // So that the PageGuard does not have to do it repeatedly
        let mapPageRoutes: Map<string, boolean> = new Map(Object.entries(userInfoDTO.pageRoutes));
        userInfoDTO.pageRoutes = mapPageRoutes;
        return userInfoDTO;
      }),
      shareReplay(1),
      catchError(err => {
        console.error('There was an error getting user info.   Error is ', err);

        // Clear the cache
        this.cachedObservable = null;

        return EMPTY;
      }));

    return this.cachedObservable;
  }



  /*
   * Return an observable that holds an object with information about the user -- e.g., user's name, user's role
   */
  public getUserInfoHardCoded(): Observable<UserInfoDTO>  {

    let userInfo: UserInfoDTO = new UserInfoDTO();

    userInfo.name = 'John Smith';
    userInfo.pageRoutes = new Map<string, boolean>([
      ['page/addReport', false],
      ['page/longReport', true],
      ['page/viewReports', true],
      ['page/searchResults', true]
     ]);


    // Return the hard-coded observable
    return of(userInfo);
  }
}
