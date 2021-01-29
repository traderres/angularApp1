import { Component, OnInit } from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private navbarService: NavbarService)
  {}

  ngOnInit(): void {
  }

  public toggleAppNavbar(): void {
    // Send a message to the navbarService (to tell it to toggle)
    this.navbarService.toggleAppNavbar();
  }

  public toggleUserNavbar(): void {
    this.navbarService.toggleUserNavbar();
  }

  public downloadHelp(): void {
    const url = environment.baseUrl + '/api/help';
    window.open(url);
  }
}
