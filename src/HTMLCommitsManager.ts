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
    const buttonStyle = `
      align-items: center;
      background: #161b22;
      border: 0;
      display: flex;
      height: 32px;
      justify-content: center;
      margin: 0 0 0 auto;
      width: 32px;
    `;

    const iconSource = chrome.extension.getURL('assets/MdContentCopy.svg');

    button.setAttribute('type', 'button');
    button.setAttribute('title', 'copy commits to clipboard');
    button.onclick = this.copyCommits.bind(this);

    button.style.cssText = buttonStyle;
    button.innerHTML = `<img src=${iconSource} />`;

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
