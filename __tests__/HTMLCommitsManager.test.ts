import { JSDOM } from 'jsdom';
import { HTMLCommitsManager } from '../src/HTMLCommitsManager';

const fakeHTML = `
  <!DOCTYPE html>
    <div class="TimelineItem">
      <div class="TimelineItem-body">
        <ol>
          <li>
            <div>
              <p>
                <a aria-label="Commit mes...">Commit message #1</a>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p>
                <a aria-label="Commit mes...">Commit message #2</a>
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </html>
`;

const fakeDOM = new JSDOM(fakeHTML);
const commitBlock = fakeDOM.window.document.querySelector(
  '.TimelineItem',
) as HTMLElement;

describe('HTMLCommitsManager', () => {
  it('is initialized correctly', () => {
    const commitsManager = new HTMLCommitsManager(commitBlock);
    const block = commitsManager.getBlock();

    // assert toolbar was appended
    const toolbar = block.querySelector('.TimelineItem-body > section');

    expect(toolbar).not.toBeNull();

    // assert commit messages were updated
    const commitLinks = block.querySelectorAll('li > div > p > a');

    expect(commitLinks[0].innerHTML).toEqual('Commit message #1');
    expect(commitLinks[1].innerHTML).toEqual('Commit message #2');
  });

  it('can get HTML block', () => {
    const commitsManager = new HTMLCommitsManager(commitBlock);

    expect(commitsManager.getBlock()).toEqual(commitBlock);
  });
});
