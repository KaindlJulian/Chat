import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ChatComponent } from './chat/chat.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddUserComponent } from './add-user/add-user.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-page', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'chat/:name', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'group-add/:name', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'createGroup', component: CreateGroupComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
