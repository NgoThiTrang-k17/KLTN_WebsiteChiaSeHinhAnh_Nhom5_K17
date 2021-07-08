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
      pageLength: 2,
      lengthMenu : [5, 10, 25, 50, 75, 100],
      processing: true
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
