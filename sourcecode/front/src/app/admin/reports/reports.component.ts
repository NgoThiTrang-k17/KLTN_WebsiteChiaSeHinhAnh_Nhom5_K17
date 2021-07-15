import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Report } from '../../_models';
import { ReportService } from '../../_services';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})
export class ReportsComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public reports: any[];

  constructor(
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 25, 50, 75, 100],
      processing: true,
      language: {
        search: "Tìm kiếm:",
        info: "Đang hiển thị dòng _START_ tới dòng _END_ trong tổng số _TOTAL_ mục",
        emptyTable: "Không có dữ liệu",
        // info: "Hiển thị _START_ tới _END_ của _TOTAL_ dữ liệu",
        infoEmpty: "Hiển thị 0 tới 0 của 0 dữ liệu",
        lengthMenu: "Hiển thị _MENU_ dữ liệu",
        loadingRecords: "Đang tải...",
        paginate: {
          first: "Đầu tiên",
          last: "Cuối cùng",
          next: "Sau",
          previous: "Trước"
        },
      },
    };

    this.reportService.getAll()
    .pipe(first())
    .subscribe(res => {
      console.log(res);

      this.reports = res as Report[];
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  deleteReport(id: number) {
    var r = confirm("Are you sure you want to delete this report?");
    if(r)
    {
      try {
        const report = this.reports.find(x => x.id === id);
        // report.isDeleting = true;
        this.reportService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.reports = this.reports.filter(x => x.id !== id)
        });
      } catch (e) {
        this.reports = this.reports.filter(x => x.id !== id)
        console.log(e);
      }
    }
  }

}
