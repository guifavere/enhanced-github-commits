import { CommitsManager } from './CommitsManager';

export default class Application {
  public commitsManagers: CommitsManager[];

  constructor(commitsManagers: CommitsManager[]) {
    this.commitsManagers = commitsManagers;
  }
}
