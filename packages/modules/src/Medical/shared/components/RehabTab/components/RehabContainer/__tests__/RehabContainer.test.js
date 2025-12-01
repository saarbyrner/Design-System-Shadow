import moment from 'moment-timezone';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import annotationsData from '@kitman/services/src/mocks/handlers/rehab/getRehabNotes/getRehabNotesData.mock';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

import { colors } from '@kitman/common/src/variables';
import RehabContainer from '../index';
import { RehabDispatchContext } from '../../../RehabContext';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalHistory: {},
  medicalApi: {
    useGetAthleteDataQuery: jest.fn(),
  },
});

const mockAthleteData = {
  data: {
    athleteId: 'mockAthleteId',
    constraints: { active_periods: [{ start: null, end: null }] },
  },
};

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

describe('<RehabContainer />', () => {
  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue(mockAthleteData);
  });
  const onAddNoteClickedSpy = jest.fn();
  const onDeleteEntireSession = jest.fn();
  const onNoteUpdatedSpy = jest.fn();
  const onAddRehabToSectionClickedSpy = jest.fn();

  const dispatchSpy = jest.fn();

  const sections = [
    {
      id: 2,
      title: 'General',
      theme_color: null,
      order_index: 1,
      exercise_instances: [],
    },
  ];

  const fullNotesPermissions = {
    canView: true,
    canCreate: true,
    canEdit: true,
    canArchive: true,
  };

  const noNotesPermissions = {
    canView: false,
    canCreate: false,
    canEdit: false,
    canArchive: false,
  };

  const props = {
    athleteId: 1,
    inMaintenance: false,
    id: 1,
    sections,
    issueOccurrenceDate: '2022-11-21T00:00:00+00:00',
    startTime: '2022-11-24T12:00:00+00:00',
    rehabCopyMode: false,
    rehabDayMode: '3_DAY',
    disabled: false,
    annotations: [],
    notesPermissions: fullNotesPermissions,
    hasManagePermission: true,
    viewNotesToggledOn: false,
    isPlaceholderSession: false,
    activeItem: null,
    highlightSession: false,
    readOnly: false,
    // Function callbacks
    onAddNoteClicked: onAddNoteClickedSpy,
    onNoteUpdated: onNoteUpdatedSpy,
    callDeleteWholeSession: onDeleteEntireSession,
    onAddRehabToSectionClicked: onAddRehabToSectionClickedSpy,

    t: i18nextTranslateStub(),
  };

  it('displays a highlighted session when the prop is set', async () => {
    useGetAthleteDataQuery.mockReturnValue(mockAthleteData);
    const highlightContainerProps = { ...props, highlightSession: true };
    render(
      <TestProviders store={store}>
        <RehabContainer {...highlightContainerProps} />
      </TestProviders>
    );
    const dayDisplay = screen.getByTestId(
      'RehabSection|SessionHeader'
    ).parentNode;
    expect(dayDisplay).toBeInTheDocument();
    expect(dayDisplay).toHaveStyle({
      backgroundColor: colors.neutral_300,
    });
  });

  describe('When rehab-post-injury-day-index feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-post-injury-day-index': true,
      };
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags = {};
    });

    it('displays the correct content when injury date', async () => {
      render(<RehabContainer {...props} />);

      const dayOfInjury = screen.getByTestId('RehabSection|DayOfInjury');
      expect(dayOfInjury).toBeInTheDocument();
      expect(dayOfInjury).toHaveTextContent('4');
    });

    it('displays the correct content when not injury date', async () => {
      const notInjuryDateProps = {
        ...props,
        startTime: '2022-11-20T00:00:00+00:00',
      };
      render(<RehabContainer {...notInjuryDateProps} />);

      expect(() => screen.getByTestId('RehabSection|DayOfInjury')).toThrow();
    });

    it('displays the correct date sent an Eastern Standard Time but Greenwich Mean Time organization', async () => {
      const timezoneInjuryProps = {
        ...props,
        issueOccurrenceDate: '2022-11-21T00:00:00-05:00', // Timezone in Greenwich Mean Time = 2022-11-21T05:00:00
        startTime: '2022-11-20T19:00:00-05:00', // Timezone in Greenwich Mean Time = 2022-11-22T00:00:00
      };
      render(<RehabContainer {...timezoneInjuryProps} />);

      const dayOfInjury = screen.getByTestId('RehabSection|DayOfInjury');
      expect(dayOfInjury).toBeInTheDocument();
      expect(dayOfInjury).toHaveTextContent('1');
    });
  });

  describe('When rehab note feature flag is off', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-note': false,
      };
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags = {};
    });

    it('displays active section containers when disabled prop is false', async () => {
      render(<RehabContainer {...props} />);

      const disabledSectionsContainer = screen.queryByTestId(
        'sections_container|disabled'
      );
      expect(disabledSectionsContainer).not.toBeInTheDocument();

      const activeSectionsContainer = screen.getByTestId(
        'sections_container|active'
      );
      expect(activeSectionsContainer).toBeInTheDocument();
    });

    it('displays disabled section containers when disabled prop is true', async () => {
      render(<RehabContainer {...props} disabled />);

      const disabledSectionsContainer = screen.getByTestId(
        'sections_container|disabled'
      );
      expect(disabledSectionsContainer).toBeInTheDocument();

      const activeSectionsContainer = screen.queryByTestId(
        'sections_container|active'
      );
      expect(activeSectionsContainer).not.toBeInTheDocument();
    });

    it('displays the correct content when is the injury date', async () => {
      render(<RehabContainer {...props} />);

      const dayOfInjury = screen.getByTestId('RehabSection|DayOfInjury');
      expect(dayOfInjury).toBeInTheDocument();
      expect(dayOfInjury).toHaveTextContent('3');

      const day = screen.getByTestId('RehabSection|Day');
      expect(day).toBeInTheDocument();
      expect(day).toHaveTextContent('Thu 24 Nov');

      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('displays the correct content when is not the injury date', async () => {
      const notInjuryDateProps = {
        ...props,
        startTime: '2022-11-20T00:00:00+00:00',
      };
      render(<RehabContainer {...notInjuryDateProps} />);

      expect(() => screen.getByTestId('RehabSection|DayOfInjury')).toThrow();

      const day = screen.getByTestId('RehabSection|Day');
      expect(day).toBeInTheDocument();
      expect(day).toHaveTextContent('Sun 20 Nov');
    });

    it('displays the correct date sent an Eastern Standard Time but Greenwich Mean Time organization', async () => {
      const timezoneInjuryProps = {
        ...props,
        issueOccurrenceDate: '2022-11-21T00:00:00-05:00', // Timezone in Greenwich Mean Time = 2022-11-21T05:00:00
        startTime: '2022-11-20T19:00:00-05:00', // Timezone in Greenwich Mean Time = 2022-11-22T00:00:00
      };
      render(<RehabContainer {...timezoneInjuryProps} />);

      const dayOfInjury = screen.getByTestId('RehabSection|DayOfInjury');
      expect(dayOfInjury).toBeInTheDocument();
      expect(dayOfInjury).toHaveTextContent('0');

      const day = screen.getByTestId('RehabSection|Day');
      expect(day).toBeInTheDocument();
      expect(day).toHaveTextContent('Mon 21 Nov');

      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      expect(createNotes).not.toBeInTheDocument();
    });
  });

  describe('When rehab note feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-note': true,
      };
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags = {};
    });

    it('does not display a note if not present for a rehab session', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          annotations={[]}
          viewNotesToggledOn
        />
      );
      const noteSection = screen.queryByTestId('RehabSection|DayNote');
      expect(noteSection).not.toBeInTheDocument();
    });

    it('displays an note when present for a rehab session', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          annotations={annotationsData}
          viewNotesToggledOn
        />
      );

      const noteSection = screen.getByTestId('RehabSection|DayNote');
      expect(noteSection).toBeInTheDocument();
      expect(noteSection).toHaveTextContent('Test note content');
    });

    it('does not display a note when view note permission is off', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          annotations={annotationsData}
          viewNotesToggledOn
          notesPermissions={noNotesPermissions}
        />
      );

      const noteSection = screen.getByTestId('RehabSection|DayNote');
      expect(noteSection).toBeInTheDocument();
      expect(noteSection).not.toHaveTextContent('Test note content');
    });

    it('does not display note content when viewNotesToggledOn is false', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          annotations={annotationsData}
          viewNotesToggledOn={false}
        />
      );

      const noteSection = screen.getByTestId('RehabSection|DayNote');
      expect(noteSection).toBeInTheDocument();
      expect(noteSection).not.toHaveTextContent('Test note content');
    });

    it('displays a note for a placeholder rehab session', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          annotations={annotationsData}
          isPlaceholderSession
          viewNotesToggledOn
        />
      );

      const noteSection = screen.getByTestId('RehabSection|DayNote');
      expect(noteSection).toBeInTheDocument();
      expect(noteSection).toHaveTextContent('Test note content');
    });

    it('displays the add note button', async () => {
      render(<RehabContainer {...props} rehabCopyMode={false} />);

      const copySection = screen.queryByTestId('RehabSection|CopySection');
      expect(copySection).not.toBeInTheDocument();
      const sessionHeader = screen.getByTestId('RehabSection|SessionHeader');
      const deleteDay = screen.getByTestId('RehabSection|DeleteDay');
      const createNotes = screen.getByTestId('RehabSection|CreateNote');
      await fireEvent.mouseOver(sessionHeader);
      expect(createNotes).toBeInTheDocument();
      expect(deleteDay).toBeInTheDocument();

      // TODO: button shouldn't be hidden
      const noteButton = await within(createNotes).findByRole('button', {
        hidden: true,
      });
      expect(noteButton).toBeInTheDocument();

      expect(noteButton).toHaveClass('icon-note');

      await userEvent.click(noteButton);
      expect(onAddNoteClickedSpy).toHaveBeenCalled();

      // TODO: button shouldn't be hidden
      const deleteButton = await within(deleteDay).findByRole('button', {
        hidden: true,
      });
      expect(deleteButton).toBeInTheDocument();

      expect(deleteButton).toHaveClass('icon-bin');

      await userEvent.click(deleteButton);
      expect(onDeleteEntireSession).toHaveBeenCalled();
    });

    it('does not display the add note button when copy mode is on', async () => {
      render(<RehabContainer {...props} rehabCopyMode />);

      // No copy checkbox as no exercises
      const copySection = screen.queryByTestId('RehabSection|CopySection');
      expect(copySection).not.toBeInTheDocument();

      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('does not display the add note button when Group mode is on', async () => {
      render(<RehabContainer {...props} rehabGroupMode />);

      const copySection = screen.queryByTestId('RehabSection|CopySection');
      expect(copySection).not.toBeInTheDocument();

      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('does not display the add rehab button when Group mode is on', async () => {
      render(<RehabContainer {...props} rehabGroupMode />);

      const copySection = screen.queryByTestId('RehabSection|AddRehab');
      expect(copySection).not.toBeInTheDocument();

      const createNotes = screen.queryByTestId('RehabSection|AddRehab');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('does not display the delete rehab button when Group mode is on', async () => {
      render(<RehabContainer {...props} rehabGroupMode />);

      const copySection = screen.queryByTestId('RehabSection|DeleteDay');
      expect(copySection).not.toBeInTheDocument();

      const createNotes = screen.queryByTestId('RehabSection|DeleteDay');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('displays a copy checkbox when there are exercises and rehabCopyMode is true', async () => {
      const sectionsWithExercises = [
        {
          id: 2,
          title: 'General',
          theme_color: null,
          order_index: 1,
          exercise_instances: [
            {
              id: 8,
              exercise_template_id: 80,
              exercise_name: '1/2 Kneeling Ankle Mobility ',
              variations: [
                {
                  key: 'duration_time',
                  parameters: [
                    {
                      key: 'duration',
                      value: '5',
                      config: {
                        unit: 'min',
                      },
                    },
                    {
                      key: 'time',
                      value: '1',
                      config: {
                        unit: 'min',
                      },
                    },
                  ],
                },
              ],
              comment: null,
              order_index: 1,
              section_id: 2,
              session_id: 2,
            },
          ],
        },
      ];

      render(
        <RehabDispatchContext.Provider
          value={{
            dispatchSpy,
            copyExerciseIds: [],
            editExerciseIds: [],
            linkExerciseIds: [],
          }}
        >
          <RehabContainer
            {...props}
            rehabCopyMode
            sections={sectionsWithExercises}
          />
        </RehabDispatchContext.Provider>
      );

      const copySection = screen.getByTestId('RehabSection|CopySection');
      expect(copySection).toBeInTheDocument();

      const checkbox = await within(copySection).findByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('checks the checkbox when all exercises are selected', async () => {
      const sectionsWithExercises = [
        {
          id: 2,
          title: 'General',
          theme_color: null,
          order_index: 1,
          exercise_instances: [
            {
              id: 8,
              exercise_template_id: 80,
              exercise_name: '1/2 Kneeling Ankle Mobility ',
              variations: [
                {
                  key: 'duration_time',
                  parameters: [
                    {
                      key: 'duration',
                      value: '5',
                      config: {
                        unit: 'min',
                      },
                    },
                    {
                      key: 'time',
                      value: '1',
                      config: {
                        unit: 'min',
                      },
                    },
                  ],
                },
              ],
              comment: null,
              order_index: 1,
              section_id: 2,
              session_id: 2,
            },
          ],
        },
      ];

      render(
        <RehabDispatchContext.Provider
          value={{
            dispatchSpy,
            copyExerciseIds: [8],
            editExerciseIds: [],
            linkExerciseIds: [],
          }}
        >
          <RehabContainer
            {...props}
            rehabCopyMode
            sections={sectionsWithExercises}
          />
        </RehabDispatchContext.Provider>
      );

      const copySection = screen.getByTestId('RehabSection|CopySection');
      expect(copySection).toBeInTheDocument();

      const checkbox = await within(copySection).findByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('TRIAL ATHLETE - Add & Delete Rehab, and Note button', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-note': true,
      };
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags = {};
    });
    const renderWithHiddenFilters = (hiddenFilters = []) => {
      render(<RehabContainer {...props} hiddenFilters={hiddenFilters} />);
    };

    it('does render by default', async () => {
      renderWithHiddenFilters([]);
      const copySection = screen.queryByTestId('RehabSection|AddRehab');
      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      const deleteSection = screen.queryByTestId('RehabSection|DeleteDay');

      expect(copySection).toBeInTheDocument();
      expect(createNotes).toBeInTheDocument();
      expect(deleteSection).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters([
        'add_rehab_button',
        'add_medical_note_button',
        'delete_rehab_button',
      ]);

      const copySection = screen.queryByTestId('RehabSection|AddRehab');
      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      const deleteSection = screen.queryByTestId('RehabSection|DeleteDay');

      expect(copySection).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Copy' })
      ).not.toBeInTheDocument();
      expect(createNotes).not.toBeInTheDocument();
      expect(deleteSection).not.toBeInTheDocument();
    });
  });

  describe('When has a constraint record and rehab note feature flag is on', () => {
    const activePeriodWithRestrictions = {
      start: '2022-11-23T12:00:00+00:00',
      end: '2022-11-26T12:00:00+00:00',
    };
    beforeEach(() => {
      window.featureFlags = {
        'rehab-note': true,
      };
      moment.tz.setDefault('UTC');
      useGetAthleteDataQuery.mockReturnValue({
        data: {
          athleteId: 'mockAthleteId',
          constraints: { active_periods: [activePeriodWithRestrictions] },
        },
      });
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags = {};
    });

    it('does display droppable container when startTime is after athlete left', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          startTime="2022-11-27T12:00:00+00:00" // After constrain end
        />
      );

      const droppableContainer = screen.queryByTestId(
        'Rehab|DroppableContainer'
      );
      expect(droppableContainer).toBeInTheDocument();
    });

    it('does display droppable container when when startTime is before athlete joined', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          startTime="2022-11-22T12:00:00+00:00" // Before constraints start
        />
      );

      const droppableContainer = screen.queryByTestId(
        'Rehab|DroppableContainer'
      );
      expect(droppableContainer).toBeInTheDocument();
    });

    it('does not display transfer message text when startTime is between athlete joined and left dates', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          startTime="2022-11-24T12:00:00+00:00" // Between constraints start & end
        />
      );

      const transferMessage = screen.queryByTestId(
        'RehabSection|TransferMessage'
      );
      expect(transferMessage).not.toBeInTheDocument();

      const droppableContainer = screen.queryByTestId(
        'Rehab|DroppableContainer'
      );
      expect(droppableContainer).toBeInTheDocument();
    });

    it('displays read-only message text when prop is true', async () => {
      render(
        <RehabContainer
          {...props}
          readOnly
          rehabCopyMode={false}
          startTime="2022-11-24T12:00:00+00:00" // Between constraints start & end
        />
      );

      const transferMessage = screen.getByTestId(
        'RehabSection|TransferMessage'
      );
      expect(transferMessage).toBeInTheDocument();

      expect(
        within(transferMessage).getByText('Read-only rehab session')
      ).toBeInTheDocument();

      const droppableContainer = screen.queryByTestId(
        'Rehab|DroppableContainer'
      );
      expect(droppableContainer).toBeInTheDocument();
    });

    it('does display transfer message text when startTime is same day athlete left', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          startTime="2022-11-26T13:00:00+00:00" // Same day as constraint left_at
        />
      );

      const transferMessage = screen.queryByTestId(
        'RehabSection|TransferMessage'
      );
      expect(transferMessage).toBeInTheDocument();
    });

    it('does NOT display the add note button when startTime before joined', async () => {
      render(
        <RehabContainer
          {...props}
          rehabCopyMode={false}
          startTime="2022-11-22T12:00:00+00:00" // Before constraint start
        />
      );

      // No copy checkbox as no exercises
      const copySection = screen.queryByTestId('RehabSection|CopySection');
      expect(copySection).not.toBeInTheDocument();

      const createNotes = screen.queryByTestId('RehabSection|CreateNote');
      expect(createNotes).not.toBeInTheDocument();
    });

    it('does NOT display a copy checkbox when startTime before joined', async () => {
      const sectionsWithExercises = [
        {
          id: 2,
          title: 'General',
          theme_color: null,
          order_index: 1,
          exercise_instances: [
            {
              id: 8,
              exercise_template_id: 80,
              exercise_name: '1/2 Kneeling Ankle Mobility ',
              variations: [
                {
                  key: 'duration_time',
                  parameters: [
                    {
                      key: 'duration',
                      value: '5',
                      config: {
                        unit: 'min',
                      },
                    },
                    {
                      key: 'time',
                      value: '1',
                      config: {
                        unit: 'min',
                      },
                    },
                  ],
                },
              ],
              comment: null,
              order_index: 1,
              section_id: 2,
              session_id: 2,
            },
          ],
        },
      ];

      render(
        <RehabDispatchContext.Provider
          value={{
            dispatchSpy,
            copyExerciseIds: [],
            editExerciseIds: [],
            linkExerciseIds: [],
          }}
        >
          <RehabContainer
            {...props}
            rehabCopyMode
            sections={sectionsWithExercises}
            startTime="2022-11-22T12:00:00+00:00" // Before constraint start
          />
        </RehabDispatchContext.Provider>
      );

      const copySection = screen.queryByTestId('RehabSection|CopySection');
      expect(copySection).not.toBeInTheDocument();
    });
  });
});
