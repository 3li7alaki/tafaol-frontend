import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import {PdfExportUtil} from "../../../util/pdf-export.util";
import {ExcelExportUtil} from "../../../util/excel-export.util";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrl: "./report.component.scss",
})
export class ReportComponent implements OnInit {
  // Define Arabic locale for the component
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService,
    public translate: TranslateService,
    private localeService: BsLocaleService
  ) {
    // Define and use Arabic locale for this component
    defineLocale('ar', arLocale);
    this.localeService.use('ar');
  }
  @ViewChild('reportTable') reportTable: ElementRef;

  filterForm: FormGroup;
  isVisiable = true;
  isLoading = false;
  programList: any;
  statusList: any;
  history: any;
  filtered: any;
  fromDate: any;
  toDate: any;
  lastSort: string;


  ngOnInit(): void {
    this.getPrograms();
    this.getStatus();
    this.iniateForm();
  }

  iniateForm() {
    this.filterForm = this.formBuilder.group({
      program_id: [""],
      status_id: [""],
    });
  }
  getPrograms() {
    this.apiService.getPrograms().subscribe(
      (res) => {

        this.programList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  getStatus() {
    this.apiService.getStatus().subscribe(
      (res) => {

        this.statusList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  getReport() {
    this.isLoading = true;
    const body = {
      status_id: this.f.status_id.value == "" ? null : this.f.status_id.value,
      program_id: this.f.program_id.value == "" ? null : this.f.program_id.value,
    };
    this.apiService.getProgramReport(body).subscribe(
      (data: any) => {
        this.isLoading = false;

        this.history = data;
        this.filtered = data;
        this.fromDate = null;
        this.toDate = null;
        this.lastSort = '';
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.isLoading = false;
      }
    );
  }

  get f() {
    return this.filterForm.controls;
  }

  search(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value
    if (input) {
      this.filtered = this.filtered.filter((item: any) => {
        return (
            item.full_name.toLowerCase().includes(input.toLowerCase()) ||
            (item.cpr?.toLowerCase().includes(input.toLowerCase()) && input.length > 4) ||
            item.child_programs.id.toString().includes(input.toLowerCase())
        );
      });
    } else {
      this.filtered = this.history;
    }
  }

  dateFrom(date: any) {
    if (date) {
      this.filtered = this.history.filter((item: any) => {
        let created_at = new Date(item.child_programs.created_at).setHours(0,0,0,0);
        let input = new Date(date).setHours(0, 0, 0, 0)
        this.fromDate = new Date(input)
        let before = this.toDate ? new Date(created_at) <= this.toDate : true;
        return (
            new Date(created_at) >= new Date(input) && before
        );
      });
    } else {
      this.filtered = this.history;
      this.fromDate = null;
    }
  }

  dateTo(date: any) {
    if (date) {
      this.filtered = this.history.filter((item: any) => {
        let created_at = new Date(item.child_programs.created_at).setHours(0,0,0,0);
        let input = new Date(date).setHours(0, 0, 0, 0);
        this.toDate = new Date(input);
        let after =this.fromDate ? new Date(created_at) >= this.fromDate : true;
        return (
            new Date(created_at) <= new Date(input) && after
        );
      });
    } else {
      this.filtered = this.history;
        this.toDate = null;
    }
  }

  sort(header: string) {
    if (!this.filtered || this.filtered.length === 0) {
        return;
    }
    if (this.lastSort === header) {
        this.filtered = this.filtered.reverse();
        return;
    }
    switch (header) {
      case 'full_name':
        this.filtered = this.filtered.sort((a: any, b: any) => a.full_name.localeCompare(b.full_name));
        break;
      case 'program_id':
        this.filtered = this.filtered.sort((a: any, b: any) => a.child_programs.id - b.child_programs.id);
        break;
      case 'cpr':
        this.filtered = this.filtered.sort((a: any, b: any) => a.cpr - b.cpr);
        break;
      case 'program':
        this.filtered = this.filtered.sort((a: any, b: any) => a.program.name.localeCompare(b.program.name));
        break;
      case 'apply_date':
        this.filtered = this.filtered.sort((a: any, b: any) => a.child_programs.created_at.localeCompare(b.child_programs.created_at));
        break;
      case 'age_applied':
        this.filtered = this.filtered.sort((a: any, b: any) => a.age_applied - b.age_applied);
        break;
      case 'age':
        this.filtered = this.filtered.sort((a: any, b: any) => a.age - b.age);
        break;
      case 'phone_number':
        this.filtered = this.filtered.sort((a: any, b: any) => a.guardian?.phone.localeCompare(b.guardian?.phone));
        break;
      case 'status':
        this.filtered = this.filtered.sort((a: any, b: any) => a.status.name_ar.localeCompare(b.status.name_ar));
        break;
    }
    this.lastSort = header;
  }

  exportToPdf() {
    if (!this.filtered || this.filtered.length === 0) {
        this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
        return;
    }
    try {
      const tableElement = document.querySelector('table');
      if (!tableElement) {
        this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
        return;
      }

      this.isLoading = true;
      PdfExportUtil.exportToPdf(
            Array.from(tableElement.querySelectorAll('tr')).map((row) => {
                return Array.from(row.querySelectorAll('td')).map((cell) => cell.innerText);
            }),
            Array.from(tableElement.querySelectorAll('th')).map((cell) => cell.innerText),
            'report.pdf'
      );
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.toastr.error(this.translate.instant('EXPORT.ERROR'));
      console.error('PDF export error:', error);
    }
  }

  exportToExcel() {
    if (!this.filtered || this.filtered.length === 0) {
        this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
        return;
    }
    try {
      const tableElement = document.querySelector('table');
      if (!tableElement) {
        this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
        return;
      }

      this.isLoading = true;
      const success = ExcelExportUtil.exportToExcel(
            Array.from(tableElement.querySelectorAll('tr')).map((row) => {
                return Array.from(row.querySelectorAll('td')).map((cell) => cell.innerText);
            }),
            Array.from(tableElement.querySelectorAll('th')).map((cell) => cell.innerText),
            'report.xlsx',
            'report'
      );
      
      if (!success) {
        this.toastr.error(this.translate.instant('EXPORT.ERROR'));
      }
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.toastr.error(this.translate.instant('EXPORT.ERROR'));
      console.error('Excel export error:', error);
    }
  }
}
