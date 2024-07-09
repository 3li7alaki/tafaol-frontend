import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListComponent } from './admin-list/admin-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule, ModalsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { ToastrModule } from 'ngx-toastr';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { AdminResolver } from './admin.resolver';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [AdminListComponent, AddAdminComponent, EditAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: AdminListComponent,
      },
      {
        path: "add-admin",
        component: AddAdminComponent,
      },
      {
        path: "edit-admin/:id",
        component: EditAdminComponent,
        resolve : {admin : AdminResolver}
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
    ModalModule.forRoot(),
  ]
})
export class AdminsModule { }
