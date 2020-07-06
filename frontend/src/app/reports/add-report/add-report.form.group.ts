import {FormGroup, Validators} from "@angular/forms";
import {SimpleDateValidator} from "../../validators/simple.date.validator";
import {validateStartAndEndDate} from "../../validators/custom.date.validator";
import {CustomFormControl} from "../../validators/custom.form.control";

export class AddReportFormGroup extends FormGroup {

  public constructor() {
    super({
        name: new CustomFormControl("Report Name", "name", null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25)
          ])),

        priority: new CustomFormControl("Priority", "priority", null,
          Validators.required),

        source: new CustomFormControl("Source", "source", null, null),
        authors: new CustomFormControl("Authors", "authors", null, null),

        start_date: new CustomFormControl("Start Date", "start_date", null,
                      Validators.compose([
                          Validators.required,
                          SimpleDateValidator.validateNonWeekendValue,
                        validateStartAndEndDate('start_date', 'end_date', 7)
                    ])),

        end_date: new CustomFormControl("End Date", "end_date", null,
                      Validators.compose( [
                        Validators.required,
                        SimpleDateValidator.validateNonWeekendValue,
                        validateStartAndEndDate('start_date', 'end_date', 7)
                      ]))

      }
    )

  }


  public get formControls(): CustomFormControl[] {
    return Object.keys(this.controls)
      .map(key => this.controls[key] as CustomFormControl)
  }


  public getAllValidationMessages() : string[] {
    let messages: string[] = [];

    this.formControls.forEach(c => c.getValidationMessages()
      .forEach(m => messages.push(m))
    );

    return messages;
  }
}
