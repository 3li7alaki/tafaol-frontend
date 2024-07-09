import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EvaluationListComponent } from "./evaluation-list/evaluation-list.component";
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
import { AddEvaluationComponent } from "./add-evaluation/add-evaluation.component";
import { EditEvaluationComponent } from "./edit-evaluation/edit-evaluation.component";
import { EvaluationResolver } from "./evaluation.resolver";

@NgModule({
  declarations: [
    EvaluationListComponent,
    AddEvaluationComponent,
    EditEvaluationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: EvaluationListComponent,
      },
      {
        path: "add-evaluation",
        component: AddEvaluationComponent,
      },
      {
        path: "edit-evaluation/:id",
        component: EditEvaluationComponent,
        resolve: {
          evaluation: EvaluationResolver,
        },
      },
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
export class EvaluationModule {}
