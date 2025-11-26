import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBatchComponent } from '../Components/add-batch/add-batch.component';
import { ViewBatchComponent } from '../Components/view-batch/view-batch.component';
import { UpdateBatchComponent } from '../Components/update-batch/update-batch.component';
import { DeleteBatchComponent } from '../Components/delete-batch/delete-batch.component';

const routes: Routes = [
  {path:'',component:ViewBatchComponent},
    {path:'viewBatch',component:ViewBatchComponent},
    {path:'addBatch',component:AddBatchComponent},
    {path:'updateBatch/:batchId',component:UpdateBatchComponent},
   {path:'removeBatch/:batchId',component:DeleteBatchComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
