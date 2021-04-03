import { HTMLCommitLink } from './HTMLCommitLink';
import { CommitsManager } from './CommitsManager';

type Sort = 'ASC' | 'DESC';

export class HTMLCommitsManager implements CommitsManager {
  private block: HTMLElement;

  private commitsList: HTMLOListElement;

  private commitLinks: NodeListOf<HTMLCommitLink>;

  private sort: Sort = 'DESC';

  constructor(block: HTMLElement) {
    this.block = block;
    this.commitsList = this.findCommitsList(block);
    this.commitLinks = this.findCommitLinks(block);

    this.init();
  }

  private configList(): void {
    this.commitsList.style.display = 'flex';
    this.commitsList.style.flexDirection = 'column';
  }

  private appendToolbar(): void {
    const toolbar = this.makeToolbar();

    this.commitsList.insertAdjacentHTML('beforebegin', toolbar.outerHTML);

    const copyButton = this.block.querySelector(
      '#enhanced-github-commits__button-copy',
    );
    const sortButton = this.block.querySelector(
      '#enhanced-github-commits__button-sort',
    );

    copyButton?.addEventListener('click', this.copyCommits.bind(this));
    sortButton?.addEventListener('click', this.sortCommits.bind(this));
  }

  private findCommitsList(block: HTMLElement): HTMLOListElement {
    return block.querySelector('.TimelineItem-body > ol') as HTMLOListElement;
  }

  private findCommitLinks(block: HTMLElement): NodeListOf<HTMLCommitLink> {
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
    const style = `
      align-items: center;
      background: #161b22;
      border: 0;
      border-radius: 6px;
      display: flex;
      height: 32px;
      justify-content: center;
      width: 32px;
    `;

    const iconSource = chrome.extension.getURL('assets/MdContentCopy.svg');

    button.setAttribute('id', 'enhanced-github-commits__button-copy');
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'copy commits to clipboard');

    button.style.cssText = style;
    button.innerHTML = `<img src=${iconSource} />`;

    return button;
  }

  private makeSortButton(): HTMLButtonElement {
    const button = document.createElement('button');
    const style = `
      align-items: center;
      background: #161b22;
      border: 0;
      border-radius: 6px;
      display: flex;
      height: 32px;
      justify-content: center;
      width: 32px;
    `;

    const iconSource = chrome.extension.getURL('assets/MdSortByAlpha.svg');

    button.setAttribute('id', 'enhanced-github-commits__button-sort');
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'sort commits');

    button.style.cssText = style;
    button.innerHTML = `<img src=${iconSource} />`;

    return button;
  }

  private makeToolbar(): HTMLElement {
    const style = `
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    `;

    const copyButton = this.makeCopyButton();
    const sortButton = this.makeSortButton();

    const toolbar = document.createElement('section');

    toolbar.style.cssText = style;
    toolbar.append(sortButton, copyButton);

    return toolbar;
  }

  private updateCommitMessages(): void {
    function updateMessage(commitLink: HTMLCommitLink): void {
      const fullMessage = commitLink.ariaLabel;

      commitLink.innerText = fullMessage;
    }

    this.commitLinks.forEach(updateMessage);
  }

  private init(): void {
    this.appendToolbar();
    this.configList();
    this.updateCommitMessages();
  }

  public getBlock(): HTMLElement {
    return this.block;
  }

  public async copyCommits(): Promise<void> {
    const commitMessages = Array.from(this.commitLinks).map(
      (commitLink) => commitLink.textContent,
    );

    const clipboardContent =
      this.sort === 'DESC'
        ? commitMessages.join('\n')
        : commitMessages.reverse().join('\n');

    await navigator.clipboard.writeText(clipboardContent);
  }

  public sortCommits(): void {
    this.sort === 'ASC'
      ? this.handleSortCommitsDESC()
      : this.handleSortCommitsASC();
  }
}
