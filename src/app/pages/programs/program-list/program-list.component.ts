import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-program-list",
  templateUrl: "./program-list.component.html",
  styleUrl: "./program-list.component.scss",
})
export class ProgramListComponent implements OnInit {
  programList: any[];
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getPrograms();
  }
  getPrograms() {
    this.apiService.getPrograms().subscribe(
      (res) => {
        console.log(res);
        this.programList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
}
