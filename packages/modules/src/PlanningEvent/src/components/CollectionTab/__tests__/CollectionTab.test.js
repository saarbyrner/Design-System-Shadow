import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import { buildEvent } from '@kitman/common/src/utils/test_utils';
import { setupStore } from '@kitman/modules/src/AppRoot/store';

import CollectionTab from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking', () =>
  jest.fn(() => ({ trackEvent: jest.fn() }))
);

describe('<CollectionTab />', () => {
  const props = {
    athleteComments: [],
    athleteLinkedToComments: { id: 1 },
    canCreateAssessment: true,
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
        {
          row_key: 'rpe',
          name: 'Rpe',
          readonly: false,
          id: 2,
          default: true,
        },
        {
          row_key: 'minutes',
          name: 'Minutes',
          readonly: false,
          id: 3,
          default: true,
        },
        {
          row_key: 'load',
          name: 'Load',
          readonly: true,
          id: 4,
          default: true,
        },
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
  };

  beforeEach(() => {
    window.getFlag = jest.fn().mockReturnValue(true);
  });

  it('displays the button to open the collections panel when flag is on', async () => {
    renderWithProviders(<CollectionTab {...props} />, {
      store: setupStore(),
    });
    expect(screen.getByTestId('collectionPanelBtn')).toBeInTheDocument();
  });

  it('closes the collections side panel when clicking a collection item', async () => {
    props.grid = {
      columns: [
        {
          row_key: 'rpe',
          name: 'RPE',
          readonly: false,
          id: 1,
          default: true,
        },
      ],
      rows: [
        {
          id: 'athlete_1',
          athlete: { fullname: 'Athlete One' },
          rpe: { value: 1, comment: null },
        },
        {
          id: 'athlete_2',
          athlete: { fullname: 'Athlete Two' },
          rpe: { value: 1.5, comment: null },
        },
      ],
      nextId: null,
    };
    props.assessmentGroups = [
      { id: 1, name: 'Assessment Hai' },
      { id: 2, name: 'Assessment Hai 2' },
      { id: 1, name: 'Assessment Hai 3' },
    ];
    props.canViewAsssessments = true;

    const user = userEvent.setup();
    render(<CollectionTab {...props} />);
    expect(document.querySelector('.collectionSidePanel')).toBeInTheDocument();
    await user.click(
      document.querySelectorAll('.collectionSidePanel__item')[2]
    );
    expect(
      document.querySelector('.slidingPanel__left--closed')
    ).toBeInTheDocument();
  });

  it('calls fetchWorkloadGrid when clicking the workloads item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CollectionTab {...props} />, {
      store: setupStore(),
    });

    const item = document.querySelectorAll('.collectionSidePanel__item')[0];
    user.click(item);
    await waitFor(() => expect(props.fetchWorkloadGrid).toHaveBeenCalled());
  });

  it('adds filters when present', async () => {
    renderWithProviders(<CollectionTab {...props} />, {
      store: setupStore(),
    });
    const filterInput = screen.getAllByPlaceholderText(/Search athletes/i);
    fireEvent.change(filterInput[0], { target: { value: 'testing' } });
    await waitFor(() =>
      expect(props.fetchWorkloadGrid).toHaveBeenCalledWith(
        props.event.id,
        true,
        null,
        expect.objectContaining({
          athlete_name: 'testing',
          positions: [],
          squads: [],
          availabilities: [],
          participation_levels: [],
        })
      )
    );
  });

  it('shows the locked assessments item when viewAssessments permission is false', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollectionTab {...props} canViewAsssessments={false} />,
      { store: setupStore() }
    );

    await user.click(screen.getByTestId('collectionPanelBtn'));

    expect(
      document.querySelector('.collectionSidePanel__item--locked')
    ).toBeInTheDocument();
    expect(
      document.querySelector('.collectionSidePanel__item--locked')
    ).toHaveTextContent('Assessments');
  });

  it('calls fetchAssessmentGrid when clicking an assessment item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CollectionTab {...props} />, {
      store: setupStore(),
    });
    await user.click(
      document.querySelectorAll('.collectionSidePanel__item')[2]
    );
    await waitFor(() => expect(props.fetchAssessmentGrid).toHaveBeenCalled());
  });

  // collections-side-panel flag OFF
  it('does not display the button to open the collections panel when flag is off', () => {
    window.getFlag = jest.fn(() => false);
    renderWithProviders(<CollectionTab {...props} />, {
      store: setupStore(),
    });
    expect(screen.queryByTestId('collectionPanelBtn')).not.toBeInTheDocument();
  });
});
