import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuestionsListComponent } from "./questions-list/questions-list.component";
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
import { AddQuestionComponent } from "./add-question/add-question.component";
import { EditQuestionComponent } from "./edit-question/edit-question.component";
import { QuestionsResolver } from "./questions.resolver";

@NgModule({
  declarations: [QuestionsListComponent, AddQuestionComponent, EditQuestionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: QuestionsListComponent,
      },
      {
        path: "add-question",
        component: AddQuestionComponent,
      },
      {
        path : 'edit-question/:id',
        component: EditQuestionComponent,
        resolve: {
          questions : QuestionsResolver
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
export class QuestionsModule {}
