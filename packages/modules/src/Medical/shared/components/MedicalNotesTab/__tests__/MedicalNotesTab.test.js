import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { axios } from '@kitman/common/src/utils/services';
import {
  data as mockedMedicalNotes,
  diagnosticNoteData,
} from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import { data as mockAthleteDataResponse } from '@kitman/services/src/mocks/handlers/getAthleteData';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import MedicalNotesTab from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/contexts/IssueContext');
jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalApi: {},
  medicalHistory: {},
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),

    queries: {
      'getAthleteData(1)': {
        status: 'fulfilled',
        isLoading: false,
        data: { constraints: { active_periods: [] } },
      },
      'getAthleteData(1000)': {
        status: 'fulfilled',
        isLoading: false,
        data: { constraints: { active_periods: [] } },
      },
    },
  },
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
  },
});

describe('<MedicalNotesTab />', () => {
  beforeEach(() => {
    useIssue.mockReturnValue({
      issue: mockIssueData.issue,
      issueType: 'Injury',
      requestStatus: 'SUCCESS',
    });

    useGetAthleteDataQuery.mockReturnValue(mockAthleteDataResponse);

    useOrganisation.mockReturnValue({
      organisation: {
        id: 1,
      },
    });

    useGetOrganisationQuery.mockReturnValue({
      data: [],
      isError: false,
      isSuccess: true,
    });
  });

  const props = { t: i18nextTranslateStub() };

  it('initial tab load', () => {
    render(
      <Provider store={store}>
        <MedicalNotesTab {...props} />
      </Provider>
    );

    expect(screen.getByText('Notes')).toBeInTheDocument();

    // Find filter components - Should be two of each
    // One for web and one for mobile/responsive
    expect(screen.getAllByText('Roster')).toHaveLength(2);
    expect(screen.getAllByText('Author')).toHaveLength(2);
    expect(screen.getAllByText('Note type')).toHaveLength(2);
  });

  it('load add notes tab', () => {
    render(
      <Provider store={store}>
        <MedicalNotesTab {...props} />
      </Provider>
    );

    expect(screen.getByText('Add medical note')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Athlete')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();

    // note area
    expect(screen.getByText('Copy last note')).toBeInTheDocument();
    expect(screen.getByText('S.O.A.P notes')).toBeInTheDocument();

    expect(screen.getByText('Associated injury/ illness')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();

    // Add file button
    expect(screen.getByText('Add')).toBeInTheDocument();

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('load data and validate in document', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: mockedMedicalNotes,
    });

    render(
      <Provider store={store}>
        <MedicalNotesTab {...props} />
      </Provider>
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Rehab update')).toBeInTheDocument();
    });
    expect(screen.getByText('Marcius Vega')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Collision during tackle in match against the Seahawks. Initial diagnoses suggested fracture. Game medic referred to local hospital. X-Ray was inconclusive, referred to CT. MRI performed as well, these both pointed towards Lateral Malleolus Fracture and mild Medial Malleolus Fracture, consulting surgeon recommended operating. Open reduction and internal fixation (ORIF) recommended by consultant. Three screws and plates fitted by surgeon for Lateral Malleolus Fracture. Bone graft required for Medial Malleolus Fracture and screws fixed to aid recovery. Allow 6 - 8 weeks for recovery, full p...'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Gordon_Morales Rehab Plan Jan 2021.pdf')
    ).toBeInTheDocument();

    expect(screen.getByText('Diagnostic Athlete')).toBeInTheDocument();
  });

  it('uses the correct athlete id for Diagnostic notes', async () => {
    const user = userEvent.setup();

    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: diagnosticNoteData,
    });

    render(
      <Provider store={store}>
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                notes: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <MedicalNotesTab {...props} />
        </PermissionsContext.Provider>
      </Provider>
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Diagnostic Athlete')).toBeInTheDocument();
    });

    const noteCardLayout = screen.getByTestId('NoteCardLayout|Content');
    expect(noteCardLayout).toBeInTheDocument();

    const actionMenu = within(noteCardLayout).getByRole('button');
    expect(actionMenu).toBeInTheDocument();
    await user.click(actionMenu);

    const editAction = screen.getByTestId('TooltipMenu|ListItemButton');
    expect(editAction).toHaveTextContent('Edit');

    useGetAthleteDataQuery.mockClear();

    await user.click(editAction);

    // Does not get called with annotationable.id
    expect(useGetAthleteDataQuery).not.toHaveBeenCalledWith(500, {
      skip: false,
    });
    // Gets called with the correct athlete id (annotationable.athlete.id)
    expect(useGetAthleteDataQuery).toHaveBeenCalledWith(10000, { skip: false });
  });

  it('load no data and validate message', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        medical_notes: [],
        total_count: 0,
        meta: {},
      },
    });

    render(
      <Provider store={store}>
        <MedicalNotesTab {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No notes for this period')).toBeInTheDocument();
    });
  });

  it('shows the error status on error', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Test Error'));

    render(
      <Provider store={store}>
        <MedicalNotesTab {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    expect(screen.getByText('Go back and try again')).toBeInTheDocument();
  });
});
