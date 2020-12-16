import { Component } from '@angular/core';
import { AuthService } from '../_services/_auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ templateUrl: 'navhome.component.html' })
export class NavHomeComponent { 
    temp: any;
    login: boolean;
    constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {
    }
    
    auth = () => {
        return this.authService.loggedin();
    }
}