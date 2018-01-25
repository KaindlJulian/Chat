import { Injectable } from '@angular/core';
import { Group } from '../_models/group';

@Injectable()
export class GroupService {

  private group: Group;

  constructor() { }

  public getGroup(): Group {
    return this.group;
  }

  public setGroup(group: Group): void {
    this.group = group;
  }
}
