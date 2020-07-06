import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

function treatAsUTC(date: Date): any {
  let result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function  getDaysBetween(startDate: Date, endDate: Date) {
  let millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}


export function validateStartAndEndDate(aStartDateControlName: string,
                                        aEndDateControlName: string,
                                        aMaxDaysBetween: number): ValidatorFn {

  // This technique is used to pass-in parameters with a custom validator.  The problem is simple:
  //  a) Need to pass-in 3 parameters
  //  b) Need to return a method that takes-in a a single AbstractControl and returns ValidationErrors | null
  //
  // The solution is to use a factory function and return a method
  return (aControl: AbstractControl) : ValidationErrors | null  => {

    // Get a references to the formGroup
    let formGroup: FormGroup = <FormGroup>aControl.parent;
    if (! formGroup) {
      return null;
    }

    // Get references to the start and end date controls
    let startDateControl: AbstractControl | null = formGroup.get(aStartDateControlName);
    let endDateControl: AbstractControl | null = formGroup.get(aEndDateControlName);

    if ((startDateControl?.value == null) || (endDateControl?.value == null)) {
      // There is no start date or end date (so the form is probably initializing).  So, do nothing
      return null;
    }

    let startDate: Date = new Date(startDateControl?.value );
    let endDate: Date = new Date(endDateControl?.value );

    if (startDate >= endDate) {
      return {
        'custom_error' : 'The Start Date must be BEFORE the End Date'
      };
    }

    // Calculate the number of days between the start and end date
    let totalDaysBetween: number = getDaysBetween(startDate, endDate);

    if (totalDaysBetween > aMaxDaysBetween) {
      return {
        'custom_error' : `The End Date must be no more than ${aMaxDaysBetween} days after the Start Date`
      };
    }

    // If no error, then return null
    return null;
  };

}
