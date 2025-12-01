import { screen, waitFor } from '@testing-library/react';
import i18n from 'i18next';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/getMedicalDocument';
import { useShowToasts } from '@kitman/common/src/hooks';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import * as Redux from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import moment from 'moment-timezone';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { getGroupedAthleteIssues } from '@kitman/modules/src/Medical/shared/utils';
import LinkedInjuriesPanel from '..';

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

describe('<LinkedInjuriesPanel />', () => {
  const mockShowSuccessToast = jest.fn();
  const mockShowErrorToast = jest.fn();

  const mockStore = storeFake({
    medicalApi: {
      useGetAthleteDataQuery: jest.fn(),
    },
  });

  const mockDispatch = jest.fn();

  beforeEach(() => {
    useShowToasts.mockReturnValue({
      showSuccessToast: mockShowSuccessToast,
      showErrorToast: mockShowErrorToast,
    });
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockIssues = [
    {
      id: 1,
      issue_type: 'injury',
      occurrence_date: '3 Apr 2024',
      full_pathology: 'ACL/LCL Sprain [Left]',
      issue_occurrence_title: null,
    },
    {
      id: 2,
      issue_type: 'illness',
      occurrence_date: '4 Apr 2024',
      full_pathology: 'Otalgia [Left]',
      issue_occurrence_title: null,
    },
  ];

  const mockChronicIssues = [
    {
      id: 1,
      full_pathology: 'Elbow Instability [Right]',
      title: 'Chronic condition',
      reported_date: '2023-09-01T00:00:00+01:00',
    },
  ];

  const mockAthleteIssues = {
    open_issues: [
      {
        id: 2,
        occurrence_date: '2024-04-03T00:00:00+01:00',
        closed: false,
        injury_status: {
          description: 'Limited',
          cause_unavailability: true,
          restore_availability: false,
        },
        resolved_date: null,
        issue_type: 'Illness',
        full_pathology: 'Otalgia [Left]',
        issue_occurrence_title: null,
        organisation_id: 1,
        archived: false,
        archived_by: null,
        archive_reason: null,
        archived_date: null,
        constraints: {
          read_only: false,
        },
      },
      {
        id: 3,
        occurrence_date: '2024-04-03T00:00:00+01:00',
        closed: false,
        injury_status: null,
        resolved_date: null,
        issue_type: 'Injury',
        full_pathology: 'ACL/LCL Sprain [Left]',
        issue_occurrence_title: null,
        organisation_id: 1,
        archived: false,
        archived_by: null,
        archive_reason: null,
        archived_date: null,
        constraints: {
          read_only: false,
        },
      },
    ],
    chronic_issues: [
      {
        id: 237,
        full_pathology: 'Elbow Instability [Right]',
        title: 'Chronic condition',
        constraints: {
          read_only: false,
        },
      },
      {
        id: 402,
        full_pathology: '1st CMC joint instability [Left]',
        title: null,
        constraints: {
          read_only: false,
        },
      },
    ],
  };

  const props = {
    document: documentData,
    title: 'Issues / illnesses',
    issues: mockIssues,
    canEdit: true,
    isChronic: false,
    athleteIssues: mockAthleteIssues,
    isLoading: false,
    updateDocument: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (
    { document, issues, isChronic, canEdit } = {
      document: props.document,
      issues: mockIssues,
      isChronic: props.isChronic,
      canEdit: props.canEdit,
    }
  ) => {
    return renderWithUserEventSetup(
      <I18nextProvider i18n={i18n}>
        <Provider store={mockStore}>
          <LinkedInjuriesPanel
            {...props}
            document={document}
            issues={issues}
            isChronic={isChronic}
            canEdit={canEdit}
          />
        </Provider>
      </I18nextProvider>
    );
  };

  describe('Presentation flow', () => {
    describe('Injury / illness', () => {
      it('renders the correct text content if no issues', () => {
        renderComponent({ document: props.document, issues: [] });
        expect(
          screen.getByText('No injury/illness linked.')
        ).toBeInTheDocument();
      });

      it('renders the correct text content', () => {
        renderComponent();
        expect(screen.getByText(props.title)).toBeInTheDocument();
        mockIssues.forEach((issue) => {
          expect(screen.getByText(issue.occurrence_date)).toBeInTheDocument();
          expect(screen.getByText(issue.full_pathology)).toBeInTheDocument();
        });
      });
    });

    describe('Chronic injury / illness', () => {
      it('renders the correct text content if no chronic issues', () => {
        renderComponent({
          document: props.document,
          issues: [],
          isChronic: true,
        });
        expect(
          screen.getByText('No chronic condition linked.')
        ).toBeInTheDocument();
      });

      it('renders the correct text content', () => {
        renderComponent({
          document: props.document,
          issues: mockChronicIssues,
          isChronic: true,
        });
        expect(screen.getByText(props.title)).toBeInTheDocument();
        mockChronicIssues.forEach((issue) => {
          expect(
            screen.getByText(
              // Replicating the date formatting in component
              formatStandard({
                date: moment(issue.reported_date),
                showTime: false,
              })
            )
          ).toBeInTheDocument();
          expect(screen.getByText(issue.title)).toBeInTheDocument();
        });
      });
    });

    describe('Preliminary issue', () => {
      it('renders the correct text content', () => {
        renderComponent({
          document: props.document,
          issues: [
            {
              id: 2,
              issue_type: 'illness',
              occurrence_date: '4 Apr 2024',
              full_pathology: null,
              issue_occurrence_title: null,
            },
          ],
          isChronic: false,
        });
        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByText('4 Apr 2024')).toBeInTheDocument();
        expect(screen.getByText('Preliminary')).toBeInTheDocument();
      });
    });
  });

  describe('Edit flow', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('Injury / illness', () => {
      const enterEditMode = async () => {
        const { user } = renderComponent({
          document: props.document,
          issues: mockIssues,
          isChronic: false,
          canEdit: true,
        });
        await user.click(screen.getByRole('button', { name: 'Edit' }));
        return user;
      };

      const enterAddMode = async () => {
        const { user } = renderComponent({
          document: props.document,
          issues: [],
          isChronic: false,
          canEdit: true,
        });
        await user.click(screen.getByRole('button', { name: 'Add' }));
        return user;
      };

      it('should not render the Edit button if canEdit is false', () => {
        renderComponent({
          document: props.document,
          issues: mockIssues,
          isChronic: false,
          canEdit: false,
        });
        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
      });

      it('should render the Edit button if canEdit is true and an issue exists', () => {
        renderComponent();
        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });

      it('should render the Add button if canEdit is true and an issue does not exist', () => {
        renderComponent({
          document: props.document,
          issues: [],
          isChronic: false,
          canEdit: true,
        });
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      });

      it('should render edit mode actions if in edit mode', async () => {
        await enterEditMode();

        expect(
          await screen.findByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Discard changes' })
        ).toBeInTheDocument();
      });

      it('should render drop down with correct values if in edit mode', async () => {
        const user = await enterEditMode();

        const issuesDropdown = await screen.findByLabelText('Injury/illness');
        await user.click(issuesDropdown);

        getGroupedAthleteIssues({
          issues: { open_issues: mockAthleteIssues.open_issues },
        }).forEach(async (issue) => {
          expect(
            screen.getByRole('option', { name: issue.label })
          ).toBeInTheDocument();
        });
      });

      it('should update values on click of Save, dispatch toast and setRequestDocumentData', async () => {
        const issue = getGroupedAthleteIssues({
          issues: { open_issues: [mockAthleteIssues.open_issues[0]] },
        })[0];

        const user = await enterAddMode();

        const issuesDropdown = await screen.findByLabelText('Injury/illness');
        await user.click(issuesDropdown);

        await user.click(
          screen.getByRole('option', {
            name: issue.label,
          })
        );

        expect(
          await screen.findByRole('option', {
            name: issue.label,
          })
        ).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(props.updateDocument).toHaveBeenCalledWith(props.document.id, {
            illness_occurrence_ids: [issue.id],
            injury_occurrence_ids: [],
          });
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: true,
          type: 'medicalDocument/setRequestDocumentData',
        });

        expect(mockShowSuccessToast).toHaveBeenCalledWith({
          translatedTitle: 'File details updated successfully',
        });
      });

      it('should not update values on click of Discard changes', async () => {
        const issue = getGroupedAthleteIssues({
          issues: { open_issues: [mockAthleteIssues.open_issues[0]] },
        })[0];

        const user = await enterAddMode();

        const issuesDropdown = await screen.findByLabelText('Injury/illness');
        await user.click(issuesDropdown);

        await user.click(
          screen.getByRole('option', {
            name: issue.label,
          })
        );

        expect(
          await screen.findByRole('option', {
            name: issue.label,
          })
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('button', { name: 'Discard changes' })
        );

        await waitFor(() => {
          expect(props.updateDocument).not.toHaveBeenCalled();
        });
      });
    });

    describe('Chronic Injury / illness', () => {
      const enterEditMode = async () => {
        const { user } = renderComponent({
          document: props.document,
          issues: mockChronicIssues,
          isChronic: true,
          canEdit: true,
        });
        await user.click(screen.getByRole('button', { name: 'Edit' }));
        return user;
      };

      const enterAddMode = async () => {
        const { user } = renderComponent({
          document: props.document,
          issues: [],
          isChronic: true,
          canEdit: true,
        });
        await user.click(screen.getByRole('button', { name: 'Add' }));

        return user;
      };

      it('should render drop down with correct values if in edit mode', async () => {
        const user = await enterEditMode();

        const issuesDropdown = await screen.findByLabelText(
          'Chronic conditions'
        );
        await user.click(issuesDropdown);

        getGroupedAthleteIssues({
          issues: { chronic_issues: mockChronicIssues },
        }).forEach(async (issue) => {
          expect(
            screen.getByRole('option', { name: issue.label })
          ).toBeInTheDocument();
        });
      });

      it('should update values on click of Save, dispatch toast and setRequestDocumentData', async () => {
        const chronicIssue = getGroupedAthleteIssues({
          issues: { chronic_issues: [mockAthleteIssues.chronic_issues[0]] },
        })[0];

        const user = await enterAddMode();

        const issuesDropdown = await screen.findByLabelText(
          'Chronic conditions'
        );
        await user.click(issuesDropdown);

        await user.click(
          screen.getByRole('option', {
            name: chronicIssue.label,
          })
        );

        expect(
          await screen.findByRole('option', {
            name: chronicIssue.label,
          })
        ).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(props.updateDocument).toHaveBeenCalledWith(props.document.id, {
            chronic_issue_ids: [chronicIssue.id],
          });
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: true,
          type: 'medicalDocument/setRequestDocumentData',
        });

        expect(mockShowSuccessToast).toHaveBeenCalledWith({
          translatedTitle: 'File details updated successfully',
        });
      });
    });
  });
});
