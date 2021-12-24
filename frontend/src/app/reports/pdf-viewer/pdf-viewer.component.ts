import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  public  pdfSrc: string | null = null;       // Has the path of the pdf file that the viewer will open
  private pdfSrcSampleDirectoryPath: string;   // Holds the url path to get to assets/sample


  constructor() { }


  public ngOnInit(): void {

    // Setup the path of the sample directory path
    if (environment.production) {
      this.pdfSrcSampleDirectoryPath = "/app1/assets/sample/";
    }
    else {
      this.pdfSrcSampleDirectoryPath = environment.baseUrl + "/assets/sample/";
    }

  }  // end of ngOnInit()


  public clearPdfViewer(): void {
    this.pdfSrc = null;
  }

  public showSampleFileInPdfViewer(aFilename: string): void {
    // Set the pdfSrc file path
    // NOTE:  IF the pdfSrc file path is valid, then pdf viewer will display the PDF file
    this.pdfSrc = this.pdfSrcSampleDirectoryPath + aFilename;
  }


}
