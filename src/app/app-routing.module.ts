import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './Groups/groups/groups.component';
import { IndividualsComponent } from './Individuals/individuals/individuals.component';
import { PoliciesComponent } from './Policies/policies/policies.component';
import { NewPoliciesComponent } from './Policies/new-policies/new-policies.component';
import { AgentsComponent } from './Agents/agents/agents.component';
import { NewAgentsComponent } from './Agents/new-agents/new-agents.component';
import { CarriersComponent } from './Carriers/carriers/carriers.component';
import { IndividualReportsComponent } from "./Reports/individual-reports/individual-reports.component";
import { PolicyReportsComponent } from './Reports/policy-reports/policy-reports.component';
import { NewIndividualComponent } from './Individuals/new-individual/new-individual.component';
import { NewGroupsComponent } from './Groups/new-groups/new-groups.component';
import { NewCarriersComponent } from './Carriers/new-carriers/new-carriers.component';
import { CommissionReportsComponent } from './Reports/commission-reports/commission-reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', component: LoginComponent,
    children: [
      {
        path: '', component: LoginComponent
      },
    ]
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [LoginGuard] },
  { path: 'individuals', component: IndividualsComponent, canActivate: [LoginGuard] },
  { path: 'groups/newGroups', component: NewGroupsComponent, canActivate: [LoginGuard] },
  { path: 'individuals/newIndividual', component: NewIndividualComponent, canActivate: [LoginGuard] },
  { path: 'policies', component: PoliciesComponent, canActivate: [LoginGuard] },
  { path: 'policies/newPolicies', component: NewPoliciesComponent, canActivate: [LoginGuard] },
  { path: 'agents', component: AgentsComponent, canActivate: [LoginGuard] },
  { path: 'agents/newAgents', component: NewAgentsComponent, canActivate: [LoginGuard] },
  { path: 'carriers/newCarriers', component: NewCarriersComponent, canActivate: [LoginGuard] },
  { path: 'carriers', component: CarriersComponent, canActivate: [LoginGuard] },
  { path: 'individualsReports', component: IndividualReportsComponent, canActivate: [LoginGuard] },
  { path: 'policyReports', component: PolicyReportsComponent, canActivate: [LoginGuard] },
  { path: 'commissionReports', component: CommissionReportsComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
