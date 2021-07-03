import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";

import { ReportToCreate } from '../../_models';
import { AccountService, ReportService } from '../../_services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  reportPosts: string[] = [
    'Spam',
    'Nội dung khiêu dâm',
    'Thông tin sai lệch',
    'Quấy rối hoặc vi phạm quyền riêng tư',
    'Vi phạm bản quyền',
    'Nội dung tiêu cực, bạo lực',
    'Phản động',
    'Hàng hoá nguy hiểm, hàng cấm',
  ]

  @ViewChild('reportForm') reportForm: NgForm;

  targetType: number;
  reportType: string;
  detailReport: string;

  public title: string;

  reportToCreate: ReportToCreate;

  maccount = this.accountService.accountValue;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReportComponent>,
    private reportService: ReportService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.targetType = this.data.targetType;

    if(this.targetType == 0){
      this.title = 'người dùng';
    } else if(this.targetType == 1){
      this.title = 'bài viết';
    } else if(this.targetType == 2){
      this.title = 'bình luận';
    }
  }

  sendReport() {
    if(this.reportType == null) return;

    this.reportToCreate = {
      ownerId: this.maccount.id,
      targetType: this.targetType,
      targetId: this.data.postId,
      reportType: this.reportType,
      detail: this.detailReport,
    }
    console.log(this.reportToCreate);

    this.reportService.createReport(this.reportToCreate)
    .subscribe(res => {
      alert('Báo cáo đã được gửi!');
    })

  }

}
