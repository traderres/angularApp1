import { Injectable } from '@angular/core';
import {ThemeDTO} from "./models/theme-dto";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private sendThemeSubject: Subject<ThemeDTO>;

  constructor() {
    // Create the subject
    this.sendThemeSubject = new Subject<ThemeDTO>()
  }

  public setNewTheme(aThemeDTO: ThemeDTO): void {
    // Send the message out that a there is a new theme
    this.sendThemeSubject.next(aThemeDTO);
  }

  public listenForMessagesWithNewTheme(): Observable<ThemeDTO> {
    return this.sendThemeSubject.asObservable();
  }


}
