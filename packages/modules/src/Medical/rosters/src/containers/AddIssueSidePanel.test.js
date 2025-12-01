import { screen } from '@testing-library/react';
import moment from 'moment';
import {
  storeFake,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import { formatISODate } from '@kitman/common/src/utils/dateFormatter';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import { minimalSquadAthletes as mockSquadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as mockPresentationTypes } from '@kitman/services/src/mocks/handlers/medical/getPresentationTypes';
import { data as mockContactTypes } from '@kitman/services/src/mocks/handlers/medical/getIssueContactTypes';
import { data as mockMechanisms } from '@kitman/services/src/mocks/handlers/medical/getInjuryMechanisms';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  useGetSidesQuery,
  useGetPresentationTypesQuery,
  useGetIssueContactTypesQuery,
  useGetInjuryMechanismsQuery,
  useLazyGetAthleteDataQuery,
  useGetPermittedSquadsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  useGetActivityGroupsQuery,
  useGetPositionGroupsQuery,
  useGetBamicGradesQuery,
  useGetSquadAthletesQuery,
  useGetInjuryStatusesQuery,
  useGetActiveSquadQuery,
  useGetPreliminarySchemaQuery,
} from '../../../shared/redux/services/medical';

import AddIssueSidePanel from './AddIssueSidePanel';

const mockCodingSystemKeys = codingSystemKeys;

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  useGetSidesQuery: jest.fn(),
  useGetPresentationTypesQuery: jest.fn(),
  useGetActivityGroupsQuery: jest.fn(),
  useGetIssueContactTypesQuery: jest.fn(),
  useGetInjuryMechanismsQuery: jest.fn(),
  useLazyGetAthleteDataQuery: jest.fn(),
  useGetPermittedSquadsQuery: jest.fn(),
  useGetPositionGroupsQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
  useGetBamicGradesQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
  useGetInjuryStatusesQuery: jest.fn(),
  useGetPreliminarySchemaQuery: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/hooks/useIssueFields', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/hooks/useIssueFields'
    ),
    validate: (fields) => {
      const validateArr = [];
      Object.keys(fields).forEach((field) => {
        if (!fields[field]) validateArr.push(field);
      });
      return validateArr;
    },
    getFieldLabel: (name) => name,
    isFieldVisible: () => true,
    fieldConfigRequestStatus: 'SUCCESS',
  }),
}));
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('Add Issue Sidepanel', () => {
  const props = {
    initialDataRequestStatus: 'SUCCESS',
    positionGroups: [
      {
        id: 25,
        name: 'Forward',
        order: 1,
        positions: [
          {
            id: 72,
            name: 'Loose-head Prop',
            order: 1,
            abbreviation: null,
          },
          {
            id: 71,
            name: 'Hooker',
            order: 2,
            abbreviation: null,
          },
          {
            id: 70,
            name: 'Tight-head Prop',
            order: 3,
            abbreviation: null,
          },
          {
            id: 73,
            name: 'Second Row',
            order: 4,
            abbreviation: null,
          },
          {
            id: 74,
            name: 'Blindside Flanker',
            order: 5,
            abbreviation: null,
          },
          {
            id: 75,
            name: 'Openside Flanker',
            order: 6,
            abbreviation: null,
          },
          {
            id: 76,
            name: 'No. 8',
            order: 7,
            abbreviation: null,
          },
        ],
      },
      {
        id: 26,
        name: 'Back',
        order: 2,
        positions: [
          {
            id: 77,
            name: 'Scrum Half',
            order: 8,
            abbreviation: null,
          },
          {
            id: 78,
            name: 'Out Half',
            order: 9,
            abbreviation: null,
          },
          {
            id: 79,
            name: 'Inside Centre',
            order: 10,
            abbreviation: null,
          },
          {
            id: 80,
            name: 'Outside Centre',
            order: 11,
            abbreviation: null,
          },
          {
            id: 81,
            name: 'Wing',
            order: 12,
            abbreviation: null,
          },
          {
            id: 82,
            name: 'Fullback',
            order: 13,
            abbreviation: null,
          },
        ],
      },
      {
        id: 27,
        name: 'Other',
        order: 3,
        positions: [
          {
            id: 83,
            name: 'Other',
            order: 14,
            abbreviation: null,
          },
        ],
      },
    ],
    squadAthletesOptions: [],
    isFieldVisible: () => true,
    permissions: {
      medical: {
        availability: {
          canView: true,
          canEdit: true,
        },
        issues: {
          canView: true,
          canEdit: true,
          canCreate: true,
          canExport: true,
          canArchive: false,
        },
        notes: {
          ...DEFAULT_CONTEXT_VALUE.permissions.medical.notes,
          canCreate: true,
        },
      },
    },
  };

  const initialStore = storeFake({
    app: { commentsGridRequestStatus: 'SUCCESS' },
    addIssuePanel: { ...getDefaultAddIssuePanelStore(), isOpen: true },
    globalApi: {
      useGetOrganisationQuery: jest.fn(),
      useGetPermissionsQuery: jest.fn(),
      useGetPreferencesQuery: jest.fn(),
      useGetCurrentUserQuery: jest.fn(),
    },
    medicalApi: {
      useGetConditionalFieldsFormQuery: jest.fn(),
      useGetPresentationTypesQuery: jest.fn(),
      useGetPreliminarySchemaQuery: jest.fn(),
    },
  });

  const defaultOrgInfo = {
    organisation: {
      id: 1,
      name: 'Shels',
      coding_system_key: mockCodingSystemKeys.OSICS_10,
    },
  };

  const componentRender = (mockStore, organisationInfo) => {
    const orgContextToUse = organisationInfo || defaultOrgInfo;

    return renderWithProvider(
      <MockedOrganisationContextProvider organisationContext={orgContextToUse}>
        <AddIssueSidePanel {...props} />
      </MockedOrganisationContextProvider>,
      mockStore
    );
  };

  beforeEach(() => {
    window.setFlag('pm-preliminary-ga', true);
    jest.useFakeTimers();

    useGetSidesQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Left' },
        { id: 2, name: 'Right' },
      ],
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: { id: 1, name: 'Test', owner_id: 1234 },
    });
    useGetActivityGroupsQuery.mockReturnValue({ data: [] });
    useGetPositionGroupsQuery.mockReturnValue({
      data: {
        id: 28,
        name: 'Goalkeeper',
        order: 1,
        positions: [
          {
            id: 84,
            name: 'Goalkeeper',
            order: 1,
            abbreviation: 'GK',
          },
        ],
      },
      isLoading: false,
    });
    useGetBamicGradesQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Grade 0',
        sites: [
          { id: 1, name: 'a - myofascial (peripheral)' },
          { id: 2, name: 'b - myotendinous / muscular' },
          { id: 4, name: 'Unknown' },
        ],
      },
      isLoading: true,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: mockSquadAthletes,
    });
    useGetInjuryStatusesQuery.mockReturnValue({
      data: [
        {
          id: 1,
          injury_status_system_id: 1,
          description: 'string',
          color: 'string',
          restore_availability: true,
          cause_unavailability: true,
          order: 1,
          is_resolver: true,
        },
      ],
    });
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
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useGetPreliminarySchemaQuery.mockReturnValue({
      data: {
        issue_type: 'mandatory',
        athlete: {
          id: 'mandatory',
        },
        occurrence_date: 'mandatory',
        squad: {
          id: 'mandatory',
        },
        created_by: 'mandatory',
        title: 'optional',
        issue_occurrence_onset_id: 'must_have',
        examination_date: 'must_have',
        statuses: 'must_have',
        primary_pathology: {
          type: 'must_have',
          id: 'must_have',
        },
        side: {
          id: 'must_have',
        },
        activity: {
          id: 'must_have',
        },
        position_when_injured_id: 'must_have',
        occurrence_min: 'must_have',
        event: {
          type: 'must_have',
          id: 'must_have',
        },
        session_completed: 'must_have',
        logic_builder: 'must_have',
      },
      isError: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the component structure', async () => {
    componentRender(initialStore);
    const sidePanel = screen.getByTestId('sliding-panel');
    const sidePanelTitle = screen.getByTestId('sliding-panel|title');
    expect(sidePanel).toBeInTheDocument();
    expect(sidePanelTitle).toHaveTextContent('Add injury/ illness');
  });

  describe('preliminary schema', () => {
    it('is called with the correct date', async () => {
      componentRender(initialStore);
      expect(useGetPreliminarySchemaQuery).toHaveBeenCalledWith(
        {
          issue_type: 'new_injury',
          issue_occurrence_date: formatISODate(moment()),
        },
        { skip: false }
      );
    });

    it('is not called when the feature flag is off', async () => {
      window.setFlag('pm-preliminary-ga', false);
      componentRender(initialStore);
      expect(useGetPreliminarySchemaQuery).toHaveBeenCalledWith(
        {
          issue_type: 'new_injury',
          issue_occurrence_date: formatISODate(moment()),
        },
        { skip: true }
      );
    });

    it('is not called when the panel is not open', async () => {
      const store = storeFake({
        addIssuePanel: { ...getDefaultAddIssuePanelStore(), isOpen: false },
      });
      componentRender(store);
      expect(useGetPreliminarySchemaQuery).toHaveBeenCalledWith(
        {
          issue_type: 'new_injury',
          issue_occurrence_date: formatISODate(moment()),
        },
        { skip: true }
      );
    });

    it('is called with a different date', async () => {
      jest.setSystemTime(new Date('2020-01-01'));
      componentRender(initialStore);
      expect(useGetPreliminarySchemaQuery).toHaveBeenCalledWith(
        {
          issue_type: 'new_injury',
          issue_occurrence_date: formatISODate(moment('2020-01-01')),
        },
        { skip: false }
      );
    });
  });

  it('renders the page headers (panel stage progress indicator)', async () => {
    componentRender(initialStore);
    const containers = document.querySelectorAll('[class$="headingStyle"]');
    expect(containers.length).toBe(4);
    expect(containers[0]).toHaveTextContent('Initial Information');
    expect(containers[1]).toHaveTextContent('Diagnosis Information');
    expect(containers[2]).toHaveTextContent('Event Information');
    expect(containers[3]).toHaveTextContent('Additional Information');
  });

  it('calls the sides service when Org coding system is NOT Osiics15', async () => {
    componentRender(initialStore); // Osics10 is default
    expect(useGetSidesQuery).toHaveBeenCalledWith(null, { skip: false });
  });

  it('does NOT call the sides service when Org coding system is Osiics15', async () => {
    const mockOsiics15OrgData = {
      organisation: {
        id: 1,
        name: 'Bohs',
        coding_system_key: mockCodingSystemKeys.OSIICS_15,
      },
    };
    componentRender(initialStore, mockOsiics15OrgData);
    expect(useGetSidesQuery).toHaveBeenCalledWith(null, { skip: true });
  });

  describe('formValidation', () => {
    it('Next button is enabled when all mandatory fields have values', () => {
      componentRender(initialStore);
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeEnabled();
    });
  });
});
