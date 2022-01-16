import {Component, OnInit} from '@angular/core';
import {ThemeService} from "../services/theme.service";
import {Observable} from "rxjs";
import {ThemeOptionDTO} from "../models/theme-option-dto";
import {first} from "rxjs/operators";
import {PreferenceService} from "../services/preference.service";
import {Constants} from "../utilities/constants";

@Component({
  selector: 'app-theme-changer-menu',
  templateUrl: './theme-changer-menu.component.html',
  styleUrls: ['./theme-changer-menu.component.css']
})
export class ThemeChangerMenuComponent implements OnInit {

  public selectedThemeName: string;
  public themeOptionsObs: Observable<ThemeOptionDTO[]>;


  constructor(private themeService: ThemeService,
              private preferenceService: PreferenceService) {
    this.themeOptionsObs = this.themeService.getThemeOptions();

    // This component is initializing.  So, get the *frst* value from the themeService
    // (so we can show the correct radio button pre-selected)
    this.themeService.getThemeStateAsObservable().pipe(
      first()).subscribe( (aNewTheme: ThemeOptionDTO) => {
      // We got a first value from the theme service

      // Use that initial value to set the selected theme name (so the radio button is selected in the html)
      this.selectedThemeName = aNewTheme.themeName;
    });
  }

  ngOnInit(): void {
  }


  /*
   * The user selected to change the theme
   */
  public changeTheme(aNewThemeOption: ThemeOptionDTO) {
    // Invoke a REST call to set the new theme name

    this.preferenceService.setPreferenceValueWithoutPage(Constants.THEME_PREFERENCE_NAME, aNewThemeOption.themeName).subscribe(() => {
      // The REST call finished successfully

      // Store the selected-theme-name (so we can show the correct radio button)
      this.selectedThemeName = aNewThemeOption.themeName;

      // Tell the theme service to change the theme (the themeService will send a message to other components)
      this.themeService.setTheme(aNewThemeOption);
    });

  }  // end of changeTheme()

}
