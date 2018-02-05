import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from '../environments/environment';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { ChatComponent } from './chat/chat.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { UserItemComponent } from './user-item/user-item.component';
import { MessageComponent } from './message/message.component';

import { AuthenticationService } from './_services/users.service';
import { SocketService } from './_services/socket.service';
import { SessionUserService } from './_services/session-user.service';
import { AuthGuard } from './_guards/auth.guard';

import { GroupService } from './_services/group.service';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserPageComponent,
    GroupItemComponent,
    ChatComponent,
    MessageComponent,
    CreateGroupComponent,
    UserItemComponent,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthenticationService,
    SessionUserService,
    SocketService,
    AuthGuard,
    GroupService,
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
