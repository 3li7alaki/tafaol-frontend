import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrl: './add-status.component.scss'
})
export class AddStatusComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router
  ) {}
  ngOnInit(): void {
    this.initForm()
  }


  initForm() {
    this.statusForm = this.formBuilder.group({
      name_ar: ["", [Validators.required]],
      name: ["", [Validators.required]],
    });
  }
  get f() {
    return this.statusForm.controls;
  };
  addNationality() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      name_ar: this.f.name_ar.value,
    };
    console.log(body);
    this.apiService.addStatus(body).subscribe(
      (res) => {
        this.loading = false
        console.log(res);
        this.toastr.success(this.translate.instant('statusAddedSuccessfully'));
        this.router.navigate(['/apps/status'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error)
        this.loading = false
        console.log(error);
        this.cdr.detectChanges()
      }
    );
  }
}
