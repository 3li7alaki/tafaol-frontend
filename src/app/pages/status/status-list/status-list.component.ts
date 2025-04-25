import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-status-list",
  templateUrl: "./status-list.component.html",
  styleUrl: "./status-list.component.scss",
})
export class StatusListComponent implements OnInit {
  statusList: any[];
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate : TranslateService
  ) {}

  ngOnInit(): void {
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
}
