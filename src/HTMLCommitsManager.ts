export interface CommitsManager {
  copyCommits(): Promise<void>;
  sortCommits(): void;
}

interface CommitLink extends HTMLLinkElement {
  ariaLabel: string;
}

export default class HTMLCommitsManager implements CommitsManager {
  public block: HTMLElement;

  constructor(block: HTMLElement) {
    this.block = block;

    this.init();
  }

  public async copyCommits(): Promise<void> {
    const commitLinks = this.getCommitLinks();

    let clipboardContent = '';

    commitLinks.forEach((commitLink) => {
      const message = `${commitLink.textContent}\n`;

      clipboardContent += message;
    });

    await navigator.clipboard.writeText(clipboardContent);
  }

  public sortCommits(): void {
    console.log('sortCommits');
  }

  private getCommitLinks(): NodeListOf<CommitLink> {
    return this.block.querySelectorAll('li > div > p > a');
  }

  private makeCopyButton(): HTMLButtonElement {
    const button = document.createElement('button');

    button.setAttribute('type', 'button');
    button.textContent = 'copy';
    button.onclick = this.copyCommits.bind(this);

    return button;
  }

  private setFullMessage(commitLink: CommitLink): void {
    const fullMessage = commitLink.ariaLabel;

    commitLink.textContent = fullMessage;
  }

  private init(): void {
    const commitLinks = this.getCommitLinks();
    const copyButton = this.makeCopyButton();

    this.block.insertAdjacentElement('beforebegin', copyButton);
    commitLinks.forEach((commitLink) => this.setFullMessage(commitLink));
  }
}
