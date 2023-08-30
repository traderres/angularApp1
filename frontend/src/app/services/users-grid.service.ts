import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {UsersGridRowDTO} from "../models/users-grid-row-dto";
import {delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersGridService {

  constructor() { }

  public getAllUsers(): Observable<UsersGridRowDTO[]> {

    let data: UsersGridRowDTO[] = [
      { id: 1000, full_name: 'John Smith', 'last_login_date': '06/25/2023 08:05:03'},
      { id: 1002, full_name: 'Jane Smith', 'last_login_date': '06/22/2024 16:45:35'},
      { id: 1004, full_name: 'George Low', 'last_login_date': '06/01/2022 14:36:38'},
    ];

    return of(data);
  }
}
