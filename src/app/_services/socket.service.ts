import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {

    private socket = io(SERVER_URL);



}
