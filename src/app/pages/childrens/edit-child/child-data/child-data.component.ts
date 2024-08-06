import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-child-data",
  templateUrl: "./child-data.component.html",
  styleUrl: "./child-data.component.scss",
})
export class ChildDataComponent implements OnInit {
  children: any;
  childrenForm: FormGroup;
  nationalityList: any[];
  loading = false;
  selectedFileMother: File;
  imageUrlMother: string;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  id : any
  myFiles: any[] = [];
  sMsg: string = "";
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.children = JSON.parse(localStorage.getItem("extraDetailsChild")!);
    this.id = JSON.parse(localStorage.getItem("children")!).id;
  }
  ngOnInit(): void {
    
    this.apiService.getNationalites().subscribe(
      (res) => {
        console.log(res);
        this.nationalityList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    );
    this.initForm()
  }
  initForm() {
    this.childrenForm = this.formBuilder.group({
      father_name: [this.children?.father_name],
      father_job: [this.children?.father_job],
      father_nationality_id: [this.children?.father_nationality_id],
      father_phone: [this.children?.father_phone?.replace('973', ''),],
      father_work_phone: [this.children?.father_work_phone],
      mother_name: [this.children?.mother_name],
      mother_job: [this.children?.mother_job],
      mother_nationality_id: [this.children?.mother_nationality_id],
      mother_phone: [this.children?.mother_phone?.replace('973', '')],
      mother_work_phone: [this.children?.mother_work_phone],
      house_phone: [this.children?.house_phone],
      close_person_phone: [this.children?.close_person_phone],
      siblings_count: [this.children?.siblings_count],
      sibling_order: [this.children?.sibling_order],
      father_age_at_birth: [this.children?.father_age_at_birth],
      mother_age_at_birth: [this.children?.mother_age_at_birth],
      parent_relation: [this.children?.parent_relation],
      pregnancy_issue: [this.children?.pregnancy_issue],
      birth_issue: [this.children?.birth_issue],
      familial_issue: [this.children?.familial_issue],
      heart_check: [this.children?.heart_check],
      heart_check_date: [this.children?.heart_check_date],
      heart_check_result: [this.children?.heart_check_result],
      thyroid_check: [this.children?.thyroid_check],
      thyroid_check_date: [this.children?.thyroid_check_date],
      thyroid_check_result: [this.children?.thyroid_check_result],
      sight_check: [this.children?.sight_check],
      sight_check_date: [this.children?.sight_check_date],
      sight_check_result: [this.children?.sight_check_result],
      hearing_check: [this.children?.hearing_check],
      hearing_check_date: [this.children?.hearing_check_date],
      hearing_check_result: [this.children?.hearing_check_result],
      epileptic: [this.children?.epileptic],
      breathing_issues: [this.children?.breathing_issues],
      teeth_issues: [this.children?.teeth_issues],
      surgeries_done: [this.children?.surgeries_done],
      exams_applied: [this.children?.exams_applied],
      problems_faced: [this.children?.problems_faced],
      training_needed: [this.children?.training_needed],
      other: [this.children?.other],
    });
    this.imageUrlNationalID = this.children?.father_national_id;
    this.imageUrlMother = this.children?.mother_national_id;
  }
  get f() {
    return this.childrenForm.controls;
  }
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlNationalID = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  onFileSelectedNationalMother(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileMother = file;
    // Create a FileReader object to read the file contents
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlMother = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }

  editChild() {
    const formData = new FormData();

    // Log the FormData object to the console
    formData.append("father_name", this.f.father_name.value);
    formData.append("father_job", this.f.father_job.value);
    formData.append(
      "father_nationality_id",
      this.f.father_nationality_id.value
    );
    formData.append("father_phone",
        this.f.father_phone.value
            ? '973' + this.f.father_phone.value
            : "");
    formData.append("father_work_phone", this.f.father_work_phone.value);
    formData.append("mother_name", this.f.mother_name.value);
    formData.append("mother_job", this.f.mother_job.value);
    formData.append(
      "mother_nationality_id",
      this.f.mother_nationality_id.value
    );
    formData.append("mother_phone",
        this.f.mother_phone.value
            ? '973' + this.f.mother_phone.value
            : "");
    formData.append("mother_work_phone", this.f.mother_work_phone.value);
    formData.append("house_phone", this.f.house_phone.value);
    formData.append("close_person_phone", this.f.close_person_phone.value);
    formData.append("siblings_count", this.f.siblings_count.value);
    formData.append("sibling_order", this.f.sibling_order.value);
    formData.append("father_age_at_birth", this.f.father_age_at_birth.value);
    formData.append("mother_age_at_birth", this.f.mother_age_at_birth.value);
    formData.append("parent_relation", this.f.parent_relation.value);
    formData.append("pregnancy_issue", this.f.pregnancy_issue.value);
    formData.append("birth_issue", this.f.birth_issue.value);
    formData.append("familial_issue", this.f.familial_issue.value);
    formData.append(
      "heart_check",
      this.f.heart_check.value === true ? "1" : "0"
    );
    formData.append(
      "heart_check_date",
      this.datePipe.transform(this.f.heart_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("heart_check_result", this.f.heart_check_result.value);
    formData.append(
      "thyroid_check",
      this.f.thyroid_check.value === true ? "1" : "0"
    );
    formData.append(
      "thyroid_check_date",
      this.datePipe.transform(this.f.thyroid_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("thyroid_check_result", this.f.thyroid_check_result.value);
    formData.append(
      "sight_check",
      this.f.sight_check.value === true ? "1" : "0"
    );
    formData.append(
      "sight_check_date",
      this.datePipe.transform(this.f.sight_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("sight_check_result", this.f.sight_check_result.value);
    formData.append(
      "hearing_check",
      this.f.hearing_check.value === true ? "1" : "0"
    );
    formData.append(
      "hearing_check_date",
      this.datePipe.transform(this.f.hearing_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("hearing_check_result", this.f.hearing_check_result.value);

    if (this.selectedFileMother != null) {
      formData.append("mother_national_id", this.selectedFileMother);
    }
    if (this.selectedFileNationalID != null) {
      formData.append("father_national_id", this.selectedFileNationalID);
    }

    formData.append("epileptic", this.f.epileptic.value);
    formData.append("breathing_issues", this.f.breathing_issues.value);
    formData.append("teeth_issues", this.f.teeth_issues.value);

    formData.append("surgeries_done", this.f.surgeries_done.value);
    formData.append("exams_applied", this.f.exams_applied.value);
    formData.append("problems_faced", this.f.problems_faced.value);
    formData.append("training_needed", this.f.training_needed.value);
    formData.append("other", this.f.other.value);

    this.loading = true;
    let put = !!this.children.id;
    this.apiService.editChildrenData(formData, this.id, put).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("childEditedSuccessfully"));
        this.router.navigate(["/apps/childrens"]);
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

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
