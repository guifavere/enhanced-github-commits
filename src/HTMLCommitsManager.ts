export interface CommitsManager {
  copyCommits(): Promise<void>;
  sortCommits(): void;
}

interface CommitLink extends HTMLLinkElement {
  ariaLabel: string;
}

type Sort = 'ASC' | 'DESC';

export default class HTMLCommitsManager implements CommitsManager {
  private block: HTMLElement;

  private commitsList: HTMLOListElement;

  private commitLinks: NodeListOf<CommitLink>;

  private sort: Sort = 'DESC';

  constructor(block: HTMLElement) {
    this.block = block;
    this.commitsList = this.getCommitsList(block);
    this.commitLinks = this.getCommitLinks(block);

    this.init();
  }

  private getCommitsList(block: HTMLElement): HTMLOListElement {
    return block.querySelector('.TimelineItem-body > ol') as HTMLOListElement;
  }

  private getCommitLinks(block: HTMLElement): NodeListOf<CommitLink> {
    return block.querySelectorAll('li > div > p > a');
  }

  private handleSortCommitsASC(): void {
    this.sort = 'ASC';
    this.commitsList.style.flexDirection = 'column-reverse';
  }

  private handleSortCommitsDESC(): void {
    this.sort = 'DESC';
    this.commitsList.style.flexDirection = 'column';
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

  private makeSortButton(): HTMLButtonElement {
    const button = document.createElement('button');
    const buttonStyle = `
      align-items: center;
      background: #161b22;
      border: 0;
      display: flex;
      height: 32px;
      justify-content: center;
      width: 32px;
    `;

    const iconSource = chrome.extension.getURL('assets/MdContentCopy.svg');

    button.setAttribute('type', 'button');
    button.setAttribute('title', 'sort commits');
    button.onclick = this.sortCommits.bind(this);

    button.style.cssText = buttonStyle;
    button.innerHTML = `<img src=${iconSource} />`;

    return button;
  }

  private makeToolbar(): HTMLElement {
    const toolbarStyle = `
      border-bottom: 1px solid #161b22;
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-bottom: 15px;
      padding-bottom: 15px;
    `;

    const copyButton = this.makeCopyButton();
    const sortButton = this.makeSortButton();

    const toolbar = document.createElement('section');

    toolbar.style.cssText = toolbarStyle;
    toolbar.append(sortButton, copyButton);

    return toolbar;
  }

  private setFullMessage(commitLink: CommitLink): void {
    const fullMessage = commitLink.ariaLabel;

    commitLink.textContent = fullMessage;
  }

  private init(): void {
    this.block.insertAdjacentElement('beforebegin', this.makeToolbar());

    this.commitsList.style.display = 'flex';
    this.commitsList.style.flexDirection = 'column';

    this.commitLinks.forEach((commitLink) => this.setFullMessage(commitLink));
  }

  public async copyCommits(): Promise<void> {
    let clipboardContent = '';

    this.commitLinks.forEach((commitLink) => {
      const message = `${commitLink.textContent}\n`;

      clipboardContent += message;
    });

    await navigator.clipboard.writeText(clipboardContent);
  }

  public sortCommits(): void {
    this.sort === 'ASC'
      ? this.handleSortCommitsDESC()
      : this.handleSortCommitsASC();
  }
}
