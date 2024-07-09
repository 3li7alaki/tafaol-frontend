import { Routes } from "@angular/router";
import { ReportComponent } from "./programs/report/report.component";

const Routing: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "builder",
    loadChildren: () =>
      import("./builder/builder.module").then((m) => m.BuilderModule),
  },
  {
    path: "crafted/pages/profile",
    loadChildren: () =>
      import("../modules/profile/profile.module").then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: "crafted/account",
    loadChildren: () =>
      import("../modules/account/account.module").then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: "crafted/pages/wizards",
    loadChildren: () =>
      import("../modules/wizards/wizards.module").then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: "crafted/widgets",
    loadChildren: () =>
      import("../modules/widgets-examples/widgets-examples.module").then(
        (m) => m.WidgetsExamplesModule
      ),
    // data: { layout: 'light-header' },
  },
  {
    path: "apps/chat",
    loadChildren: () =>
      import("../modules/apps/chat/chat.module").then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: "apps/users",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
  },
  {
    path: "apps/roles",
    loadChildren: () => import("./role/role.module").then((m) => m.RoleModule),
  },
  {
    path: "apps/nationality",
    loadChildren: () =>
      import("./nationality/nationality.module").then(
        (m) => m.NationalityModule
      ),
  },
  {
    path: "apps/permissions",
    loadChildren: () =>
      import("./permission/permission.module").then((m) => m.PermissionModule),
  },
  {
    path: "apps/admin",
    loadChildren: () =>
      import("./admins/admins.module").then((m) => m.AdminsModule),
  },
  {
    path: "apps/gaurdian",
    loadChildren: () =>
      import("./gaurdian/gaurdian.module").then((m) => m.GaurdianModule),
  },
  {
    path: "apps/childrens",
    loadChildren: () =>
      import("./childrens/childrens.module").then((m) => m.ChildrensModule),
  },
  {
    path: "apps/questions",
    loadChildren: () =>
      import("./questions/questions.module").then((m) => m.QuestionsModule),
  },
  {
    path: "apps/evaluation",
    loadChildren: () =>
      import("./evaluation/evaluation.module").then((m) => m.EvaluationModule),
  },
  {
    path: "apps/diagnose",
    loadChildren: () =>
      import("./diagnose/diagnose.module").then((m) => m.DiagnoseModule),
  },
  {
    path: "apps/status",
    loadChildren: () =>
      import("./status/status.module").then((m) => m.StatusModule),
  },
   {
    path: "apps/programs",
    loadChildren: () =>
      import("./programs/programs.module").then((m) => m.ProgramsModule),
  },
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "error/404",
  },
  {
    path:'apps/program-report',
    component: ReportComponent
  }
];

export { Routing };
