import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'detail', component: DetailComponent},
    {path: '', redirectTo: '/register', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingcomponent = [RegisterComponent, DetailComponent];
