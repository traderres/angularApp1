import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {UserInfoDTO} from "../models/user-info-dto";
import {environment} from "../../environments/environment";




@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  /*
  * Return an observable that holds an object with information about the user -- e.g., user's name, user's role
  */
  public getUserInfo(): Observable<UserInfoDTO>  {

    const restUrl = environment.baseUrl + '/api/user/me';

    return this.httpClient.get <UserInfoDTO>(restUrl);
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
