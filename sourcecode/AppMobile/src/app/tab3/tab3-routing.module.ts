import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Tab3Page } from './tab3.page';
import { SearchComponent } from './search/search.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { DetailPostPage } from '../tab1/detailPost/detailPost.page';

const routes: Routes = [
  {
    path: '', component: Tab3Page,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: SearchComponent},
      { path: 'history', component: SearchHistoryComponent},
      { path: 'result/:query', component: SearchResultComponent},
      { path: 'detail/:postId/:ownerId', component: DetailPostPage, },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
