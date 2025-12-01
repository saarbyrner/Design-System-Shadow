import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TabContainer from '..';

const baseProps = {
  titles: [],
  content: [],
};

const mockTabs = [
  { isPermitted: true, label: 'Tab one', value: 'tab_one' },
  { isPermitted: true, label: 'Tab two', value: 'tab_two' },
];

const mockContent = [
  {
    isPermitted: true,
    label: 'Tab one',
    value: 'tab_one',
    content: <div>Content One</div>,
  },
  {
    isPermitted: true,
    label: 'Tab two',
    value: 'tab_two',
    content: <div>Content Two</div>,
  },
];

describe('<TabContainer/>', () => {
  const originalLocation = window.location;
  const originalHistory = window.history;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '', hash: '' },
      writable: true,
    });

    Object.defineProperty(window, 'history', {
      value: { replaceState: jest.fn() },
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.hash = '';
    window.location.pathname = '';
    window.location.search = '';
  });

  afterAll(() => {
    window.location = originalLocation;
    window.history = originalHistory;
  });

  it('renders all tab titles', () => {
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    expect(screen.getByRole('tab', { name: 'Tab one' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab two' })).toBeInTheDocument();
  });

  it("renders the first tab's content", () => {
    render(
      <TabContainer {...baseProps} content={mockContent} titles={mockTabs} />
    );
    expect(screen.getByText('Content One')).toBeInTheDocument();
  });

  it.each([
    {
      pathname: '/registration',
      hash: '#tab_one',
      search: '?persistentState=test',
      expectedHash: '#tab_two',
      expectedSearch: '',
    },
    {
      pathname: '/registration',
      hash: '#tab_one',
      search: '?persistentState=test&id=1741',
      expectedHash: '#tab_two',
      expectedSearch: '?id=1741',
    },
    {
      pathname: '/registration',
      hash: '#tab_one',
      search: '?id=1741',
      expectedHash: '#tab_two',
      expectedSearch: '?id=1741',
    },
  ])(
    'should update the hash correctly for $pathname and $hash',
    async ({ pathname, hash, search, expectedHash, expectedSearch }) => {
      window.location.pathname = pathname;
      window.location.hash = hash;
      window.location.search = search;
      const user = userEvent.setup();
      render(
        <TabContainer {...baseProps} content={mockContent} titles={mockTabs} />
      );
      await user.click(screen.getByRole('tab', { name: 'Tab two' }));
      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        `${pathname}${expectedSearch}${expectedHash}`
      );
    }
  );

  it('should default to the first tab if no hash is present', () => {
    window.location.hash = '';
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    expect(screen.getByRole('tab', { name: 'Tab one' })).toBeInTheDocument();
  });

  it('should render the correct tab content when a valid hash is present', () => {
    window.location.pathname = '/test';
    window.location.hash = '#tab_two';
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    expect(screen.getByText('Content Two')).toBeInTheDocument();
    expect(screen.queryByText('Content One')).not.toBeInTheDocument();
  });

  it('should render the first tab when hash is for the first tab', () => {
    window.location.pathname = '/test';
    window.location.hash = '#tab_one';
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    expect(screen.getByText('Content One')).toBeInTheDocument();
    expect(screen.queryByText('Content Two')).not.toBeInTheDocument();
  });

  it('should default to the first tab and update URL when an invalid hash is present', () => {
    window.location.pathname = '/test';
    window.location.hash = '#invalid_tab';
    window.location.search = '?someParam=value';
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    // Should render first tab content
    expect(screen.getByText('Content One')).toBeInTheDocument();
    expect(screen.queryByText('Content Two')).not.toBeInTheDocument();
    // Should update URL to first tab
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/test?someParam=value#tab_one'
    );
  });

  it('should default to the first tab when hash is empty string', () => {
    window.location.pathname = '/test';
    window.location.hash = '';
    render(
      <TabContainer {...baseProps} titles={mockTabs} content={mockContent} />
    );
    expect(screen.getByText('Content One')).toBeInTheDocument();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/test#tab_one'
    );
  });
});
