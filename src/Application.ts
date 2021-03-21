import { CommitsManager } from './HTMLCommitsManager';

export default class Application {
  public commitsManagers: CommitsManager[];

  constructor(commitsManagers: CommitsManager[]) {
    this.commitsManagers = commitsManagers;
  }
}
