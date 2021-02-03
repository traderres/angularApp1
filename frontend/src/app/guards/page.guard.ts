import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";
import {UserInfoDTO} from "../models/user-info-dto";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate {


  constructor(private router: Router,
              private userService: UserService)
  { }


  /*
   * Determines if the user proceeds to the next.routeUrl or is redirected to 403
   */
  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.userService.getUserInfo().pipe(
      map((userInfoDTO: UserInfoDTO) => {

        // Get the next url from the routeConfig
        let nextUrl: string | undefined = next.routeConfig?.path;
        if (! nextUrl) {
          return false;
        }

        // Check if the url is allowed
        let routeAllowed: boolean | undefined = userInfoDTO.pageRoutes.get(nextUrl);
        if (! routeAllowed) {
          this.router.navigate(['page/403']).then();

          // Return false so that the router will not route the user to the new page
          return false;
        }


        // The route is allowed.  So, proceed
        return true;
      }));

  }

}
