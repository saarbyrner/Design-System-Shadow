import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '../../redux/utils/mockedStore';
import {
  updateViewType,
  selectAthlete,
  abortFetchingAssessments,
  fetchAssessments,
} from '../../redux/actions';
import AppHeaderContainer from '../AppHeader';

// Mock async actions to spy on them without executing network calls
jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  updateViewType: jest.fn(),
  selectAthlete: jest.fn(),
  fetchAssessments: jest.fn(),
  abortFetchingAssessments: jest.fn(),
}));

describe('AppHeader Container', () => {
  const preloadedState = {
    ...mockedStore,
    assessmentTemplates: [{ id: 1, name: 'Template Name' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Templates tab when templates exist in the store', () => {
    renderWithRedux(<AppHeaderContainer />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByRole('tab', { name: 'Templates' })).toBeInTheDocument();
  });

  it('dispatches the correct actions when clicking a non-active tab (Athlete)', async () => {
    renderWithRedux(<AppHeaderContainer />, {
      preloadedState: { ...preloadedState, viewType: 'GRID' },
      useGlobalStore: false,
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Group' }));
    // Ensure another tab is clicked and the viewType is matching first to trigger the action
    await user.click(screen.getByRole('tab', { name: 'Athlete' }));

    expect(abortFetchingAssessments).toHaveBeenCalledTimes(1);
    expect(updateViewType).toHaveBeenCalledWith('LIST');
  });

  it('dispatches the correct actions when the Templates tab is clicked', async () => {
    renderWithRedux(<AppHeaderContainer />, {
      preloadedState,
      useGlobalStore: false,
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Templates' }));

    expect(abortFetchingAssessments).toHaveBeenCalledTimes(1);
    expect(updateViewType).toHaveBeenCalledWith('TEMPLATE');
  });

  it('dispatches the correct actions when the Group tab is clicked', async () => {
    renderWithRedux(<AppHeaderContainer />, {
      preloadedState,
      useGlobalStore: false,
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Group' }));

    expect(updateViewType).toHaveBeenCalledWith('GRID');
    expect(selectAthlete).toHaveBeenCalledWith(null);
    expect(fetchAssessments).toHaveBeenCalledWith({
      athleteIds: null,
      reset: true,
    });
  });
});
