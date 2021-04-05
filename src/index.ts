import Application from './Application';
import { CommitsManager } from './CommitsManager';
import { HTMLCommitsManager } from './HTMLCommitsManager';

(function () {
  function createCommitsManagersFromFoundedCommitBlocks(): CommitsManager[] {
    const commitBlocks: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.TimelineItem',
    );

    const commitsManagers: CommitsManager[] = [];

    commitBlocks.forEach((block) => {
      commitsManagers.push(new HTMLCommitsManager(block));
    });

    return commitsManagers;
  }

  function initExtension(): void {
    const commitsManagers = createCommitsManagersFromFoundedCommitBlocks();

    new Application(commitsManagers);
  }

  window.addEventListener('load', initExtension);
})();
