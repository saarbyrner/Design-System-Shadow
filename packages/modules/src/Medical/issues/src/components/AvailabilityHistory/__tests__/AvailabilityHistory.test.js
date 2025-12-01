import $ from 'jquery';
import moment from 'moment-timezone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import AvailabilityHistory from '../index';
import { mockedDefaultPermissionsContextValue } from '../../../../../shared/utils/testUtils';

jest.mock('../../../../../shared/hooks/useIssueFields', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../../../../../shared/hooks/useIssueFields'),
    validate: (fields) => {
      const validateArr = [];
      Object.keys(fields).forEach((field) => {
        if (!fields[field]) validateArr.push(field);
      });
      return validateArr;
    },
    getFieldLabel: (name) => name,
  }),
}));

describe('Availability History', () => {
  window.featureFlags = {};
  let component;
  const props = {
    t: i18nextTranslateStub(),
    injuryStatuses: [
      {
        cause_unavailability: true,
        description: 'Out',
        id: 1,
        injury_status_system_id: 1,
        order: 1,
        restore_availability: false,
      },
      {
        cause_unavailability: true,
        description: 'Full',
        id: 2,
        injury_status_system_id: 2,
        order: 2,
        restore_availability: true,
        is_resolver: false,
      },
      {
        cause_unavailability: true,
        description: 'Resolved',
        id: 4,
        injury_status_system_id: 4,
        order: 4,
        restore_availability: true,
        is_resolver: true,
      },
    ],
  };

  const defaultOrgInfo = {
    organisation: {
      id: 1,
      name: 'Arsenal',
      coding_system_key: codingSystemKeys.OSICS_10,
    },
  };

  const initialStore = storeFake({
    toasts: [],
  });
  const useDispatchMock = jest.fn();
  initialStore.dispatch = useDispatchMock;

  beforeEach(() => {
    jest.resetAllMocks();
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const componentRender = (
    context,
    mockStore,
    defaultPerms = mockedDefaultPermissionsContextValue,
    defaultOrg = defaultOrgInfo,
    defaultProps = props
  ) =>
    renderWithProvider(
      <MockedOrganisationContextProvider organisationContext={defaultOrg}>
        <MockedIssueContextProvider issueContext={context}>
          <MockedPermissionContextProvider permissionsContext={defaultPerms}>
            <AvailabilityHistory {...defaultProps} />
          </MockedPermissionContextProvider>
        </MockedIssueContextProvider>
      </MockedOrganisationContextProvider>,

      mockStore
    );

  describe('initial render', () => {
    const mockedContext = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        events: [
          {
            ...mockedIssueContextValue.issue.events[0],
            id: 4,
            injury_status_id: 2,
            event_date: '2022-02-11T00:00:00+00:00',
            date: '2022-02-11T00:00:00+00:00',
            injury_status: {
              id: 4,
              description: 'Resolved',
              cause_unavailability: true,
              restore_availability: true,
            },
          },
          {
            ...mockedIssueContextValue.issue.events[1],
            id: 6,
            injury_status_id: 1,
            event_date: '2022-02-10T00:00:00+00:00',
            date: '2022-02-10T00:00:00+00:00',
          },
          {
            ...mockedIssueContextValue.issue.events[2],
            id: 7,
            injury_status_id: 2,
            event_date: '2022-02-10T00:00:00+00:00',
            date: '2022-02-10T00:00:00+00:00',
          },
        ],
        events_order: [7, 6, 4],
        events_duration: { 4: 28, 6: 1, 7: 3 },
      },
    };
    beforeEach(() => {
      component = componentRender(mockedContext, initialStore);
    });

    it('renders the Availability History title', () => {
      expect(component.getByText('Availability history')).toBeInTheDocument();
    });

    it('renders the status information', () => {
      expect(component.getByText('Current status')).toBeInTheDocument();
      expect(
        component.container.getElementsByClassName('icon-bin').length
      ).toEqual(0);
      expect(component.getByText('Previous status')).toBeInTheDocument();
      expect(component.getByText('3')).toBeInTheDocument();
      expect(component.getByText('2')).toBeInTheDocument();
      expect(component.getByText('1')).toBeInTheDocument();
      expect(
        component.getByText('Feb 11, 2022 - Present:')
      ).toBeInTheDocument();
      expect(
        component.getAllByText('Feb 10, 2022 - Feb 10, 2022:').length
      ).toBe(2);
      expect(
        component.getAllByText('Causing unavailability (time-loss)').length
      ).toEqual(2);
      expect(component.getByText('Resolved')).toBeInTheDocument();
      expect(component.getAllByText('Updated by:').length).toEqual(3);
      expect(component.getAllByText('Bob Sacamano').length).toEqual(3);
      expect(component.getAllByText('Duration:').length).toEqual(2);
    });

    it('renders the availability summary', () => {
      expect(component.getByText('Availability summary')).toBeInTheDocument();
      expect(component.getByText('Total duration:')).toBeInTheDocument();
      expect(component.getByText('29 days')).toBeInTheDocument();
      expect(component.getByText('Total unavailability:')).toBeInTheDocument();
      expect(component.getAllByText('1 days')[1]).toBeInTheDocument();
    });
  });

  describe('[regression] multiple events with different start dates', () => {
    const localMockedIssueContextValue = {
      issue: mockIssueData.issueMultipleEvents,
      issueType: 'Injury',
      requestStatus: 'SUCCESS',
      updateIssue: jest.fn(),
    };

    beforeEach(() => {
      component = componentRender(localMockedIssueContextValue, initialStore);
    });

    it('renders the correct dates', () => {
      expect(
        component.getByText('Jul 19, 2022 - Present:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Jul 14, 2022 - Jul 18, 2022:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Jul 9, 2022 - Jul 13, 2022:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Jun 30, 2022 - Jul 8, 2022:')
      ).toBeInTheDocument();
    });
  });

  describe('[regression] two event on the same date', () => {
    const localMockedIssueContextValue = {
      issue: mockIssueData.issueSameEventDates,
      issueType: 'Injury',
      requestStatus: 'SUCCESS',
      updateIssue: jest.fn(),
    };

    beforeEach(() => {
      component = componentRender(localMockedIssueContextValue, initialStore);
    });

    it('renders the correct dates', () => {
      expect(
        component.getByText('Jun 30, 2022 - Present:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Jun 30, 2022 - Jun 30, 2022:')
      ).toBeInTheDocument();
    });
  });

  describe('Correct end dates being before start date', () => {
    const localMockedIssueContextValue = {
      issue: mockIssueData.issueManySameEventDates,
      issueType: 'Injury',
      requestStatus: 'SUCCESS',
      updateIssue: jest.fn(),
    };

    beforeEach(() => {
      component = componentRender(localMockedIssueContextValue, initialStore);
    });

    it('renders the correct dates', () => {
      expect(
        component.getByText('Apr 26, 2024 - Present:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Apr 26, 2024 - Apr 26, 2024:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Apr 23, 2024 - Apr 25, 2024:')
      ).toBeInTheDocument();
      expect(
        component.getByText('Apr 23, 2024 - Apr 23, 2024:')
      ).toBeInTheDocument();
    });
  });

  describe('[permission] injuryStatus.canDelete', () => {
    let mockRequest;

    const mockDeletePerms = {
      ...mockedDefaultPermissionsContextValue,
      permissions: {
        medical: {
          ...mockedDefaultPermissionsContextValue.permissions.medical,
          injuryStatus: {
            canDelete: true,
          },
        },
      },
    };

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve({}));
    });

    describe('unresolved status', () => {
      beforeEach(() => {
        component = componentRender(
          mockedIssueContextValue,
          initialStore,
          mockDeletePerms
        );
      });

      it('renders the bin icon for the current status', () => {
        expect(
          component.container.querySelector('.icon-bin')
        ).toBeInTheDocument();
      });

      it('renders the delete status modal when the icon is clicked', async () => {
        await userEvent.click(component.container.querySelector('.icon-bin'));
        expect(
          component.getByText(
            'This will delete the current status. You will not be able to undo this action.'
          )
        ).toBeInTheDocument();
        expect(component.getByText('Cancel')).toBeInTheDocument();
        expect(component.getByText('Delete')).toBeInTheDocument();
      });

      it('removes the modal when the cancel button is clicked', async () => {
        await userEvent.click(component.container.querySelector('.icon-bin'));
        await userEvent.click(component.getByText('Cancel'));
        expect(
          component.queryByText(
            'This will delete the current status. You will not be able to undo this action.'
          )
        ).not.toBeInTheDocument();
      });

      it('fires off a deleteEvent api call when the delete button in the modal is clicked', async () => {
        await userEvent.click(component.container.querySelector('.icon-bin'));
        await userEvent.click(component.getByText('Delete'));
        expect(mockRequest).toHaveBeenCalledWith({
          contentType: 'application/json',
          data: JSON.stringify({
            scope_to_org: true,
          }),
          headers: { 'X-CSRF-Token': undefined },
          method: 'POST',
          url: '/athletes/15642/injuries/3/delete_last_event',
        });
        expect(useDispatchMock).toHaveBeenCalledWith({
          payload: {
            toast: {
              description: '',
              id: '',
              status: 'SUCCESS',
              title: 'Status Deleted Successfully',
            },
          },
          type: 'ADD_TOAST',
        });
      });
    });

    describe('resolved status', () => {
      it('displays the deleting resolved status text when the current status is resolved', async () => {
        const resolvedIssueContext = {
          issue: {
            ...mockIssueData.issueSameEventDates,
            events: [
              {
                id: 1,
                injury_status_id: 1,
                event_date: '2022-01-13T00:00:00+00:00',
                date: '2022-01-13T00:00:00+00:00',
                injury_status: {
                  id: 4,
                  description: 'Resolved',
                  cause_unavailability: false,
                  restore_availability: false,
                },
                created_by: {
                  id: 9876,
                  fullname: 'Bob Sacamano',
                },
                updated_at: '2018-08-29T15:53:17+01:00',
              },
              {
                id: 2,
                injury_status_id: 1,
                event_date: '2022-01-13T00:00:00+00:00',
                date: '2022-01-13T00:00:00+00:00',
                injury_status: {
                  id: 1,
                  description: 'Unresolved',
                  cause_unavailability: true,
                  restore_availability: false,
                },
                created_by: {
                  id: 9876,
                  fullname: 'Bob Sacamano',
                },
                updated_at: '2018-08-29T15:53:17+01:00',
              },
            ],
            events_order: [1],
            total_duration: 9,
            unavailability_duration: 1,
            events_duration: {
              1: 9,
            },
          },
          issueType: 'Injury',
          requestStatus: 'SUCCESS',
          updateIssue: jest.fn(),
        };

        component = componentRender(
          resolvedIssueContext,
          initialStore,
          mockDeletePerms
        );

        await userEvent.click(component.container.querySelector('.icon-bin'));
        expect(
          component.getByText(
            'This will delete the current status and reopen the injury. You will not be able to undo this action.'
          )
        ).toBeInTheDocument();
      });
    });

    describe('editing a injury status', () => {
      const mockIssueContextSingleEvent = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [mockedIssueContextValue.issue.events[0]],
          events_order: [mockedIssueContextValue.issue.events_order[0]],
        },
      };

      const mockEditPerms = {
        ...mockedDefaultPermissionsContextValue,
        permissions: {
          medical: {
            ...mockedDefaultPermissionsContextValue.permissions.medical,
            issues: { canEdit: true },
          },
        },
      };
      beforeEach(() => {
        component = componentRender(
          mockIssueContextSingleEvent,
          initialStore,
          mockEditPerms
        );
      });

      it('renders the edit button when there is only 1 injury status', () => {
        expect(component.getByText('Edit')).toBeInTheDocument();
      });
      it('displays the current status to be edited when the edit button is clicked', async () => {
        await userEvent.click(component.getByText('Edit'));
        expect(component.queryByText('Add status')).not.toBeInTheDocument();
        expect(component.queryByText('Add')).not.toBeInTheDocument();
        expect(component.getByText('Status')).toBeInTheDocument();
        expect(component.getByText('Full')).toBeInTheDocument();
        expect(component.getByText('Date')).toBeInTheDocument();
      });
    });

    describe('prior org issue', () => {
      const mockIssueContextSingleEvent = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          events: [mockedIssueContextValue.issue.events[0]],
          events_order: [mockedIssueContextValue.issue.events_order[0]],
        },
        isReadOnly: true,
      };
      const mocIssueContextReadOnlyEvents = {
        ...mockedIssueContextValue,
        isReadOnly: true,
      };

      it('does not render the edit button when it is a prior org issue', () => {
        component = componentRender(mockIssueContextSingleEvent, initialStore);
        expect(component.queryByText('Edit')).not.toBeInTheDocument();
      });

      it('does not render the delete  button when it is a prior org issue', () => {
        component = componentRender(
          mocIssueContextReadOnlyEvents,
          initialStore
        );
        expect(
          component.queryByTestId('current-status-bin')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('[REGRESSION] when player has left the club', () => {
    afterEach(() => {
      window.featureFlags = {};
    });

    it('does not render the edit status button if the player has left the club', async () => {
      const mockedContext = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          player_left_club: true,
          events: [
            {
              ...mockedIssueContextValue.issue.events[0],
              id: 1,
              injury_status_id: 2,
              event_date: '2022-02-11T00:00:00+00:00',
              date: '2022-02-11T00:00:00+00:00',
              injury_status: {
                id: 4,
                description: 'Open',
                cause_unavailability: true,
                restore_availability: true,
              },
            },
          ],
          events_order: [1],
          events_duration: { 1: 28 },
        },
      };

      const mockEditPerms = {
        ...mockedDefaultPermissionsContextValue,
        permissions: {
          medical: {
            ...mockedDefaultPermissionsContextValue.permissions.medical,
            issues: { canEdit: true },
          },
        },
      };

      const localComponent = componentRender(
        mockedContext,
        initialStore,
        mockEditPerms
      );

      expect(localComponent.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('does not render the bin icon buttons if the player has left the club', async () => {
      const mockedContext = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          player_left_club: true,
          events: [
            {
              ...mockedIssueContextValue.issue.events[0],
              id: 1,
              injury_status_id: 2,
              event_date: '2022-02-11T00:00:00+00:00',
              date: '2022-02-11T00:00:00+00:00',
              injury_status: {
                id: 4,
                description: 'Open',
                cause_unavailability: true,
                restore_availability: true,
              },
            },
            {
              ...mockedIssueContextValue.issue.events[0],
              id: 2,
              injury_status_id: 2,
              event_date: '2022-02-11T00:00:00+00:00',
              date: '2022-02-11T00:00:00+00:00',
              injury_status: {
                id: 4,
                description: 'Open',
                cause_unavailability: true,
                restore_availability: true,
              },
            },
          ],
          events_order: [1, 2],
          events_duration: { 1: 28, 2: 69 },
        },
      };

      const mockEditPerms = {
        ...mockedDefaultPermissionsContextValue,
        permissions: {
          medical: {
            ...mockedDefaultPermissionsContextValue.permissions.medical,
            issues: { canEdit: true },
          },
        },
      };

      const localComponent = componentRender(
        mockedContext,
        initialStore,
        mockEditPerms
      );

      expect(
        localComponent.queryByTestId('current-status-bin')
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] preliminary-injury-illness', () => {
    beforeEach(() => {
      window.featureFlags['preliminary-injury-illness'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    describe('render for a activity_type of a game', () => {
      beforeEach(() => {
        component = componentRender(
          {
            ...mockedIssueContextValue,
            issue: { ...mockIssueData.chronicIssue, events: [] },
          },
          initialStore
        );
      });

      it('renders the preliminary status header and count', () => {
        expect(component.getByText('Preliminary status:')).toBeInTheDocument();
        expect(component.getByText('7 outstanding')).toBeInTheDocument();
      });

      it('renders the preliminary status area with conditional questions present and activity id', () => {
        expect(
          component.getByText('conditional_questions')
        ).toBeInTheDocument();
        expect(component.getByText('activity_id')).toBeInTheDocument();
      });
    });

    describe('render for a activity_type of a nonfootball', () => {
      beforeEach(() => {
        component = componentRender(
          {
            ...mockedIssueContextValue,
            issue: {
              ...mockIssueData.chronicIssue,
              events: [],
              activity_type: 'nonfootball',
            },
          },
          initialStore
        );
      });

      it('renders the preliminary status area where conditional questions and activity id are missing', () => {
        expect(component.getByText('3 outstanding')).toBeInTheDocument();
        expect(
          component.queryByText('conditional_questions')
        ).not.toBeInTheDocument();
        expect(component.queryByText('activity_id')).not.toBeInTheDocument();
      });
    });

    describe('render for a recurrence', () => {
      const clinicalImpressionsOrg = {
        organisation: {
          id: 1,
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      };

      beforeEach(() => {
        window.featureFlags['supplemental-recurrence-code'] = true;

        component = componentRender(
          {
            ...mockedIssueContextValue,
            issue: {
              ...mockIssueData.issueWithClinicalImpressions,
              has_recurrence: true,
            },
          },
          initialStore,
          mockedDefaultPermissionsContextValue,
          clinicalImpressionsOrg
        );
      });

      it('renders the preliminary status area where supplementary recurrence is missing', () => {
        expect(component.getByText('3 outstanding')).toBeInTheDocument();
        expect(component.getByText('side_id')).toBeInTheDocument();
        expect(component.getByText('primary_pathology_id')).toBeInTheDocument();
        expect(
          component.getByText('supplemental_recurrence_id')
        ).toBeInTheDocument();
      });
    });
  });
});
