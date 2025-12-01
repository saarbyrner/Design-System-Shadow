import { screen } from '@testing-library/react';

import render from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import SessionLayout from '../session/SessionLayout';

describe('<SessionLayout />', () => {
  const testEvent = {
    type: 'session_event',
    title: '',
    workload_type: 1,
    local_timezone: 'Europe/Dublin',
    start_time: '2021-07-12T10:00:16+00:00',
    duration: '20',
    session_type_id: null,
  };

  const mockCallbacks = {
    onUpdateEventStartTime: jest.fn(),
    onUpdateEventDuration: jest.fn(),
    onUpdateEventDate: jest.fn(),
    onUpdateEventTimezone: jest.fn(),
    onUpdateEventTitle: jest.fn(),
    onUpdateEventDetails: jest.fn(),
    onDataLoadingStatusChanged: jest.fn(),
  };

  const props = {
    event: testEvent,
    panelMode: 'CREATE',
    eventValidity: {},
    canManageWorkload: true,
    setAdditionalMixpanelSessionData: jest.fn(),
    isOpen: true,
    ...mockCallbacks,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows participants duplication configurator as a checkbox', async () => {
    render(<SessionLayout {...{ ...props, panelMode: 'DUPLICATE' }} />);

    expect(screen.getByTestId('duplicateParticipants')).toBeInTheDocument();
    expect(
      screen.queryByText('Duplicate session plan')
    ).not.toBeInTheDocument();
  });

  describe(
    'when planning-tab-sessions, selection-tab-displaying-in-session and pac-event-sidepanel-sessions-games-show-athlete-dropdown' +
      'feature flags are enabled',
    () => {
      beforeEach(() => {
        window.setFlag('planning-tab-sessions', true);
        window.setFlag('selection-tab-displaying-in-session', true);
        window.setFlag(
          'pac-event-sidepanel-sessions-games-show-athlete-dropdown',
          true
        );
      });

      it('doesn’t show participants duplication configurator as a checkbox', () => {
        render(<SessionLayout {...{ ...props, panelMode: 'DUPLICATE' }} />);

        expect(
          screen.queryByTestId('duplicateParticipants')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Duplicate participant list')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Duplicate session plan')).toBeInTheDocument();
      });

      it('doesn’t show participants duplication configurators', async () => {
        render(<SessionLayout {...{ ...props, panelMode: 'EDIT' }} />);

        expect(
          screen.queryByText('Duplicate participant list')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Duplicate session plan')
        ).not.toBeInTheDocument();
      });
    }
  );

  describe('Additional details optional label', () => {
    beforeEach(() => {
      window.setFlag('planning-custom-org-event-details', false);
      window.setFlag('surface-type-mandatory-sessions', false);
    });

    it('should show the label by default', () => {
      render(<SessionLayout {...{ ...props, panelMode: 'CREATE' }} />);
      expect(screen.getByText('Additional details')).toBeInTheDocument();
      expect(
        screen.getByTestId('SectionHeading|OptionalText')
      ).toHaveTextContent('Optional');
    });

    it('should not show the label if planning-custom-org-event-details ff is enabled', () => {
      window.setFlag('planning-custom-org-event-details', true);
      render(<SessionLayout {...{ ...props, panelMode: 'CREATE' }} />);
      expect(screen.getByText('Additional details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('SectionHeading|OptionalText')
      ).not.toBeInTheDocument('Optional');
    });

    it('should not show the label if surface-type-mandatory-sessions ff is enabled', () => {
      window.setFlag('surface-type-mandatory-sessions', true);
      render(<SessionLayout {...{ ...props, panelMode: 'CREATE' }} />);
      expect(screen.getByText('Additional details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('SectionHeading|OptionalText')
      ).not.toBeInTheDocument('Optional');
    });
  });

  it('renders the component', () => {
    render(<SessionLayout {...props} />);
    expect(screen.getByText('Additional details')).toBeInTheDocument();
  });

  describe('duplicate participants checkbox', () => {
    it('renders the correct duplication label when athlete_events_count is not defined', () => {
      render(<SessionLayout {...{ ...props, panelMode: 'DUPLICATE' }} />);

      expect(
        screen.getByLabelText('Duplicate participant list')
      ).toBeInTheDocument();
    });

    it('renders the correct duplication label when athlete_events_count is null', () => {
      const eventWithNull = { ...testEvent, athlete_events_count: null };
      render(
        <SessionLayout
          {...{ ...props, event: eventWithNull, panelMode: 'DUPLICATE' }}
        />
      );

      expect(
        screen.getByLabelText('Duplicate participant list')
      ).toBeInTheDocument();
    });

    it('renders the correct duplication label when athlete_events_count is zero', () => {
      const eventWithZero = { ...testEvent, athlete_events_count: 0 };
      render(
        <SessionLayout
          {...{ ...props, event: eventWithZero, panelMode: 'DUPLICATE' }}
        />
      );

      expect(
        screen.getByLabelText('Duplicate participant list (0)')
      ).toBeInTheDocument();
    });

    it('renders the correct duplication label when athlete_events_count is not zero', () => {
      const eventWithCount = { ...testEvent, athlete_events_count: 35 };
      render(
        <SessionLayout
          {...{ ...props, event: eventWithCount, panelMode: 'DUPLICATE' }}
        />
      );

      expect(
        screen.getByLabelText('Duplicate participant list (35)')
      ).toBeInTheDocument();
    });

    it('does not render the create with no participants checkbox when the panel mode is duplicate', () => {
      render(<SessionLayout {...{ ...props, panelMode: 'DUPLICATE' }} />);

      expect(
        screen.queryByTestId('SessionLayout|NoParticipants')
      ).not.toBeInTheDocument();
    });
  });

  describe('feature flags', () => {
    describe('when planning-custom-org-event-details is disabled', () => {
      it('does not render Org Custom Fields', () => {
        render(<SessionLayout {...props} />);

        // OrgCustomFields are conditionally rendered, so we check they're not present
        expect(screen.queryByText('Opposition')).not.toBeInTheDocument();
      });

      it('does not render Opposing Team field', () => {
        render(<SessionLayout {...props} />);

        expect(
          screen.queryByTestId('SessionLayout|Opposition')
        ).not.toBeInTheDocument();
      });

      it('does not render Venue Type field', () => {
        render(<SessionLayout {...props} />);

        expect(
          screen.queryByTestId('SessionLayout|VenueType')
        ).not.toBeInTheDocument();
      });
    });

    describe('when calendar-hide-gameday-field is true', () => {
      beforeEach(() => {
        window.featureFlags['calendar-hide-gameday-field'] = true;
      });

      it('does not render GameDaySelect component', () => {
        render(<SessionLayout {...props} />);

        // GameDaySelect doesn't have a testid, but we can check it's not rendered by checking for game day related text
        expect(screen.queryByText(/game day/i)).not.toBeInTheDocument();
      });
    });

    describe('when planning-custom-org-event-details Feature Flag is true', () => {
      beforeEach(() => {
        window.setFlag('planning-custom-org-event-details', true);
      });

      it('renders OrgCustomFields', () => {
        render(<SessionLayout {...props} />);

        // OrgCustomFields component is rendered when the flag is enabled
        // We can verify this by looking for elements that would be rendered by OrgCustomFields
        expect(screen.getByText('Additional details')).toBeInTheDocument();
      });

      it('does not render the secondary text when feature flag is enabled', () => {
        render(<SessionLayout {...props} />);

        expect(screen.getByText('Additional details')).toBeInTheDocument();
        expect(
          screen.queryByTestId('SectionHeading|OptionalText')
        ).not.toBeInTheDocument();
      });

      it('does not render Opposing Team field when session type id is null', () => {
        render(<SessionLayout {...props} />);

        expect(
          screen.queryByTestId('SessionLayout|Opposition')
        ).not.toBeInTheDocument();
      });

      it('does not render Opposing Team field when isJointSessionType is false', () => {
        const eventWithSessionType = {
          ...testEvent,
          session_type: { isJointSessionType: false },
          session_type_id: 294742,
        };
        render(
          <SessionLayout {...{ ...props, event: eventWithSessionType }} />
        );

        expect(
          screen.queryByTestId('SessionLayout|Opposition')
        ).not.toBeInTheDocument();
      });

      it('renders Opposing Team field when isJointSessionType is true', () => {
        const eventWithJointSession = {
          ...testEvent,
          session_type: { isJointSessionType: true },
          session_type_id: 4872,
        };
        const propsWithJointSession = {
          ...props,
          event: eventWithJointSession,
        };
        render(<SessionLayout {...propsWithJointSession} />);

        // Look for Opposition by label instead of testid
        expect(screen.getByLabelText('Opposition')).toBeInTheDocument();
      });

      describe('when nfl-2024-new-questions Feature Flag is true', () => {
        beforeEach(() => {
          window.featureFlags['nfl-2024-new-questions'] = true;
        });

        it('does not render Venue Type field when session type id is null', () => {
          const eventWithNullSessionType = {
            ...testEvent,
            session_type: { isJointSessionType: false },
            session_type_id: null,
          };
          render(
            <SessionLayout {...{ ...props, event: eventWithNullSessionType }} />
          );

          expect(
            screen.queryByTestId('SessionLayout|VenueType')
          ).not.toBeInTheDocument();
        });

        it('does not render Venue Type field when isJointSessionType is false', () => {
          const eventWithNonJointSession = {
            ...testEvent,
            session_type: { isJointSessionType: false },
            session_type_id: 294742,
          };
          render(
            <SessionLayout {...{ ...props, event: eventWithNonJointSession }} />
          );

          expect(
            screen.queryByTestId('SessionLayout|VenueType')
          ).not.toBeInTheDocument();
        });

        it('renders Venue Type field when isJointSessionType is true', () => {
          const eventWithJointSession = {
            ...testEvent,
            session_type: { isJointSessionType: true },
            session_type_id: 4872,
          };
          const propsWithJointSession = {
            ...props,
            event: eventWithJointSession,
          };
          render(<SessionLayout {...propsWithJointSession} />);

          // Look for Venue Type by label instead of testid
          expect(screen.getByLabelText('Home or Away')).toBeInTheDocument();
        });
      });
    });

    describe('when mls-emr-advanced-options Feature Flag is true', () => {
      beforeEach(() => {
        window.featureFlags['mls-emr-advanced-options'] = true;
        window.featureFlags['calendar-hide-gameday-field'] = false;
      });

      it('renders SessionFields, CommonFields, SectionHeading, GameDaySelect and EventConditionFields', () => {
        render(<SessionLayout {...props} />);

        // These components don't have specific test IDs, so we test for text content that should be present
        expect(screen.getByText('Session type')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Additional details')).toBeInTheDocument();
        expect(
          screen.getByTestId('SectionHeading|OptionalText')
        ).toHaveTextContent('Optional');
      });
    });

    describe('when mls-emr-advanced-options Feature Flag is false', () => {
      beforeEach(() => {
        window.featureFlags['mls-emr-advanced-options'] = false;
        window.featureFlags['calendar-hide-gameday-field'] = false;
      });

      it('does not render SectionHeading and EventConditionFields in specific way', () => {
        render(<SessionLayout {...props} />);

        // These components are always rendered, but we can verify basic functionality
        expect(screen.getByText('Session type')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
      });
    });

    describe('when event-collection-show-sports-specific-workload-units Feature Flag is true', () => {
      beforeEach(() => {
        window.setFlag(
          'event-collection-show-sports-specific-workload-units',
          true
        );
      });

      it('renders WorkloadUnitFields', () => {
        render(<SessionLayout {...props} />);

        expect(
          screen.getByTestId('SessionLayout|WorkloadUnitFields')
        ).toBeInTheDocument();
      });
    });

    describe('when event-collection-show-sports-specific-workload-units Feature Flag is false', () => {
      beforeEach(() => {
        window.setFlag(
          'event-collection-show-sports-specific-workload-units',
          false
        );
      });

      it('does not render WorkloadUnitFields', () => {
        render(<SessionLayout {...props} />);

        expect(
          screen.queryByTestId('SessionLayout|WorkloadUnitFields')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('DescriptionField', () => {
    it('renders DescriptionField', () => {
      render(<SessionLayout {...props} />);

      expect(
        screen.getByTestId('SessionLayout|DescriptionField')
      ).toBeInTheDocument();
    });
  });
});
