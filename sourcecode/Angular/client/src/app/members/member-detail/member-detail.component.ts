import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Member } from "src/app/_models/member";
import { MembersService } from "src/app/_services/members.service";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"],
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    console.log(this.member);

    this.loadMember();
  }
  loadMember() {
    this.memberService
      .getMember(this.route.snapshot.paramMap.get('id'))
      .subscribe((member) => {
        console.log(member);
        this.member = member;
      });
  }
}
