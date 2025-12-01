import { render } from '@testing-library/react';
import {
  buildStatuses,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import AthleteStatusTable from '../../components/AthleteStatusTable';

jest.mock('jquery', () => {
  const jqMock = jest.fn(() => ({
    width: () => 800,
    scrollLeft: () => 0,
    offset: () => ({ top: 0 }),
  }));
  jqMock.width = () => 800;
  return jqMock;
});

jest.mock('@kitman/common/src/utils/StickyHeaderTable', () => jest.fn());
jest.mock('@kitman/common/src/utils/ScrollableTable', () => ({
  handleScroll: jest.fn(),
  headerSideScroll: jest.fn(),
  scrollTableLeft: jest.fn(),
  scrollTableRight: jest.fn(),
}));

jest.mock('bootstrap-select', () => ({}));

jest.mock('../../containers/AthleteStatusCells', () => () => (
  <div data-testid="athlete-status-cells" />
));
jest.mock('../../containers/Sidebar', () => () => (
  <div data-testid="sidebar" />
));
jest.mock('../../containers/AthleteStatusHeader', () => () => (
  <div data-testid="athlete-status-header" />
));
jest.mock('../../containers/NoSearchResults', () => () => (
  <div data-testid="no-search-results" />
));

describe('AthleteStatusTable Component', () => {
  const buildProps = (overrides = {}) => ({
    statuses: buildStatuses(9),
    isFilterShown: false,
    screenWidth: 1200,
    t: i18nextTranslateStub(),
    ...overrides,
  });

  it('renders athlete status table container', () => {
    const { container } = render(<AthleteStatusTable {...buildProps()} />);
    expect(container.querySelector('.athleteStatusTable')).toBeInTheDocument();
  });
});
