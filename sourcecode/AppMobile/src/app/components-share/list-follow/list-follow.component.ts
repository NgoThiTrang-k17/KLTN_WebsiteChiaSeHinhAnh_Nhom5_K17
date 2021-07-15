/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-trailing-spaces */
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Follow, FollowToCreate } from '../../_models';
import { AccountService, FollowService } from '../../_services';

@Component({
  selector: 'app-list-follow',
  templateUrl: './list-follow.component.html',
  styleUrls: ['./list-follow.component.scss'],
})
export class ListFollowComponent implements OnInit {

  @Input() accountId: number;
  @Input() count: number;
  @Input() isFollower: boolean;

  follow: FollowToCreate;

  public follows: Follow[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    private accountService: AccountService,
    private followService: FollowService,
  ) { }

  ngOnInit() {
    if(this.isFollower===true){
      this.followService.getBySubjectId(this.accountId)
      .subscribe(res =>{
        console.log(res);
        this.follows = res as Follow[];
      });
    } else if(this.isFollower===false){
      this.followService.getByFollowerId(this.accountId)
      .subscribe(res =>{
        console.log(res);
        this.follows = res as Follow[];
      });
    }
  }

  closeModalCmt() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  onCreateFollow(id: number) {
    this.follow = {
      subjectId: id,
    };
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      const follow = this.follows.find( (x: Follow) => {
        if(this.isFollower===true && x.followerId === id){
          x.isFollower_FollowedByCurrentUser = true;
        } else if(this.isFollower===false && x.subjectId === id){
          x.isSubject_FollowedByCurrentUser = true;
        }
      });
      this.follows = this.follows;
    });
  }

  unFollow(id: number) {
    this.followService.delete(id)
    .subscribe(() => {
      const follow = this.follows.find( (x: Follow) => {
        if(this.isFollower===true && x.followerId === id){
          x.isFollower_FollowedByCurrentUser = false;
        } else if(this.isFollower===false && x.subjectId === id){
          x.isSubject_FollowedByCurrentUser = false;
        }
      });
      if(this.isFollower===false && this.accountId === this.maccount.id){
        this.follows = this.follows.filter( x => x.subjectId !== id);
      }
      this.follows = this.follows;
    });

  }

}
