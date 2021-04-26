import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalRService } from './signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignalRService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  informationMessage = 'Waitting...';
  constructor (private signalRService: SignalRService){

  }
  ngOnInit(): void{
    this.signalRService.information.subscribe(message=>{
      console.log(message);
      this.informationMessage = message;
    })
  }
}
