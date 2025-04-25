import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrl: './evaluation-list.component.scss'
})
export class EvaluationListComponent implements OnInit{
  evaluationList: any[];
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService
  ){}
  ngOnInit(): void {
    this.getEvaluation()
  };

  getEvaluation() {
    this.apiService.getEvaluations().subscribe(
      (res) => {

        this.evaluationList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
}
