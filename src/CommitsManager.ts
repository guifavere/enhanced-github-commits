export interface CommitsManager {
  copyCommits(): Promise<void>;
  sortCommits(): void;
}
