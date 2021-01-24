import { Component, OnInit } from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {MessageService} from "../../services/message.service";


const backendUploadUrl =  environment.baseUrl + '/api/reports/upload';

@Component({
  selector: 'app-upload-report',
  templateUrl: './upload-report.component.html',
  styleUrls: ['./upload-report.component.css']
})
export class UploadReportComponent implements OnInit {

  // Make sure the itemAlias matches the @RequestParam(value = "file" in the REST endpoint
  // Set the queueLimit to be 1 to allow single file uploads only
  public uploader: FileUploader = new FileUploader({url: backendUploadUrl,
                                                            queueLimit: 1,
                                                            itemAlias: 'file'});

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
      console.log('File uploaded:  item=', item, '  status=', status, '  response=', response, '  headers=', headers);

      // Send a message to the user letting him know if it worked
      let message = " status=" + status + "   response=" + response;
      this.messageService.sendMessage(message);
    };

    this.uploader.onProgressItem = (progress: any) => {
      console.log('progress=', progress['progress']);
    };

  }

}
