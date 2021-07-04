import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { ProfileRoutingModule } from './profile-routing.module';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';
import { ListFollowerDialogComponent } from './listFollower-dialog.component';
import { ListFollowingDialogComponent } from './listFollowing-dialog.component'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    MatDialogModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    DetailsComponent,
    UpdateComponent,
    ListFollowerDialogComponent,
    ListFollowingDialogComponent
  ],
  entryComponents: [ListFollowerDialogComponent],
})
export class ProfileModule { }
