import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-tabs-overview',
    templateUrl: './tabs-overview.component.html'
})
export class TabsOverviewComponent {
    test(a){
        console.log(a.index)
    }
}