import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewQualificationComponent } from './Components/view-qualification/view-qualification/view-qualification.component';
import { AddQualificationComponent } from './Components/add-qualification/add-qualification/add-qualification.component';
import { UpdateQualificationComponent } from './Components/update-qualification/update-qualification/update-qualification.component';
import { RemoveQualificationComponent } from './Components/remove-qualification/remove-qualification/remove-qualification.component';

const routes:Routes = [
  { path: '', component: ViewQualificationComponent },
  { path: 'viewQualification', component: ViewQualificationComponent },
  { path: 'add', component: AddQualificationComponent },
  
  { path: 'edit/:qualificationId', component: UpdateQualificationComponent },
  { path: 'remove/:qualificationId', component: RemoveQualificationComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualificationRoutingModule { }
