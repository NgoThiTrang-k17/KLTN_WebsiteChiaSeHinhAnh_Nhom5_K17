import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  @ViewChild('inputSearch') inputSearch;

  public search: boolean;
  str: string;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.search = false;
  }

  onSearch() {
    this.search = true;
    this.router.navigate(['history'], { relativeTo: this.route });
    setTimeout(()=>{
      this.inputSearch.setFocus();
    },150);
  };

  unSearch() {
    this.search = false;
    this.router.navigate(['tab/tabs/search']);
  };

  starSearch(event) {
    if(this.str==='') { return; }
    this.str = event.target.value;
    this.router.navigate(['result/'+ this.str], { relativeTo: this.route });
  }


}
