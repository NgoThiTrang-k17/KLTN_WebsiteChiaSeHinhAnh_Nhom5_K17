import { Component, OnInit } from '@angular/core';

import {  } from '../_models';
import { PresenceService } from '../_services';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  public notificationCount: number;

  constructor(
    public presenceService: PresenceService,
  ) {}

  ngOnInit(){
  }

}
