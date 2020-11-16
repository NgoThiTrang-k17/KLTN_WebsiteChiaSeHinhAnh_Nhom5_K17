import { AuthService } from './../_services/_auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  temp: any;
  login: boolean;
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {
   }

  ngOnInit(): void {
  }
  auth = () => {
    return this.authService.loggedin();
  }
}
