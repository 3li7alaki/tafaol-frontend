import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-program",
  templateUrl: "./add-program.component.html",
  styleUrl: "./add-program.component.scss",
})
export class AddProgramComponent implements OnInit {
  programForm: FormGroup;
  loading: boolean = false;
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
  courseType: any[];
  myFiles: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService,
    public translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.apiService.getDiagnoses().subscribe(
      (res) => {

        this.diagnosesList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  initForm() {
    this.programForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      days: [null, [Validators.required]],
      ministry_registered: [false, [Validators.required]],
      all_diagnoses: [false, [Validators.required]],
      all_ages: [false, [Validators.required]],
      active: [true, [Validators.required]],
      diagnoses: [null],
      max_age_female: [""],
      max_age_male: [""],
      min_age: [""],
      gender: ["all"],
    });
  }
  get f() {
    return this.programForm.controls;
  }

  addProgram() {
    
    const formData = new FormData();

    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    formData.append("gender", this.f.gender.value);
    formData.append("start_time", this.f.startTime.value + ':00');
    formData.append("end_time", this.f.endTime.value+ ':00');

    formData.append(
      "ministry_registered",
      this.f.ministry_registered.value === true ? "1" : "0"
    );
    formData.append(
      "all_diagnoses",
      this.f.all_diagnoses.value === true ? "1" : "0"
    );
    for (let i = 0; i < this.diagnoseSelected.length; i++) {
      const dia = this.diagnoseSelected[i];
      formData.append(`diagnoses[${i}]`, dia);
    }
    for (let i = 0; i < this.f.days.value.length; i++) {
      formData.append(`days[${i}]`, this.f.days.value[i]);
    }

    formData.append("active", this.f.active.value === true ? "1" : "0");
    formData.append("all_ages", this.f.all_ages.value === true ? "1" : "0");
    formData.append("max_age_male", this.f.max_age_male.value);
    formData.append("max_age_female", this.f.max_age_female.value);
    formData.append("min_age", this.f.min_age.value);

    this.loading = true;

    this.apiService.addProgram(formData).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(
          this.translate.instant("programsEditedSuccessfully")
        );
        this.router.navigate(["/apps/programs"]);
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
