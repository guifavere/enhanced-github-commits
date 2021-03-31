import { HTMLCommitLink } from './HTMLCommitLink';
import { CommitsManager } from './CommitsManager';

type Sort = 'ASC' | 'DESC';

export class HTMLCommitsManager implements CommitsManager {
  private block: Element;

  private commitsList: HTMLOListElement;

  private commitLinks: NodeListOf<HTMLCommitLink>;

  private sort: Sort = 'DESC';

  constructor(block: Element) {
    this.block = block;
    this.commitsList = this.findCommitsList(block);
    this.commitLinks = this.findCommitLinks(block);

    this.init();
  }

  private configList(): void {
    this.commitsList.style.display = 'flex';
    this.commitsList.style.flexDirection = 'column';
  }

  private configToolbar(): void {
    const toolbar = this.makeToolbar();

    this.commitsList.insertAdjacentHTML('beforebegin', toolbar.outerHTML);
  }

  private findCommitsList(block: Element): HTMLOListElement {
    return block.querySelector('.TimelineItem-body > ol') as HTMLOListElement;
  }

  private findCommitLinks(block: Element): NodeListOf<HTMLCommitLink> {
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
      border-radius: 6px;
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
      border-radius: 6px;
      display: flex;
      height: 32px;
      justify-content: center;
      width: 32px;
    `;

    const iconSource = chrome.extension.getURL('assets/MdSortByAlpha.svg');

    button.setAttribute('type', 'button');
    button.setAttribute('title', 'sort commits');
    button.onclick = this.sortCommits.bind(this);

    button.style.cssText = buttonStyle;
    button.innerHTML = `<img src=${iconSource} />`;

    return button;
  }

  private makeToolbar(): Element {
    const toolbarStyle = `
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    `;

    const copyButton = this.makeCopyButton();
    const sortButton = this.makeSortButton();

    const toolbar = document.createElement('section');

    toolbar.style.cssText = toolbarStyle;
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
    this.configToolbar();
    this.configList();
    this.updateCommitMessages();
  }

  public getBlock(): Element {
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
