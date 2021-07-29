import { Component, OnInit, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountService, NotificationService, SearchService, FollowService, PresenceService, MessageService } from '../_services';
import { Account, Notification, NotificationToUpdate, Post, Follow, FollowToCreate, Message } from '../_models';
import { SearchComponent } from './search/search.component';
import { MessageComponent } from './message/message.component';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent implements OnInit {
  @ViewChild('searchInput') searchElement: ElementRef;
  maccount = this.accountService.accountValue;
  modalRef: any;
  modalMessRef :any;
  temp: any;
  login: boolean;
  null = false;
  returnURL: any;
  notificationCount: number;

  public countMess: number;

  public follow: FollowToCreate;
  public mfollow: Follow;
  public account: Account;

  public posts: Post[] = [];
  public notification: NotificationToUpdate;
  public notifications: Notification[] = [];

  constructor(
    private accountService: AccountService,
    public notificationService: NotificationService,
    private followService: FollowService,
    public presenceService: PresenceService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private modalService: NgbModal,
  ) {
    this.accountService.account.subscribe(x => this.account = x);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.accountService.getById(this.maccount.id)
    .subscribe((res:any)=>{
        this.maccount = res;
    })

    this.notificationService.getNotificationCount(this.maccount.id)
    .subscribe((res:any)=>{
      this.notificationCount = res;
    })

    this.messageService.getMessageCount()
    .subscribe((res:any) => {
      this.countMess = res;
    })

    this.presenceService.notificationThread$
    .pipe()
    .subscribe(notifications => {
    })

  }

  onCreateFollow(id:any) {
    this.follow = {
      subjectId: id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      console.log(res);
      //alert('Follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  updateNotification(id:any, status: number){

    this.presenceService.updateNotificationStatus(id, status);

    this.notification = {
      status: 2,
    }

    this.notificationService.update(id ,this.notification)
    .pipe(first())
    .subscribe(res => {
      console.log(res);
      this.notificationCount--;
    }, error => {
      console.log(error);
    })
  }

  logout() {
    this.accountService.logout();
  }

  // SEARCH
  save(event) {
    this.modalRef.close();
    var str = event.target.value;
    if(str=='') { return; }
    this.router.navigate(['search/'+ str], { relativeTo: this.route });
  }

  onSearch(){
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);
    this.modalRef = this.modalService.open(SearchComponent, { windowClass: 'modalSearch', backdropClass: 'backdropModalSearch'});
  }

  // MESS
  openMess() {
    this.modalMessRef = this.modalService.open(MessageComponent, { windowClass: 'modalMess', backdropClass: 'backdropModalMess'});
  }

  resetCountMess() {
    this.presenceService.resetCountNewMess();
  }

  goHomeUser(){
    this.router.navigate(['admin/user']);
  }

  goAdmin(){
    this.router.navigate(['admin']);
  }
}
