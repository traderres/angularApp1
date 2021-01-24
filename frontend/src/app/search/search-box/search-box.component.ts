import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  public searchTextBox: FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  runSearch() {

    const searchQuery: string = this.searchTextBox.value;

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "query": searchQuery
      }
    };

    // We have to call navigateByUrl and
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
      // This is needed to ensure that the search results page gets reloaded (if needed)
      this.router.navigate(['/page/searchResults'], navigationExtras).then(() =>{} )
    });
  }
}
