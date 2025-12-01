import userEvent from '@testing-library/user-event';
import { screen, act } from '@testing-library/react';
import render from '@kitman/common/src/utils/renderWithRedux';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { buildEvent } from '@kitman/common/src/utils/test_utils';

import CollectionTab from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<CollectionTab />', () => {
  const props = {
    athleteComments: [],
    athleteLinkedToComments: { id: 1 },
    canCreateAsssessment: true,
    canViewAsssessments: true,
    canEditEvent: true,
    clearUpdatedGridRows: jest.fn(),
    event: buildEvent(),
    fetchAssessmentGrid: jest.fn(),
    fetchWorkloadGrid: jest.fn(),
    participationLevels: [
      {
        id: 1,
        name: 'Testing',
        canonical_participation_level: 'none',
        include_in_group_calculations: true,
      },
    ],
    grid: {
      columns: [
        {
          row_key: 'athlete',
          name: 'Athlete',
          readonly: true,
          id: 1,
          default: true,
        },
        { row_key: 'rpe', name: 'Rpe', readonly: false, id: 2, default: true },
        {
          row_key: 'minutes',
          name: 'Minutes',
          readonly: false,
          id: 3,
          default: true,
        },
        { row_key: 'load', name: 'Load', readonly: true, id: 4, default: true },
        {
          row_key: '%_difference',
          name: '% Difference',
          readonly: true,
          id: 5,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: {
            avatar_url: 'john_do_avatar.jpg',
            fullname: 'John Doh',
          },
          rpe: 1,
          minutes: 90,
          load: 90,
          '%_difference': { value: 1, comment: null },
        },
      ],
      nextId: null,
    },
    isCommentsSidePanelOpen: false,
    onSaveAthleteComments: jest.fn(),
    onSaveAssessmentGridAttributes: jest.fn(),
    onSaveWorkloadGridAttributes: jest.fn(),
    onSetAthleteComments: jest.fn(),
    onSetAthleteLinkedToComments: jest.fn(),
    onSetCommentsPanelViewType: jest.fn(),
    onSetIsCommentsSidePanelOpen: jest.fn(),
    onSetRequestStatus: jest.fn(),
    onSetSelectedGridDetails: jest.fn(),
    onUpdateGrid: jest.fn(),
    fetchAssessmentGroups: jest.fn(() => Promise.resolve()),
    assessmentGroups: [{ id: 123, name: 'boop' }],
    onUpdateGridRow: jest.fn(),
    requestStatus: 'LOADING',
    selectedGridDetails: {
      id: 'default',
      name: 'Workload',
      type: 'DEFAULT',
    },
    statusVariables: [
      {
        source_key: 'statsports|total_distance',
        name: 'Total distance',
        source_name: 'Training Variable',
        type: 'number',
        localised_unit: '',
      },
      {
        source_key: 'statsports|slope_percent',
        name: 'Slope percent',
        source_name: 'Training Variable',
        type: 'number',
        localised_unit: '',
      },
    ],
    toastAction: jest.fn(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  it('renders the correct content', async () => {
    const user = userEvent.setup();
    await act(async () => render(<CollectionTab {...props} />));
    expect(screen.getByRole('heading')).toHaveTextContent('Game evaluation');
    expect(screen.getAllByRole('textbox').at(0)).toHaveTextContent(
      'Nothing, it went great!'
    );
    expect(screen.getAllByRole('textbox').at(1)).toHaveTextContent(
      'use weak foot next time!'
    );
    const collectionSidePanel = screen.getByTestId('collectionSidePanel');

    expect(collectionSidePanel).toHaveTextContent('Game evaluation');
    expect(collectionSidePanel).toHaveTextContent('Workload');
    expect(collectionSidePanel).toHaveTextContent('boop');

    await user.click(screen.getByText('Workload'));
    await act(async () =>
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Workload'
      )
    );
  });

  describe('pac-sessions-games-workload-collection-channels-rpe-option-updates', () => {
    const setupTestAndOpenSidePanel = async () => {
      const user = userEvent.setup();
      render(<CollectionTab {...props} />);

      // SidePanel isOpen is controlled by a combination of local state, so just
      // setting up the test to trigger the state
      await user.click(screen.getByText('Game objectives'));
      await user.click(screen.getAllByRole('button', { name: 'Save' })[0]);
      await user.click(screen.getByText('Workload'));
      await user.click(
        screen.getByRole('button', { name: 'Collection channels' })
      );
    };

    it('should render CollectionChannelsFormV2 if flag is truthy', async () => {
      window.setFlag(
        'pac-sessions-games-workload-collection-channels-rpe-option-updates',
        true
      );
      await setupTestAndOpenSidePanel();

      expect(
        await screen.findByText('RPE collection channels')
      ).toBeInTheDocument();
    });

    it('should render CollectionChannelsFormV1 if flag is falsy', async () => {
      window.setFlag(
        'pac-sessions-games-workload-collection-channels-rpe-option-updates',
        true
      );
      await setupTestAndOpenSidePanel();

      expect(
        await screen.findByText('Collection channels')
      ).toBeInTheDocument();
    });
  });
});
