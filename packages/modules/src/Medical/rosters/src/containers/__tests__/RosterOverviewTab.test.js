import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveSquad } from '@kitman/services';
import RosterOverviewTabContainer from '@kitman/modules/src/Medical/rosters/src/containers/RosterOverviewTab';
import { RosterOverviewTabTranslated as RosterOverviewTab } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab';
import {
  resetGridPagination,
  updateFilters,
} from '@kitman/modules/src/Medical/rosters/src/redux/actions';
import { getPersistedMedicalFilters } from '@kitman/modules/src/Medical/shared/utils/filters';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab',
  () => ({
    RosterOverviewTabTranslated: jest.fn(() => null),
  })
);

jest.mock('@kitman/services', () => ({
  getActiveSquad: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/utils/filters', () => ({
  getPersistedMedicalFilters: jest.fn(),
  setPersistedMedicalFilters: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/rosters/src/redux/actions', () => ({
  resetGridPagination: jest.fn(),
  updateFilters: jest.fn(),
  fetchRosterGrid: jest.fn(),
  openAddIssuePanel: jest.fn(),
  selectIssueType: jest.fn(),
  setRequestStatus: jest.fn(),
}));

describe('RosterOverviewTabContainer', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes('state.grid')) return {};
      if (selector.toString().includes('state.app.requestStatus'))
        return 'idle';
      if (selector.toString().includes('state.filters')) return {};
      return undefined;
    });
    getActiveSquad.mockResolvedValue({ id: 'squad123' });
    getPersistedMedicalFilters.mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setFilters and dispatches resetGridPagination and updateFilters when onFiltersUpdate is called', async () => {
    render(<RosterOverviewTabContainer />);

    const updatedFilters = { squads: ['squad456'], positions: ['pos1'] };

    // Simulate the onFiltersUpdate prop being called
    RosterOverviewTab.mock.calls[0][0].onFiltersUpdate(updatedFilters);

    expect(mockDispatch).toHaveBeenCalledWith(resetGridPagination());
    expect(mockDispatch).toHaveBeenCalledWith(updateFilters(updatedFilters));
  });
});
