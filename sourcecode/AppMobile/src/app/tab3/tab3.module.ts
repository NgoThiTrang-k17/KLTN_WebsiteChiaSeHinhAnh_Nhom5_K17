import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module';
import { SearchComponent } from './search/search.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [
    Tab3Page,
    SearchComponent,
    SearchHistoryComponent,
    SearchResultComponent
  ],
  providers: [
    FileTransfer
  ]
})
export class Tab3PageModule {}
