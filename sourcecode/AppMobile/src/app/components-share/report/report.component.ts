/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { ReportToCreate } from '../../_models';
import { AccountService, ReportService } from '../../_services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  reportAccounts: string[] = [
    'Giả mạo',
    'Quấy rối',
    'Đăng nội dung không phù hợp',
    'Đây là tài khoản của tôi',
  ];

  reportPosts: string[] = [
    'Spam',
    'Nội dung khiêu dâm',
    'Thông tin sai lệch',
    'Quấy rối hoặc vi phạm quyền riêng tư',
    'Vi phạm bản quyền',
    'Nội dung tiêu cực, bạo lực',
    'Phản động',
    'Hàng hoá nguy hiểm, hàng cấm',
  ];

  reportComments: string[] = [
    'Spam',
    'Nội dung khiêu dâm',
    'Thông tin sai lệch',
    'Nội dung tiêu cực, bạo lực',
    'Hàng hoá nguy hiểm, hàng cấm',
  ];

  @ViewChild('reportForm') reportForm: NgForm;
  @Input() targetId: any;
  @Input() targetType: number;

  public title: string;
  public reportType: string;
  public detailReport: string;

  reportToCreate: ReportToCreate;

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    private accountService: AccountService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.detailReport = '';

    if(this.targetType === 0){
      this.title = 'người dùng';
      this.accountService.getById(this.targetId)
      .subscribe(res => {
        this.targetId = res.id;
      });
    } else if(this.targetType === 1){
      this.title = 'bài viết';
    } else if(this.targetType === 2){
      this.title = 'bình luận';
    }
  }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  sendReport() {
    if(this.reportType == null){
      return;
    };

    this.reportToCreate = {
      ownerId: this.maccount.id,
      targetType: this.targetType,
      targetId: this.targetId,
      reportType: this.reportType,
      detail: this.detailReport.toString(),
    };
    console.log(this.reportToCreate);

    this.reportService.createReport(this.reportToCreate)
    .subscribe(res => {
      this.closeModal();
    });
  }

}
