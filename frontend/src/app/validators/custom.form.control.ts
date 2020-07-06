import {FormControl} from "@angular/forms";

export class CustomFormControl extends FormControl {
  label: string;
  modelProperty: string;

  public constructor(aLabel: string, aModelProperty: string, aValue: any, aValidator: any) {
    super(aValue, aValidator);

    this.label = aLabel;
    this.modelProperty = aModelProperty
  }


  public getValidationMessages() {
    let messages: string[] = [];

    if (this.errors) {
      for (let errorName in this.errors) {
        switch(errorName) {
          case "required":
            messages.push(`The ${this.label} is required`);
            break;

          case "minlength":
            messages.push(`The ${this.label} must be at least ${this.errors['minlength'].requiredLength} characters`);
            break;

          case "maxlength":
            messages.push(`The ${this.label} must not exceed ${this.errors['maxlength'].requiredLength} characters`);
            break;

          case "pattern":
            messages.push(`The ${this.label} contains illegal characters`);
            break;

          case "invalid_date_on_weekend":
            messages.push(`The ${this.label} cannot be on a week-end.`);
            break;

          case "custom_error":
            // This is a custom error from a custom validator (so display the custom error message)
            messages.push(this.errors.custom_error);
            break;

        } // end switch
      }
    }

    return messages;
  }

}
