import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { take } from "rxjs/operators";
import { Member } from "src/app/_models/member";
import { Message } from "src/app/_models/message";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { MembersService } from "src/app/_services/members.service";
import { MessageService } from "src/app/_services/message.service";
import { PresenceService } from "src/app/_services/presence.service";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"],
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  activeTab:TabDirective;
  messages: Message[] = [];
  user:User;
  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presence:PresenceService,
    private accountService: AccountService,
    private router : Router,
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.member = data.member;
    })
     
    this.route.queryParams.subscribe(params=>{
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
  }
  loadMember() {
    this.memberService
      .getMember(this.route.snapshot.paramMap.get('id'))
      .subscribe((member) => {
        console.log(member);
        this.member = member;
      });
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.id).subscribe(messages=>{
      this.messages = messages;
    })
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user, this.member.id);
    }else{
      this.messageService.stopHubConnection();
    }
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
