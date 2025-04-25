import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoleService } from 'src/app/services/auth/role.service';

@Injectable({
  providedIn: 'root'
})
export class RolesResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    return this.apiService.getOneRole(id);
  }
  constructor(
    private apiService: RoleService) { }
  
  
  
  
}
