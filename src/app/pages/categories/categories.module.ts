import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesListComponent } from "./categories-list/categories-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { InlineSVGModule } from "ng-inline-svg-2";
import { ToastrModule } from "ngx-toastr";
import { WidgetsModule, ModalsModule } from "src/app/_metronic/partials";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { EditCategoryComponent } from "./edit-category/edit-category.component";
import { CategoriesResolver } from "./categories.resolver";

@NgModule({
  declarations: [CategoriesListComponent, AddCategoryComponent, EditCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: CategoriesListComponent,
      },
      {
        path: "add-category",
        component: AddCategoryComponent,
      },
      {
        path : 'edit-category/:id',
        component: EditCategoryComponent,
        resolve: {
          category : CategoriesResolver
        }
      }
    ]),
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    TranslateModule,
    WidgetsModule,
    ModalsModule,
    InlineSVGModule,
    ToastrModule,
  ],
})
export class CategoriesModule {}
