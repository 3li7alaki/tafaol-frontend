import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
interface forms {
  id: number;
  title: string;
  title_ar: string;
  name: string;
  group: string;
  // other properties
}
@Component({
  selector: "app-edit-program",
  templateUrl: "./edit-program.component.html",
  styleUrl: "./edit-program.component.scss",
})
export class EditProgramComponent implements OnInit {
  id: any;
  program: any;
  programForm: FormGroup;
  loading: boolean = false;
  loadingDelete = false;
  diagnosesList: any[];
  diagnoseSelected: [] = [];
  days: any[] = [
    {
      name_ar: "السبت",
      name: "saturday",
    },
    {
      name_ar: "الأحد",
      name: "sunday",
    },
    {
      name_ar: "الإثنين",
      name: "monday",
    },
    {
      name_ar: "الثلاثاء",
      name: "tuesday",
    },
    {
      name_ar: "الأربعاء",
      name: "wednesday",
    },
    {
      name_ar: "الخميس",
      name: "thursday",
    },
    {
      name_ar: "الجمعة",
      name: "friday",
    },
  ];
  myFiles: any[] = [];
  constructor(
    private rout: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService,
    public translate: TranslateService
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.program = this.rout.snapshot.data.program;
  }
  ngOnInit(): void {
    this.initForm();
    this.apiService.getDiagnoses().subscribe(
      (res) => {
        console.log(res);
        this.diagnosesList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  initForm() {
    console.log(this.program);
    this.programForm = this.formBuilder.group({
      name: [this.program.name, [Validators.required]],
      description: [this.program.description, [Validators.required]],
      startTime: [this.program.start_time, [Validators.required]],
      endTime: [this.program.end_time, [Validators.required]],
      days: [this.program.days, [Validators.required]],
      ministry_registered: [false, [Validators.required]],
      all_diagnoses: [this.program.all_diagnoses, [Validators.required]],
      all_ages: [this.program.all_ages, [Validators.required]],
      active: [this.program.active, [Validators.required]],
      diagnoses: [null],
      max_age_male: [this.program.max_age_male],
      max_age_female: [this.program.max_age_female],
      min_age: [this.program.min_age],
      gender: [this.program.gender],
    });
    this.diagnoseSelected = this.program.diagnoses.map(
      (element: forms) => element.id
    );
    this.myFiles = this.program.attachments;
  }
  get f() {
    return this.programForm.controls;
  }
  addProgram() {
    console.log(this.f.all_diagnoses.value);
    const formData = new FormData();

    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    formData.append("gender", this.f.gender.value);
    formData.append(
      "start_time",
      this.f.startTime.value === this.program.start_time
        ? this.program.start_time
        : this.f.startTime.value + ":00"
    );
    formData.append(
      "end_time",
      this.f.endTime.value === this.program.end_time
        ? this.program.end_time
        : this.f.endTime.value + ":00"
    );

    formData.append(
      "ministry_registered",
      this.f.ministry_registered.value === true ? "1" : "0"
    );
    formData.append(
      "all_diagnoses",
      this.f.all_diagnoses.value === true || 1 ? "1" : "0"
    );
    for (let i = 0; i < this.diagnoseSelected.length; i++) {
      const dia = this.diagnoseSelected[i];
      formData.append(`diagnoses[${i}]`, dia);
    }
    for (let i = 0; i < this.f.days.value.length; i++) {
      formData.append(`days[${i}]`, this.f.days.value[i]);
    }

    formData.append("active", this.f.active.value === true || 1 ? "1" : "0");
    formData.append("all_ages", this.f.all_ages.value === true  || 1? "1" : "0");
    formData.append("max_age_male", this.f.max_age_male.value);
    formData.append("max_age_female", this.f.max_age_female.value);
    formData.append("min_age", this.f.min_age.value);

    this.loading = true;
    console.log(formData);
    this.apiService.editProgram(formData, this.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(
          this.translate.instant("programsEditedSuccessfully")
        );
        this.router.navigate(["/apps/programs"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
  deleteDiagnoses(id: any) {
    this.loadingDelete = true;
    this.apiService.deleteProgram(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("programsDeletedSuccessfully")
        );
        this.loadingDelete = false;
        this.router.navigate(["/apps/programs"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingDelete = false;
        this.toastr.error(error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
}
