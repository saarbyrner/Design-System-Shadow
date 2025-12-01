import { screen, within, render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { data as mockActivityGroups } from '@kitman/services/src/mocks/handlers/medical/getActivityGroups';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
  mockedChronicIssueContextValue,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import EditView from '../EditView';

jest.mock('@kitman/components/src/DatePicker');

const store = storeFake({
  medicalSharedApi: {
    queries: {
      'getAthleteData(5)': {
        status: 'fulfilled',
        isLoading: false,
        data: {
          ...mockedPastAthlete,
        },
      },
    },
  },
  medicalHistory: {},
});

window.featureFlags = {};

describe('EditView', () => {
  let component;
  const props = {
    selectedEventType: 'GAME',
    gameAndTrainingOptions: {
      games: [
        {
          game_date: '2021-04-14T00:00:00+01:00',
          name: 'International Squad vs Samoa (14/04/2021) 15-8',
          value: 39139,
        },
        {
          game_date: '2021-03-17T00:00:00+00:00',
          name: 'International Squad vs Australia (17/03/2021) 50-20',
          value: 38628,
        },
      ],
      other_events: [
        {
          id: 1,
          label: 'Nonsport event',
          shortname: 'nonsport',
          sport: null,
        },
      ],
      training_sessions: [
        {
          name: 'Conditioning (04/05/2021)',
          value: 505729,
        },
      ],
    },
    activityGroups: mockActivityGroups,
    positionGroups: [
      {
        id: 1,
        name: 'Position group 1',
        positions: [
          {
            id: 1,
            name: 'Position 1',
          },
        ],
      },
      {
        id: 2,
        name: 'Position group 2',
        positions: [
          {
            id: 2,
            name: 'Position 2',
          },
        ],
      },
    ],
    details: {
      issueDate: '2021-05-01',
      reportedDate: '2021-05-01',
      eventType: 'game',
      mechanismDescription: 'mocked mechanism description',
    },
    onSelectEvent: jest.fn(),
    getFieldLabel: (name) => name,
    isFieldVisible: (name) => name !== 'session_completed',
    onSelectIssueDate: jest.fn(),
    onSelectDetail: jest.fn(),
    onUpdateFreeText: jest.fn(),
    isGameOrTraining: true,
    injuryMechanisms: [
      { id: 1, name: 'Other', require_additional_input: true, parent_id: null },
    ],
    issueContactTypes: [
      { name: 'Direct contact', id: 1, parent_id: null },
      { name: 'Indirect Contact', id: 2, parent_id: null },
      {
        name: 'With Other',
        id: 4,
        requires_additional_input: true,
        parent_id: 1,
      },
    ],
    presentationTypes: [
      { name: 'Sudden Onset', id: 1 },
      { name: ' Gradual Onset', id: 2 },
      { name: 'Unknown', id: 3 },
      { name: 'Other', id: 4, requires_additional_input: true },
    ],
    t: i18nextTranslateStub(),
  };

  const renderComponent = ({
    mockedProps = props,
    mockedContext = mockedIssueContextValue,
  }) =>
    render(
      <LocalizationProvider>
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 500, itemHeight: 500 }}
        >
          <Provider store={store}>
            <MockedIssueContextProvider issueContext={mockedContext}>
              <EditView {...mockedProps} />
            </MockedIssueContextProvider>
          </Provider>
        </VirtuosoMockContext.Provider>
      </LocalizationProvider>
    );

  const rerenderComponent = ({
    mockedProps = props,
    mockedContext = mockedIssueContextValue,
  }) =>
    component.rerender(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 500, itemHeight: 500 }}
      >
        <Provider store={store}>
          <MockedIssueContextProvider issueContext={mockedContext}>
            <EditView {...mockedProps} />
          </MockedIssueContextProvider>
        </Provider>
      </VirtuosoMockContext.Provider>
    );

  describe('Unlisted Event', () => {
    beforeEach(() => {
      component = renderComponent({
        mockedProps: {
          ...props,
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'game' },
          selectedEventId: null,
        },
        mockedContext: {
          ...mockedIssueContextValue,
          issueType: 'Illness',
        },
      });
    });

    it('sets the correct event value when the event is unlisted', () => {
      expect(component.getByText('Unlisted Game')).toBeInTheDocument();
    });

    it('calls the proper callback, when selecting a non listed event', async () => {
      const user = userEvent.setup();
      await user.click(component.getByText('Unlisted Game'));
      await user.click(component.getByText('Unlisted Practice'));
      expect(props.onSelectEvent).toHaveBeenCalledWith('', 'training');
    });
  });

  describe('Prior/NonFootball event', () => {
    it('renders the relevant injury content only', () => {
      component = renderComponent({
        mockedProps: {
          ...props,
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'nonfootball' },
        },
        mockedContext: mockedIssueContextValue,
      });

      expect(component.getByText('Event')).toBeInTheDocument();
      expect(component.queryByText('Mechanism')).not.toBeInTheDocument();
    });

    it('renders the relevant illness content only', () => {
      component = renderComponent({
        mockedProps: {
          ...props,
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'nonfootball' },
        },
        mockedContext: {
          ...mockedIssueContextValue,
          issueType: 'Illness',
        },
      });

      expect(component.getByText('Event')).toBeInTheDocument();
      expect(component.queryByText('Mechanism')).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] medical-additional-event-info-events with nonsport event', () => {
    beforeEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = false;
    });

    it('calls onSelectEvent when selection made', async () => {
      renderComponent({
        mockedProps: {
          ...props,
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'other' },
        },
        mockedContext: mockedIssueContextValue,
      });
      expect(screen.getByText('Event')).toBeInTheDocument();

      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.queryByText('Nonsport event')).not.toBeInTheDocument();

      const eventSelect = screen.getByLabelText('Event');
      selectEvent.openMenu(eventSelect);
      const user = userEvent.setup();
      await user.click(component.getByText('Nonsport event'));
      expect(props.onSelectEvent).toHaveBeenCalledWith('', 'nonsport');
    });

    it('renders the relevant injury content only', async () => {
      renderComponent({
        mockedProps: {
          ...props,
          eventType: 'nonsport',
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'nonsport' },
        },
        mockedContext: mockedIssueContextValue,
      });

      expect(screen.getByText('Event')).toBeInTheDocument();
      expect(screen.getByText('Nonsport event')).toBeInTheDocument();
      expect(screen.queryByText('Mechanism')).not.toBeInTheDocument();
    });

    it('renders the relevant illness content only', () => {
      renderComponent({
        mockedProps: {
          ...props,
          isGameOrTraining: false,
          details: { ...props.details, eventType: 'nonsport' },
        },
        mockedContext: {
          ...mockedIssueContextValue,
          issueType: 'Illness',
        },
      });

      expect(screen.getByText('Event')).toBeInTheDocument();
      expect(screen.getByText('Nonsport event')).toBeInTheDocument();
      expect(screen.queryByText('Mechanism')).not.toBeInTheDocument();
    });
  });

  describe('Other event', () => {
    beforeEach(() => {
      component = renderComponent({
        mockedProps: {
          ...props,
          details: { ...props.details, eventType: 'other' },
        },
        mockedContext: mockedIssueContextValue,
      });
    });

    it('renders the other event dropdowns', () => {
      expect(component.getByText('Event')).toBeInTheDocument();
      expect(component.getByText('Mechanism')).toBeInTheDocument();
      expect(component.queryByText('Presentation')).not.toBeInTheDocument();
      expect(component.queryByText('Contact Type')).not.toBeInTheDocument();
      expect(
        component.queryByText(
          'Additional description of injury mechanism/circumstances'
        )
      ).not.toBeInTheDocument();
    });

    it('renders the over event dropdown with the nfl-flow-fields feature flag', () => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      component = renderComponent({
        mockedProps: {
          ...props,
          details: { ...props.details, eventType: 'other' },
        },
        mockedContext: mockedIssueContextValue,
      });
      expect(component.getByText('Presentation')).toBeInTheDocument();
      expect(component.getByText('Contact Type')).toBeInTheDocument();
      expect(
        component.queryByText(
          'Additional description of injury mechanism/circumstances'
        )
      ).toBeInTheDocument();
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });
  });

  describe('date fields', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
    });
    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });

    it('renders the passed values for the reported date field', () => {
      component = renderComponent({
        mockedProps: {
          ...props,
          examinationDate: '2021-05-01',
          reportedDate: '2021-05-01',
        },
        mockedContext: mockedIssueContextValue,
      });

      expect(component.getByTestId('minimum-date')).toHaveTextContent(
        '2021-05-01'
      );
    });

    it('displays dates correctly when the issue is chronic', () => {
      component = renderComponent({
        mockedProps: {
          ...props,
          details: {
            ...props.details,
            issueDate: '2021-05-23',
            reportedDate: '2022-07-14',
          },
        },
        mockedContext: {
          ...mockedChronicIssueContextValue,
          issueType: 'Injury',
          isChronicIssue: true,
        },
      });

      const reportedDate = component.getByText('Reported date').closest('div');

      expect(within(reportedDate).getByRole('textbox')).toHaveValue(
        '2022-07-14'
      );
    });
  });

  describe('game/training event', () => {
    describe('nfl-injury-flow-fields turned off', () => {
      it('renders the game event dropdowns', () => {
        component = renderComponent({
          mockedProps: props,
          mockedContext: mockedIssueContextValue,
        });

        expect(component.getByText('Event')).toBeInTheDocument();
        expect(component.getByText('Mechanism')).toBeInTheDocument();
        expect(component.getByText('Position')).toBeInTheDocument();
        expect(component.getByText('Time of injury')).toBeInTheDocument();
        expect(component.queryByText('Presentation')).not.toBeInTheDocument();
        expect(component.queryByText('Contact Type')).not.toBeInTheDocument();
        expect(
          component.queryByText(
            'Additional description of injury mechanism/circumstances'
          )
        ).not.toBeInTheDocument();
      });

      it('renders the session selector', () => {
        component = renderComponent({
          mockedProps: {
            ...props,
            isFieldVisible: (name) => name === 'session_completed',
          },
          mockedContext: mockedIssueContextValue,
        });
        expect(component.getByText('Session completed')).toBeInTheDocument();
        expect(component.getByText('Yes')).toBeEnabled();
        expect(component.getByText('No')).toBeEnabled();
      });

      it('disables the dropdowns when a request is pending', () => {
        component = renderComponent({
          mockedProps: {
            ...props,
            selectedEventId: '426',
            isRequestPending: true,
            isFieldVisible: (name) => name === 'session_completed',
          },
          mockedContext: mockedIssueContextValue,
        });
        expect(component.getByText('Yes')).toBeDisabled();
        expect(component.getByText('No')).toBeDisabled();
      });
    });

    describe('nfl-injury-flow-fields turned on', () => {
      beforeEach(async () => {
        window.featureFlags['nfl-injury-flow-fields'] = true;

        component = renderComponent({
          mockedProps: { ...props, examinationDate: '2021-05-01' },
          mockedContext: mockedIssueContextValue,
        });
        await Promise.resolve(component);
      });

      afterEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('renders the game event dropdowns', () => {
        expect(component.getByText('Reported date')).toBeInTheDocument();
        expect(component.getByText('Presentation')).toBeInTheDocument();
        expect(component.getByText('Contact Type')).toBeInTheDocument();
        expect(component.getByText('injury_mechanism')).toBeInTheDocument();
        expect(
          component.getByText(
            'Additional description of injury mechanism/circumstances'
          )
        ).toBeInTheDocument();
      });

      it('calls on select detail selecting presentation type', async () => {
        const user = userEvent.setup();
        selectEvent.openMenu(component.getByLabelText('Presentation'));
        await user.click(component.getByText('Sudden Onset'));
        expect(props.onSelectDetail).toHaveBeenCalledWith(
          'presentationTypeId',
          1
        );
      });

      it('calls on select detail selecting contact type', async () => {
        selectEvent.openMenu(component.getByLabelText('Contact Type'));
        await selectEvent.select(
          component.container.querySelector(
            '.kitmanReactSelect__labelContainer'
          ),
          ['Direct contact']
        );
        await selectEvent.select(
          component.container.querySelector(
            '.kitmanReactSelect__labelContainer'
          ),
          ['With Other']
        );
        expect(props.onSelectDetail).toHaveBeenCalledWith(
          'issueContactType',
          4
        );
      });

      it('has the reporting date input with future dates disabled', async () => {
        expect(
          component.container.querySelector('.disable-future-dates')
        ).toBeInTheDocument();
      });

      it('should call onSelectDetail with the correct arguments when a reporting date is selected', async () => {
        const targetValue = '2018-03-10';
        const expectedValue = '2018-03-10T00:00:00.000Z';

        await fireEvent.change(
          component.getByRole('textbox', { name: /Reported date/i }),
          {
            target: { value: targetValue },
          }
        );

        expect(props.onSelectDetail).toHaveBeenCalledWith(
          'reportedDate',
          expectedValue
        );
      });
    });

    describe('PLAYER MOVEMENT', () => {
      beforeEach(async () => {
        window.featureFlags['nfl-injury-flow-fields'] = true;
        component = renderComponent({
          mockedProps: { ...props, athleteData: mockedPastAthlete },
          mockedContext: {
            ...mockedIssueContextValue,
            issue: {
              ...mockedIssueContextValue.issue,
              athlete_id: 5,
            },
          },
        });
        await Promise.resolve(component);
      });
      afterEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('sets the correct max date for the Reported date when viewing a past athlete', () => {
        expect(component.getByTestId('maximum-date')).toHaveTextContent(
          mockedPastAthlete.constraints.active_periods[0].end
        );
      });
      it('sets the correct min date for the Reported date when viewing a past athlete', () => {
        expect(component.queryAllByTestId('minimum-date')[1]).toHaveTextContent(
          props.details.issueDate
        );
      });
    });
  });

  describe('[chronic-conditions-updated-fields] FF', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['chronic-conditions-updated-fields'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['chronic-conditions-updated-fields'] = false;
    });

    it('only displays Reported date in Event details', () => {
      component = renderComponent({
        mockedProps: props,
        mockedContext: {
          ...mockedChronicIssueContextValue,
          issueType: 'Injury',
        },
      });

      expect(component.getByText('Reported date')).toBeInTheDocument();
      expect(component.getByText('Event')).toBeInTheDocument();
      expect(component.getByText('Mechanism')).toBeInTheDocument();

      rerenderComponent({
        mockedProps: props,
        mockedContext: {
          ...mockedChronicIssueContextValue,
          issueType: 'Injury',
          isChronicIssue: true,
        },
      });

      expect(component.getByText('Reported date')).toBeInTheDocument();
      expect(component.queryByText('Event')).not.toBeInTheDocument();
      expect(component.queryByText('Mechanism')).not.toBeInTheDocument();
    });
  });
});
