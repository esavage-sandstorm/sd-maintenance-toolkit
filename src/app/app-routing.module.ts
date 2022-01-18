import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientsComponent } from './clients/clients.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: 'clients', component: ClientsComponent},
  { path: 'test', component: TestComponent, runGuardsAndResolvers: 'always'},
  // { path: 'report', component: RecipeEditComponent, runGuardsAndResolvers: 'always'},
  // { path: '', redirectTo: '/clients', pathMatch: 'full' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
 exports: [RouterModule],
})
export class AppRoutingModule { }
