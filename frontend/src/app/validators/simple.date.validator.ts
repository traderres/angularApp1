import {FormControl, ValidationErrors} from "@angular/forms";

export class SimpleDateValidator {

  private static isWeekend(aDate: Date): boolean {
    let day = aDate.getDay();
    let isWeekend = (day === 6) || (day === 0);    // 6 = Saturday, 0 = Sunday
    return isWeekend;
  }

  /*
   * Custom validator that will er
   */
  public static validateNonWeekendValue(aControl: FormControl): ValidationErrors | null {
    if (aControl.value == null) {
      // There is no value -- so assume that everything is valid
      return null;
    }

    let enteredDate: Date = new Date(aControl.value);
    if (! SimpleDateValidator.isWeekend(enteredDate)) {
      // User entered a date that is on a week-day.  The field is valid.
      return null;
    } else {
      // User entered a date that is on a week-end.  The field is invalid.
      return {'invalid_date_on_weekend': 'The entered date cannot be on a week-end'};
    }
  }


}
