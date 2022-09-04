import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetExceptionInfoDTO} from "../models/get-exception-info-dto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor(private httpClient: HttpClient) { }

  public getListOfExceptions(aFilterNumber: number): Observable<GetExceptionInfoDTO[]> {
    // Construct the URL to the REST endpoint that returns a list of exceptions
    const restUrl = environment.baseUrl + '/api/admin/get-exceptions/' + aFilterNumber;

    // Return an observable that will hold a list of GetExceptionInfoDTO objects
    return this.httpClient.get <GetExceptionInfoDTO[]>(restUrl);
  }

}
