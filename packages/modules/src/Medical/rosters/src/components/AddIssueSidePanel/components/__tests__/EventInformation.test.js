import { screen, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPresentationTypesQuery,
  useGetIssueContactTypesQuery,
  useGetInjuryMechanismsQuery,
  useGetPermittedSquadsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useLazyGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import EventInformation from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/EventInformation';

import {
  getGameAndTrainingOptions,
  getAdditionalEventOptions,
} from '@kitman/modules/src/Medical/shared/utils';

import { data as mockGameAndTrainingOptions } from '@kitman/services/src/mocks/handlers/getGameAndTrainingOptions';
import { data as mockPresentationTypes } from '@kitman/services/src/mocks/handlers/medical/getPresentationTypes';
import { data as mockContactTypes } from '@kitman/services/src/mocks/handlers/medical/getIssueContactTypes';
import { data as mockMechanisms } from '@kitman/services/src/mocks/handlers/medical/getInjuryMechanisms';
// eslint-disable-next-line jest/no-mocks-import
import mockGameOptions from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/__mocks__/mockGameOptions';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/components/src/DatePicker');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});
const store = storeFake({
  medicalApi: {
    useGetPresentationTypesQuery: jest.fn(),
    useGetIssueContactTypesQuery: jest.fn(),
    useGetInjuryMechanismsQuery: jest.fn(),
    useGetPermittedSquadsQuery: jest.fn(),
  },
  medicalSharedApi: {
    useLazyGetAthleteDataQuery: jest.fn(),
  },
});

describe('<EventInformation />', () => {
  beforeEach(() => {
    useGetPresentationTypesQuery.mockReturnValue({
      data: mockPresentationTypes,
      isError: false,
      isLoading: false,
    });
    useGetIssueContactTypesQuery.mockReturnValue({
      data: mockContactTypes,
      isError: false,
      isLoading: false,
    });
    useGetInjuryMechanismsQuery.mockReturnValue({
      data: mockMechanisms,
      isError: false,
      isLoading: false,
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      jest.fn(),
      {
        data: {},
        isFetching: false,
      },
    ]);
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [{ id: 10, name: 'Squad 10' }],
    });
  });

  const props = {
    athleteIDProps: {
      value: 111,
    },
    occurrenceDateProps: {
      isVisible: false,
      isInvalid: false,
      fieldLabel: 'Onset date',
      selectedDiagnosisDate: '2022-09-13T10:12:51.894Z',
      onSelectDiagnosisDate: jest.fn(),
    },
    gameIDProps: {
      isVisible: true,
      options: [],
      onSelectEvent: jest.fn(),
      fieldLabel: 'Event',
      value: null,
    },
    activityIDProps: {
      value: null,
      options: mockGameOptions,
      isVisible: false,
      isOtherVisible: false,
      fieldLabel: 'Mechanism',
      onSelectActivity: jest.fn(),
      freeText: '',
      onFreetextChange: jest.fn(),
      textareaLabel: 'Test Mechanism Label',
    },
    positionWhenInjuredProps: {
      value: null,
      options: [],
      onSelectPositionWhenInjured: jest.fn(),
      fieldLabel: 'Position',
      isVisible: false,
    },
    sessionCompletedProps: {
      onSelect: jest.fn(),
      selectedSessionCompleted: null,
      fieldLabel: 'Session completed',
      isVisible: false,
    },
    timeOfInjuryProps: {
      onSetTimeOfInjury: jest.fn(),
      timeOfInjury: '2022-09-13T10:12:51.894Z',
      fieldLabel: 'Time of injury',
      isVisible: false,
    },
    mechanismDescriptionProps: {
      value: '',
      onChange: jest.fn(),
    },
    presentationTypeProps: {
      onSelect: jest.fn(),
      onUpdateFreeText: jest.fn(),
      value: null,
      fieldLabel: 'Presentation',
      isVisible: false,
      textareaLabel: 'Test Presentation Label',
    },
    issueContactTypeProps: {
      onSelect: jest.fn(),
      value: null,
      fieldLabel: 'Contact Type',
      onUpdateFreeText: jest.fn(),
      isVisible: false,
      textareaLabel: 'Test Issue Contact Label',
    },
    injuryMechanismProps: {
      onSelect: jest.fn(),
      value: null,
      fieldLabel: 'Primary activity at time of injury',
      freeText: '',
      onFreetextChange: jest.fn(),
      isVisible: false,
      textareaLabel: 'Test Injury Mechanism Label',
    },
    squadProps: {
      squadId: null,
    },
    isGameOrTraining: false,
    selectedEvent: null,
    t: i18nextTranslateStub(),
  };

  describe('[FEATURE FLAG] medical-additional-event-info-events is on', () => {
    beforeEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = false;
    });

    it('renders the additional event options', async () => {
      const mockEvents = getGameAndTrainingOptions(
        mockGameAndTrainingOptions,
        false
      );
      const otherEvents = getAdditionalEventOptions(
        mockGameAndTrainingOptions.other_events
      );
      mockEvents.push(...otherEvents);
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            gameIDProps={{ ...props.gameIDProps, options: mockEvents }}
          />
        </Provider>
      );

      expect(screen.getByText('Event')).toBeInTheDocument();

      const eventSelect = screen.getByLabelText('Event');
      selectEvent.openMenu(eventSelect);
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByText('Nonsport event')).toBeInTheDocument();
      await user.click(screen.getByText('Nonsport event'));

      expect(props.gameIDProps.onSelectEvent).toHaveBeenCalledWith(
        'other_nonsport'
      );
    });
  });

  describe('[FEATURE FLAG] medical-additional-event-info-events is off', () => {
    beforeEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = false;
    });

    it('renders the default event options', async () => {
      const mockEvents = getGameAndTrainingOptions(
        mockGameAndTrainingOptions,
        false
      );
      const otherEvents = getAdditionalEventOptions(
        mockGameAndTrainingOptions.other_events
      );
      mockEvents.push(...otherEvents);
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            gameIDProps={{ ...props.gameIDProps, options: mockEvents }}
          />
        </Provider>
      );

      expect(screen.getByText('Event')).toBeInTheDocument();

      const eventSelect = screen.getByLabelText('Event');
      selectEvent.openMenu(eventSelect);
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByText('Unlisted Game')).toBeInTheDocument();
      expect(screen.queryByText('Nonsport event')).not.toBeInTheDocument();

      await user.click(screen.getByText('Other'));
      expect(props.gameIDProps.onSelectEvent).toHaveBeenCalledWith(
        'other_other'
      );
    });
  });

  describe('squad selector', () => {
    it('renders correctly', () => {
      render(
        <Provider store={store}>
          <EventInformation {...props} squadProps={{ squadId: 10 }} />
        </Provider>
      );

      const squadSelector = screen.getByLabelText('Occurred in Squad');

      expect(squadSelector).toBeInTheDocument();
    });

    it('hides squad selector when issue is chronic condition', () => {
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            squadProps={{ squadId: 10 }}
            isChronicCondition
          />
        </Provider>
      );

      expect(
        screen.queryByLabelText('Occurred in Squad')
      ).not.toBeInTheDocument();
    });

    it('renders event selector with events grouped by squad', async () => {
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            squadProps={{ squadId: 10 }}
            gameIDProps={{
              fieldLabel: 'Event',
              options: [
                {
                  label: 'Squad 1',
                  options: [{ label: 'Event 1', value: '1_game' }],
                },
              ],
              isVisible: true,
            }}
          />
        </Provider>
      );

      const eventSelector = await screen.findByLabelText('Event');

      expect(eventSelector).toBeInTheDocument();

      selectEvent.openMenu(eventSelector);

      expect(screen.getByText('Squad 1')).toBeInTheDocument();
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });

    it('shows disclaimer when the squads do not match', async () => {
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            squadProps={{ squadId: 10 }}
            gameIDProps={{
              fieldLabel: 'Event',
              options: [
                {
                  label: 'Squad 1',
                  options: [{ label: 'Event 1', value: '1_game' }],
                },
              ],
              gameOptions: [
                {
                  name: 'Conditioning & Weightlifting',
                  value: 1,
                  event_id: 64748,
                  squad: {
                    id: 1,
                    name: 'Squad 1',
                  },
                  training_date: '2024-06-25T05:33:07-05:00',
                },
              ],
              value: '1_game',
              isVisible: true,
            }}
          />
        </Provider>
      );

      expect(
        screen.getByText(
          'The event chosen belongs to Squad 1. The injury will be reported as occurring for Squad 10.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('[FORM FIELDS]', () => {
    let user;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it('calls onSelectDiagnosisDate when onset date selected', async () => {
      const mockOnSelectDiagnosisDate = jest.fn();
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            occurrenceDateProps={{
              ...props.occurrenceDateProps,
              isVisible: true,
              onSelectDiagnosisDate: mockOnSelectDiagnosisDate,
            }}
          />
        </Provider>
      );

      const onsetDateInput = screen.getByLabelText('Onset date');
      expect(onsetDateInput).toBeInTheDocument();

      fireEvent.change(onsetDateInput, { target: { value: '08/01/2019' } });

      expect(mockOnSelectDiagnosisDate).toHaveBeenCalled();
    });

    it('calls onSelectEvent when a game is selected', async () => {
      const mockOnSelectEvent = jest.fn();
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            gameIDProps={{
              ...props.gameIDProps,
              isVisible: true,
              onSelectEvent: mockOnSelectEvent,
              options: [{ label: 'Dummy Event', value: 'dummy' }],
            }}
          />
        </Provider>
      );
      const eventSelect = screen.getByLabelText('Event');
      expect(eventSelect).toBeInTheDocument();
      selectEvent.openMenu(eventSelect);
      await user.click(screen.getByText('Dummy Event'));

      expect(mockOnSelectEvent).toHaveBeenCalledWith('dummy');
    });

    it('calls onSelect when option selected for session completed', async () => {
      const mockOnSelect = jest.fn();
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            sessionCompletedProps={{
              ...props.sessionCompletedProps,
              isVisible: true,
              onSelect: mockOnSelect,
            }}
            isGameOrTraining
            selectedEvent="game"
          />
        </Provider>
      );

      const sessionCompletedLabel = screen.getByText('Session completed');
      expect(sessionCompletedLabel).toBeInTheDocument();

      const yesButton = screen.getByRole('button', { name: 'Yes' });
      expect(yesButton).toBeInTheDocument();
      const noButton = screen.getByRole('button', { name: 'No' });
      expect(noButton).toBeInTheDocument();

      await user.click(yesButton);
      expect(mockOnSelect).toHaveBeenCalledWith('YES');

      await user.click(noButton);
      expect(mockOnSelect).toHaveBeenCalledWith('NO');
    });

    it('calls onSetTimeOfInjury when time entered', () => {
      const mockOnSetTimeOfInjury = jest.fn();
      render(
        <Provider store={store}>
          <EventInformation
            {...props}
            timeOfInjuryProps={{
              ...props.timeOfInjuryProps,
              isVisible: true,
              onSetTimeOfInjury: mockOnSetTimeOfInjury,
            }}
            isGameOrTraining
            selectedEvent="game"
          />
        </Provider>
      );

      const injuryTimeInput = screen.getByRole('spinbutton');
      expect(injuryTimeInput).toBeInTheDocument();

      fireEvent.change(injuryTimeInput, { target: { value: '111' } });
      expect(mockOnSetTimeOfInjury).toHaveBeenCalledWith('111');
    });

    describe('when the "injury-onset-time-selector" feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['injury-onset-time-selector'] = true;
      });
      afterEach(() => {
        window.featureFlags['injury-onset-time-selector'] = false;
      });

      it('calls onSetTimeOfInjury from TimePicker', async () => {
        const mockOnSetTimeOfInjury = jest.fn();

        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              timeOfInjuryProps={{
                ...props.timeOfInjuryProps,
                onSetTimeOfInjury: mockOnSetTimeOfInjury,
                isVisible: true,
              }}
              isGameOrTraining
              selectedEvent="game"
            />
          </Provider>
        );

        const injuryTimePicker = screen.getAllByRole('textbox')[2];
        expect(injuryTimePicker).toBeInTheDocument();
        expect(injuryTimePicker).toHaveClass('rc-time-picker-input');

        await user.click(injuryTimePicker);
        await user.click(screen.getAllByText('12')[0]);

        expect(mockOnSetTimeOfInjury).toHaveBeenCalled();
      });
    });

    describe('when the "nfl-injury-flow-fields" feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = true;
      });
      afterEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('displays the extra fields when selectedEvent is other', async () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              gameIDProps={{
                ...props.gameIDProps,
                isVisible: true,
              }}
              injuryMechanismProps={{
                ...props.injuryMechanismProps,
                isVisible: true,
              }}
              positionWhenInjuredProps={{
                ...props.positionWhenInjuredProps,
                isVisible: true,
              }}
              activityIDProps={{
                ...props.activityIDProps,
                isVisible: true,
              }}
              presentationTypeProps={{
                ...props.presentationTypeProps,
                isVisible: true,
              }}
              issueContactTypeProps={{
                ...props.issueContactTypeProps,
                isVisible: true,
              }}
              isGameOrTraining
              selectedEvent="other"
            />
          </Provider>
        );

        expect(screen.getByLabelText('Event')).toBeInTheDocument();
        expect(screen.getByLabelText('Mechanism')).toBeInTheDocument();
        expect(screen.getByLabelText('Position')).toBeInTheDocument();
        expect(screen.getByLabelText('Presentation')).toBeInTheDocument();
        expect(screen.getByLabelText('Contact Type')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Additional Description of Injury Mechanism/Circumstances'
          )
        ).toBeInTheDocument();
      });

      it('displays a textarea for activity needing additional input and calls onSelectActivity', async () => {
        const mockOnSelectActivity = jest.fn();
        const mockOnFreetextChange = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              activityIDProps={{
                ...props.activityIDProps,
                isVisible: true,
                value: 'dummy_activity',
                isOtherVisible: true,
                onSelectActivity: mockOnSelectActivity,
                onFreetextChange: mockOnFreetextChange,
                options: [
                  {
                    label: 'Dummy Activity',
                    value: 'dummy_activity',
                    requiresText: true,
                  },
                ],
              }}
              isGameOrTraining
              selectedEvent="other"
            />
          </Provider>
        );

        const otherReasonTextareaLabel = screen.getByText(
          'Test Mechanism Label'
        );
        expect(otherReasonTextareaLabel).toBeInTheDocument();

        const otherReasonTextarea = screen.getAllByRole('textbox')[3];
        expect(otherReasonTextarea).toHaveAttribute(
          'name',
          'AddAvailabilityReopen|OtherReason'
        );

        fireEvent.change(otherReasonTextarea, {
          target: { value: 'Some activity details' },
        });
        expect(mockOnFreetextChange).toHaveBeenCalledWith(
          'Some activity details'
        );

        const activitySelect = screen.getByLabelText('Mechanism');
        expect(activitySelect).toBeInTheDocument();

        selectEvent.openMenu(activitySelect);
        const dummyOption = screen.getAllByText('Dummy Activity')[1];
        expect(dummyOption).toHaveClass('kitmanReactSelect__option');
        await user.click(dummyOption);

        expect(mockOnSelectActivity).toHaveBeenCalledWith('dummy_activity');
      });

      it('does not display text area when activity NOT "other"', async () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              activityIDProps={{
                ...props.activityIDProps,
                isVisible: true,
                value: 'some_value',
              }}
              isGameOrTraining
              selectedEvent="game"
            />
          </Provider>
        );

        const activitySelect = screen.getByLabelText('Mechanism');
        expect(activitySelect).toBeInTheDocument();

        expect(
          screen.queryByText('Test Mechanism Label')
        ).not.toBeInTheDocument();
      });

      it('calls onSelectPositionWhenInjured on selection', async () => {
        const mockOnSelectPositionWhenInjured = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              positionWhenInjuredProps={{
                ...props.positionWhenInjuredProps,
                isVisible: true,
                onSelectPositionWhenInjured: mockOnSelectPositionWhenInjured,
                options: [{ label: 'Dummy Position', value: 'dummy_position' }],
              }}
              isGameOrTraining
              selectedEvent="game"
            />
          </Provider>
        );

        const positionSelect = screen.getByLabelText('Position');
        expect(positionSelect).toBeInTheDocument();

        selectEvent.openMenu(positionSelect);
        await user.click(screen.getByText('Dummy Position'));

        expect(mockOnSelectPositionWhenInjured).toHaveBeenCalledWith(
          'dummy_position'
        );
      });

      it('calls onSelect for presentation on selection', async () => {
        const mockOnSelect = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              presentationTypeProps={{
                ...props.presentationTypeProps,
                isVisible: true,
                onSelect: mockOnSelect,
                options: mockPresentationTypes,
              }}
              isGameOrTraining
              selectedEvent="game"
            />
          </Provider>
        );

        const presentationSelect = screen.getByLabelText('Presentation');
        expect(presentationSelect).toBeInTheDocument();

        selectEvent.openMenu(presentationSelect);
        await user.click(screen.getByText(mockPresentationTypes[0].name));

        expect(mockOnSelect).toHaveBeenCalledWith(mockPresentationTypes[0].id);
      });

      it('calls onSelect for issue contact type on selection', async () => {
        const mockOnSelect = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              issueContactTypeProps={{
                ...props.issueContactTypeProps,
                isVisible: true,
                onSelect: mockOnSelect,
                options: mockContactTypes,
              }}
              isGameOrTraining
            />
          </Provider>
        );

        const contactTypeSelect = screen.getByLabelText('Contact Type');
        expect(contactTypeSelect).toBeInTheDocument();

        selectEvent.openMenu(contactTypeSelect);
        await user.click(screen.getByText(mockContactTypes[2].name));

        expect(mockOnSelect).toHaveBeenCalledWith(mockContactTypes[2].id);
      });

      it('displays a textarea for contact type needing additional input', async () => {
        const mockOnSelect = jest.fn();

        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              issueContactTypeProps={{
                ...props.issueContactTypeProps,
                isVisible: true,
                value: 4,
                onSelect: mockOnSelect,
                options: mockContactTypes,
              }}
              isGameOrTraining
            />
          </Provider>
        );

        const otherReasonTextareaLabel = screen.getByText(
          'Test Issue Contact Label'
        );
        expect(otherReasonTextareaLabel).toBeInTheDocument();
      });

      it('calls onSelect when selecting Injury Mechanism', async () => {
        const mockOnSelect = jest.fn();
        render(
          <Provider store={store}>
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 10000, itemHeight: 50 }}
            >
              <EventInformation
                {...props}
                injuryMechanismProps={{
                  ...props.injuryMechanismProps,
                  value: 2,
                  isVisible: true,
                  onSelect: mockOnSelect,
                  options: mockMechanisms,
                }}
                isGameOrTraining
              />
            </VirtuosoMockContext.Provider>
          </Provider>
        );
        const mechanismSelect = screen.getByLabelText(
          'Primary activity at time of injury'
        );
        expect(mechanismSelect).toBeInTheDocument();

        selectEvent.openMenu(mechanismSelect);
        const option = screen.getByText(mockMechanisms[14].name);
        expect(option).toBeInTheDocument();

        await user.click(option);

        expect(mockOnSelect).toHaveBeenCalled();
        expect(mockOnSelect).toHaveBeenCalledWith(mockMechanisms[14].id);
      });

      it('displays a textarea for injury mechanism needing additional input', async () => {
        const mockOnFreetextChange = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              injuryMechanismProps={{
                ...props.injuryMechanismProps,
                value: 15,
                isVisible: true,
                onFreetextChange: mockOnFreetextChange,
              }}
              isGameOrTraining
            />
          </Provider>
        );

        const otherReasonTextareaLabel = screen.getByText(
          'Test Injury Mechanism Label'
        );
        expect(otherReasonTextareaLabel).toBeInTheDocument();

        const otherReasonTextarea = screen.getAllByRole('textbox')[4];
        expect(otherReasonTextarea).toHaveAttribute(
          'name',
          'AddAvailabilityReopen|OtherReason'
        );

        fireEvent.change(otherReasonTextarea, {
          target: { value: 'Mechanism details' },
        });
        expect(mockOnFreetextChange).toHaveBeenCalledWith('Mechanism details');
      });

      it('renders the additional description', async () => {
        const mockOnChange = jest.fn();
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              mechanismDescriptionProps={{
                ...props.mechanismDescriptionProps,
                onChange: mockOnChange,
              }}
              isGameOrTraining
            />
          </Provider>
        );

        const additionalDescriptionTextareaLabel = screen.getByText(
          'Additional Description of Injury Mechanism/Circumstances'
        );
        expect(additionalDescriptionTextareaLabel).toBeInTheDocument();

        const otherReasonTextarea = screen.getAllByRole('textbox')[2];
        expect(otherReasonTextarea).toBeInTheDocument();

        fireEvent.change(otherReasonTextarea, {
          target: { value: 'Some additional details' },
        });
        expect(mockOnChange).toHaveBeenCalledWith('Some additional details');
      });
    });

    describe('when the injury is a continuation', () => {
      it('shows a disclaimer when the event is a game', async () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              issueIsAContinuation
              eventType="game"
            />
          </Provider>
        );
        expect(
          screen.getByText('Game from a previous organization')
        ).toBeInTheDocument();
      });

      it('shows a disclaimer when the event is a training session', async () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              issueIsAContinuation
              eventType="training"
            />
          </Provider>
        );
        expect(
          screen.getByText('Training session from a previous organization')
        ).toBeInTheDocument();
      });

      it('shows a disclaimer when the event type is other', async () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              issueIsAContinuation
              eventType="other"
            />
          </Provider>
        );
        expect(
          screen.getByText('Other event from a previous organization')
        ).toBeInTheDocument();
      });
    });

    describe('when the event type is nonfootball/prior', () => {
      it('when it is nonfootball only renders the event option', () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              eventType="nonfootball"
              isGameOrTraining={false}
              selectedEvent="other"
              gameIDProps={{
                ...props.gameIDProps,
                isVisible: true,
              }}
            />
          </Provider>
        );
        expect(screen.getByLabelText('Event')).toBeInTheDocument();
        expect(screen.queryByLabelText('Mechanism')).not.toBeInTheDocument();
      });

      it('when it is prior only renders the event option', () => {
        render(
          <Provider store={store}>
            <EventInformation
              {...props}
              eventType="prior"
              isGameOrTraining={false}
              selectedEvent="other"
              gameIDProps={{
                ...props.gameIDProps,
                isVisible: true,
              }}
            />
          </Provider>
        );
        expect(screen.getByLabelText('Event')).toBeInTheDocument();
        expect(screen.queryByLabelText('Mechanism')).not.toBeInTheDocument();
      });
    });
  });
});
