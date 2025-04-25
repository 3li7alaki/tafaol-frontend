import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-status",
  templateUrl: "./add-status.component.html",
  styleUrl: "./add-status.component.scss",
})
export class AddStatusComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  statusList: any;
  program: any;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {

    this.program = JSON.parse(localStorage.getItem("oneChildProgram")!);
  }
  ngOnInit(): void {
    this.getStatus();
    this.initForm();
  }

  initForm() {
    this.statusForm = this.formBuilder.group({
      old_status_id: [null, [Validators.required]],
      new_status_id: [null, [Validators.required]],
      date: [""],
      note: [""],
    });
  }
  get f() {
    return this.statusForm.controls;
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
  };

  addGaurd() {
    this.loading = true;
    const body = {
      old_status_id: this.f.old_status_id.value,
      new_status_id: this.f.new_status_id.value,
      date: this.datePipe.transform(this.f.date.value, 'yyyy-MM-dd'),
      note: this.f.note.value,
    };

    this.apiService.addChildStatus(body, this.program.id).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(this.translate.instant("statusAddedSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
