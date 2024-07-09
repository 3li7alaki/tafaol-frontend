import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { ApiService } from "src/app/services/api.service";

@Injectable({
  providedIn: "root",
})
export class DiagnosesResolver implements Resolve<boolean> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get("id");
    return this.apiService.getOneDiagnose(id);
  }
  constructor(private apiService: ApiService) {}
}
