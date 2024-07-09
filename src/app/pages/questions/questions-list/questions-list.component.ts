import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrl: './questions-list.component.scss'
})
export class QuestionsListComponent implements OnInit {
  questionsList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showAddQuestion = false;
  showEditQuestion = false;
  showDeleteQuestion = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService
  ){
    if (this.user.type != "super_admin") {
      this.showAddQuestion =
        this.permissionList?.includes("create-questions");
      this.showEditQuestion =
        this.permissionList?.includes("update-questions");
     this.showDeleteQuestion =
        this.permissionList?.includes("delete-questions");
    } else {
      this.showAddQuestion = true;
      this.showEditQuestion = true;
      this.showDeleteQuestion = true;
    }
  }
  ngOnInit(): void {
    this.getQuestions()
  };
  getQuestions(){
    this.apiService.getQuestions().subscribe(
      (res) => {
        console.log(res);
        this.questionsList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  };
  deleteQuestions(id: any) {
    this.apiService.deleteQuestion(id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('questionDeletedSuccessfully'));
        this.getQuestions()
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error);
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
}
