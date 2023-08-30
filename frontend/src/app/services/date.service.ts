import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private DATE_OF_ONE_YEAR_AGO   = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  private DATE_OF_SIX_MONTHS_AGO = new Date(new Date().setMonth(new Date().getMonth() - 6))

  constructor() { }


  public calculateGridRowClass(aLastLoginDate: string): string {
    if (!aLastLoginDate) {
      // There is no login date
      return '';
    }

    let loginDateAsDate: Date = new Date(aLastLoginDate);

    if (loginDateAsDate > this.DATE_OF_ONE_YEAR_AGO) {
      // login date is over 1 year old
      return 'user-login-over-1-year-ago'
    }
    else if (loginDateAsDate > this.DATE_OF_SIX_MONTHS_AGO) {
      // Login date is between 6 months and 12 months old
      return 'user-login-over-6-months-ago'
    }
    else {
      // Login date is between 0 and 6 months old
      return 'user-login-less-6-months-ago'
    }
  }
}
