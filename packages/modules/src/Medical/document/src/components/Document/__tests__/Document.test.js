import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/getMedicalDocument';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { entityAttachments } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';
import {
  useGetAthleteIssuesQuery,
  useGetDocumentNoteCategoriesQuery,
  useGetAthleteDataQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { updateFormAnswersSetLinkedIssues } from '@kitman/services/src/services/medical';
import { data as mockAthleteDataResponse } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { medicalAttachmentCategories } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/getMedicalAttachmentCategories';
import {
  usePermissions,
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { Provider } from 'react-redux';
import Document from '..';

jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  updateFormAnswersSetLinkedIssues: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetDocumentNoteCategoriesQuery: jest.fn(),
    useGetAthleteIssuesQuery: jest.fn(),
    useGetAthleteDataQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

jest.mock('@kitman/services/src/services/getAthleteData', () => ({
  ...jest.requireActual('@kitman/services/src/services/getAthleteData'),
  getAthleteData: jest.fn(),
}));

const DOCUMENT_CREATED_BY_TEST_ID = 'DocumentDetailsTab|DocumentCreatedBy';

const mockStore = storeFake({
  medicalSharedApi: {
    useGetDocumentNoteCategoriesQuery: jest.fn(), // Does this get used?
    useGetAthleteIssuesQuery: jest.fn(),
    useGetAthleteDataQuery: jest.fn(),
  },
});

const chronicIssueSectionTitle = 'Linked chronic condition';

const setupMocks = () => {
  usePermissions.mockReturnValue({
    permissions: {
      ...DEFAULT_CONTEXT_VALUE.permissions,
      medical: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical,
        documents: {
          canEdit: true,
        },
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  });

  useGetAthleteIssuesQuery.mockReturnValue({
    data: {
      ...data.groupedIssues,
      recurrence_outside_system: false,
      continuation_outside_system: false,
    },
    error: false,
    isLoading: false,
  });

  useGetDocumentNoteCategoriesQuery.mockReturnValue({
    data: medicalAttachmentCategories.medical_attachment_categories,
    error: false,
    isLoading: false,
  });

  useGetAthleteDataQuery.mockReturnValue(mockAthleteDataResponse);
};

describe('<Document /> V2 Document', () => {
  const props = {
    document: documentData,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (document = props.document) => {
    render(
      <Provider store={mockStore}>
        <Document {...props} document={document} />
      </Provider>
    );
  };

  beforeEach(() => {
    setupMocks();
  });

  describe('[FEATURE FLAG] medical-files-tab-enhancement ON', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('requests athlete issues with correct athlete id', () => {
      renderComponent();

      expect(useGetAthleteIssuesQuery).toHaveBeenCalledWith(
        { athleteId: 1, grouped: true },
        { skip: false }
      );
    });
  });

  describe('[FEATURE FLAG] medical-files-tab-enhancement OFF', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('skips requests for athlete issues', () => {
      renderComponent();

      expect(useGetAthleteIssuesQuery).toHaveBeenCalledWith(
        {
          athleteId: 1,
          grouped: true,
        },
        { skip: true }
      );
    });
  });

  it('renders the chronic issues section if FF is enabled', () => {
    window.featureFlags = { 'chronic-injury-illness': true };

    renderComponent();

    expect(screen.getByText(chronicIssueSectionTitle)).toBeInTheDocument();
  });

  it('does not render the chronic issues section if FF is disabled', () => {
    window.featureFlags = { 'chronic-injury-illness': false };

    renderComponent();

    expect(
      screen.queryByText(chronicIssueSectionTitle)
    ).not.toBeInTheDocument();
  });

  describe('should construct added by strings correctly', () => {
    it('renders added on section if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: null },
        created_by_organisation: null,
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText('Added on Feb 28, 2023 by John Doe')
      ).toBeInTheDocument();
    });

    it('renders created by section if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: { fullname: 'John Doe' } },
        created_by_organisation: null,
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText('Added on Feb 28, 2023 by John Doe')
      ).toBeInTheDocument();
    });

    it('renders all sections if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: { fullname: 'John Doe' } },
        created_by_organisation: { name: 'Kitman Football' },
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText(
          'Added on Feb 28, 2023 by John Doe (Kitman Football)'
        )
      ).toBeInTheDocument();
    });

    it('should only render notes section for V2 documents', () => {
      renderComponent();
      expect(screen.getByText('Note')).toBeInTheDocument();
    });
  });
});

describe('<Document /> Medical Attachment', () => {
  const props = {
    document: entityAttachments[0], // document_v2
    t: i18nextTranslateStub(),
  };

  const renderComponent = (document = props.document) => {
    render(
      <Provider store={mockStore}>
        <Document {...props} document={document} />
      </Provider>
    );
  };

  beforeEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = true;

    setupMocks();
  });

  it('requests athlete issues with correct athlete id', () => {
    renderComponent();

    expect(useGetAthleteIssuesQuery).toHaveBeenCalledWith(
      { athleteId: 15642, grouped: true },
      { skip: false }
    );
  });

  it('renders the chronic issues section if FF is enabled', () => {
    window.featureFlags = { 'chronic-injury-illness': true };
    renderComponent();

    expect(screen.getByText(chronicIssueSectionTitle)).toBeInTheDocument();

    expect(
      screen.getByText('No chronic condition linked.')
    ).toBeInTheDocument();
  });

  it('does not render the chronic issues section if FF is disabled', () => {
    window.featureFlags = { 'chronic-injury-illness': false };
    renderComponent();

    expect(
      screen.queryByText(chronicIssueSectionTitle)
    ).not.toBeInTheDocument();
  });

  describe('should construct added by strings correctly', () => {
    it('renders added on section if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: null },
        created_by_organisation: null,
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText('Added on Feb 28, 2023 by John Doe')
      ).toBeInTheDocument();
    });

    it('renders created by section if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: { fullname: 'John Doe' } },
        created_by_organisation: null,
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText('Added on Feb 28, 2023 by John Doe')
      ).toBeInTheDocument();
    });

    it('renders all sections if present', () => {
      renderComponent({
        ...documentData,
        created_at: '2023-02-28T12:14:13Z',
        attachment: { created_by: { fullname: 'John Doe' } },
        created_by_organisation: { name: 'Kitman Football' },
      });

      const container = screen.getByTestId(DOCUMENT_CREATED_BY_TEST_ID);

      expect(
        within(container).getByText(
          'Added on Feb 28, 2023 by John Doe (Kitman Football)'
        )
      ).toBeInTheDocument();
    });
  });

  it('should only render notes section for V2 documents', () => {
    renderComponent();
    expect(screen.queryByText('Note')).not.toBeInTheDocument();
  });
});

describe('<Document /> Form answers set entity', () => {
  beforeEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = true;

    setupMocks();
  });

  afterEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = false;
    jest.restoreAllMocks();
  });

  const props = {
    document: entityAttachments[2], // form_answers_set
    t: i18nextTranslateStub(),
  };

  const renderComponent = (document = props.document) => {
    render(
      <Provider store={mockStore}>
        <Document {...props} document={document} />
      </Provider>
    );
  };

  it('does an a call to updateFormAnswersSetLinkedIssues on editing linked issues', async () => {
    const user = userEvent.setup();

    renderComponent();

    expect(screen.getByText('Associated injury / illness')).toBeInTheDocument();
    expect(screen.getByText('No injury/illness linked.')).toBeInTheDocument();
    expect(screen.queryByText('Note')).not.toBeInTheDocument(); // should not render notes section

    expect(useGetAthleteIssuesQuery).toHaveBeenCalledWith(
      { athleteId: 15642, grouped: true },
      { skip: false }
    );

    const addInjuryIllnessButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addInjuryIllnessButton);

    const dropdown = screen.getByLabelText('Injury/illness');
    await user.click(dropdown);

    const ankleInjury = screen.getByText(
      'Nov 11, 2020 - Ankle Fracture (Left)'
    );
    await user.click(ankleInjury);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(updateFormAnswersSetLinkedIssues).toHaveBeenCalledWith(
      props.document.entity.id,
      {
        illness_occurrence_ids: [],
        injury_occurrence_ids: [1],
      }
    );
  });
});

describe('ON TRIAL ATHLETES', () => {
  beforeEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = true;

    setupMocks();
  });

  afterEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = false;
    jest.restoreAllMocks();
  });

  const props = {
    document: entityAttachments[2], // form_answers_set
    t: i18nextTranslateStub(),
  };

  const renderComponent = (document = props.document) => {
    render(
      <Provider store={mockStore}>
        <Document {...props} document={document} />
      </Provider>
    );
  };

  it('renders the edit button for athletes NOT on trial', async () => {
    renderComponent();

    const editInjuryIllnessButton = screen.getByRole('button', {
      name: 'Edit',
    });

    expect(editInjuryIllnessButton).toBeInTheDocument();
  });

  it('does not render the edit button for athletes ON TRIAL', async () => {
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          organisation_status: 'TRIAL_ATHLETE',
          active_periods: [],
        },
      },
    });

    renderComponent();

    const editInjuryIllnessButton = screen.queryByRole('button', {
      name: 'Edit',
    });

    expect(editInjuryIllnessButton).not.toBeInTheDocument();
  });
});
