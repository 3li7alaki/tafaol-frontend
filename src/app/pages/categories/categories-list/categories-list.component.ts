import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  categoriesList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showAddCategory = false;
  showEditCategory = false;
  showDeleteCategory = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService
  ){
    if (this.user.type != "super_admin") {
      this.showAddCategory =
        this.permissionList?.includes("create-categories");
      this.showEditCategory =
        this.permissionList?.includes("update-categories");
     this.showDeleteCategory =
        this.permissionList?.includes("delete-categories");
    } else {
      this.showAddCategory = true;
      this.showEditCategory = true;
      this.showDeleteCategory = true;
    }
  }
  ngOnInit(): void {
    this.getCategories()
  };
  getCategories(){
    this.apiService.getCategories().subscribe(
      (res) => {

        this.categoriesList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  };
  deleteCategory(id: any) {
    this.apiService.deleteCategory(id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('categoryDeletedSuccessfully'));
        this.getCategories()
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

        this.cdr.detectChanges();
      }
    );
  }
}
