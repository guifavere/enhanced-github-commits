export interface CommitsManager {
  copyCommits(): Promise<void>;
  sortCommits(): void;
}

export default class HTMLCommitsManager implements CommitsManager {
  public block: HTMLElement;

  constructor(block: HTMLElement) {
    this.block = block;
  }

  public async copyCommits(): Promise<void> {
    console.log('copyCommits');
  }

  public sortCommits(): void {
    console.log('sortCommits');
  }
}
