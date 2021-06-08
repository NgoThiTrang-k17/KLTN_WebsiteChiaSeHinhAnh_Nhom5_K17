import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabHomePage } from './tabHome.page';

const routes: Routes = [
  {
    path: '',
    component: TabHomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabHomePageRoutingModule {}
