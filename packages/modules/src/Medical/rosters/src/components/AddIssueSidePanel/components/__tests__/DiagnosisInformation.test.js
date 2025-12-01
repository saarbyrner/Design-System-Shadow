import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import getAthleteAssessments from '@kitman/modules/src/Medical/rosters/src/services/getAthleteAssessments';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { data as mockCI } from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions';
import { data as mockDatalys } from '@kitman/services/src/mocks/handlers/medical/datalys';
import { data as mockSides } from '@kitman/services/src/mocks/handlers/medical/getSides';
import { MOCK_RESPONSE } from '@kitman/modules/src/Medical/shared/services/getIssueFieldsConfig';
import { initialStore } from '@kitman/modules/src/Medical/rosters/src/redux/store';
// import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import DiagnosisInformation from '../DiagnosisInformation';

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/services/getAthleteAssessments'
);

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/codingSystems',
  () => ({
    ClinicalImpressions: jest.fn(() => (
      <div data-testid="clinical-impressions-component" />
    )),
    Datalys: jest.fn(() => <div data-testid="datalys-component" />),
    ICD: jest.fn(() => <div data-testid="icd-component" />),
    OSICS10: jest.fn(
      ({ codingSystemProps, onsetProps, issueIsAnInjury, invalidFields }) => (
        <div data-testid="osics10-component">
          {codingSystemProps?.onSelectPathology && (
            <label>
              Pathology
              <input
                data-testid="pathology-input"
                aria-invalid={invalidFields?.includes('primary_pathology_id')}
              />
            </label>
          )}
          {issueIsAnInjury && onsetProps?.onSelectOnset && (
            <label>
              Onset Type
              <input data-testid="onset-type-input" />
            </label>
          )}
        </div>
      )
    ),
    OSIICS15: jest.fn(() => <div data-testid="osiics15-component" />),
  })
);

jest.mock('@kitman/common/src/utils/ajaxPromise', () =>
  jest.fn((options) => {
    if (options.url === '/ui/fields/medical/issues/create_params') {
      return Promise.resolve(MOCK_RESPONSE);
    }
    if (options.url === '/ui/medical/injuries/osics_pathologies') {
      return Promise.resolve([]);
    }
    if (options.url === '/ui/medical/datalys_classifications') {
      return Promise.resolve(mockDatalys.datalys_classifications);
    }
    if (options.url === '/ui/medical/clinical_impressions_classifications') {
      return Promise.resolve(mockCI.clinical_impression_classifications);
    }
    if (options.url === '/ui/medical/clinical_impressions_body_areas') {
      return Promise.resolve(mockCI.clinical_impression_body_areas);
    }
    if (options.url === '/ui/medical/datalys_body_areas') {
      return Promise.resolve(mockDatalys.datalys_body_areas);
    }
    if (options.url === '/ui/medical/sides') {
      return Promise.resolve(mockSides);
    }
    return Promise.reject(new Error('Unhandled AJAX call'));
  })
);

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/components/src/DateRangePicker', () => {
  const mockDateRangePicker = jest.fn(() => {
    return <div data-testid="date-range-picker" />;
  });
  return mockDateRangePicker;
});

describe('<DiagnosisInformation />', () => {
  const store = storeFake({
    ...initialStore,

    globalApi: {
      useGetOrganisationQuery: jest.fn(),
    },
  });

  beforeEach(() => {
    getAthleteAssessments.mockResolvedValue([]);
  });

  const props = {
    currentPage: 2,
    invalidFields: [],
    attachedConcussionAssessments: [],
    enteredSupplementalPathology: null,
    fetchGameAndTrainingOptions: jest.fn(),
    grades: [],
    isBamic: false,
    onAddStatus: jest.fn(),
    onEnterSupplementalPathology: jest.fn(),
    onRemoveStatus: jest.fn(),
    onRemoveSupplementalPathology: jest.fn(),
    onSelectBamicGrade: jest.fn(),
    onSelectBamicSite: jest.fn(),
    onSelectBodyArea: jest.fn(),
    onSelectClassification: jest.fn(),
    onSelectCoding: jest.fn(),
    onSelectExaminationDate: jest.fn(),
    onSelectOnset: jest.fn(),
    onSelectOnsetDescription: jest.fn(),
    onUpdateOnsetFreeText: jest.fn(),
    onSelectPathology: jest.fn(),
    onSelectSide: jest.fn(),
    onUpdateAttachedConcussionAssessments: jest.fn(),
    onUpdateStatusDate: jest.fn(),
    onUpdateStatusType: jest.fn(),
    permissions: {
      medical: {},
      concussion: {
        canAttachConcussionAssessments: true,
      },
    },
    selectedAthlete: null,
    selectedBamicGrade: null,
    selectedBamicSite: null,
    selectedCoding: {},
    selectedDiagnosisDate: null,
    selectedExaminationDate: null,
    selectedIssueType: 'INJURY',
    selectedOnset: null,
    selectedOnsetDescription: null,
    onsetFreeText: '',
    selectedSide: null,
    sides: [],
    statuses: [{ status: '', date: null }],
    injuryStatuses: [
      {
        description: 'Causing unavailability (time-loss)',
        id: 1,
      },
      {
        description: 'Not affecting availability (medical attention)',
        id: 2,
      },
      {
        description: 'Resolved',
        is_resolver: true,
        id: 3,
      },
    ],
    t: i18nextTranslateStub(),
  };

  const codingKey = codingSystemKeys.OSICS_10;

  const Component = ({ mockedStore, mockedCodingKey, mockedProps }) => {
    const issueFields = useIssueFields('injury');
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={mockedStore}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { coding_system_key: mockedCodingKey },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DiagnosisInformation {...mockedProps} {...issueFields} />
            </LocalizationProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      </I18nextProvider>
    );
  };

  describe('[FORM FIELDS] Diagnosis Information', () => {
    it('Status: has a status section', async () => {
      render(
        <Component
          mockedStore={store}
          mockedProps={{ ...props, currentPage: 2 }}
          mockedCodingKey={codingKey}
        />
      );
      const statusSelect = screen.getByLabelText('Status');
      expect(statusSelect).toBeInTheDocument();

      // Expect 1 DatePicker, and its label to be 'Date'
      const datePicker = screen.getByLabelText(/Date/);
      expect(datePicker).toBeInTheDocument();
    });

    it('Status: status "resolved" is available for the second status', async () => {
      const user = userEvent.setup();
      render(
        <Component
          mockedStore={store}
          mockedProps={{
            ...props,
            currentPage: 2,
            statuses: [
              { status: 1, date: null },
              { status: '', date: null },
            ],
          }}
          mockedCodingKey={codingKey}
        />
      );

      expect(
        screen.getByText('Causing unavailability (time-loss)')
      ).toBeInTheDocument();

      const statusSelects = screen.getAllByLabelText('Status');
      expect(statusSelects[0]).toBeInTheDocument();

      // Open the first status select
      await user.click(statusSelects[0]);

      const selectionTimeLossOption = screen.getAllByText(
        'Causing unavailability (time-loss)'
      );
      expect(selectionTimeLossOption[0]).toHaveClass(
        'kitmanReactSelect__single-value'
      );

      expect(selectionTimeLossOption[1]).toHaveClass(
        'kitmanReactSelect__option'
      );

      const medicalAttentionOption = screen.getByText(
        'Not affecting availability (medical attention)'
      );
      expect(medicalAttentionOption).toHaveClass('kitmanReactSelect__option');

      expect(screen.queryByText('Resolved')).not.toBeInTheDocument();

      // Close the first status select (by clicking outside or pressing escape)
      await user.keyboard('{escape}');

      expect(statusSelects[1]).toBeInTheDocument();
      await user.click(statusSelects[1]);

      const medicalAttentionOption2 = screen.getByText(
        'Not affecting availability (medical attention)'
      );
      expect(medicalAttentionOption2).toHaveClass('kitmanReactSelect__option');
      const resolvedOption = screen.getByText('Resolved');
      expect(resolvedOption).toHaveClass('kitmanReactSelect__option');

      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('Status: has the correct number beside each status', async () => {
      render(
        <Component
          mockedStore={store}
          mockedProps={{
            ...props,
            currentPage: 2,
            statuses: [
              { status: '', date: null },
              { status: '', date: null },
              { status: '', date: null },
            ],
          }}
          mockedCodingKey={codingKey}
        />
      );

      const statusNumber1 = screen.getByText('1');
      const statusNumber2 = screen.getByText('2');
      const statusNumber3 = screen.getByText('3');

      expect(statusNumber1).toHaveClass('addIssueSidePanel__statusNumber');
      expect(statusNumber2).toHaveClass('addIssueSidePanel__statusNumber');
      expect(statusNumber3).toHaveClass('addIssueSidePanel__statusNumber');
    });

    it('Status: it displays the bin icon on all statuses, except the first', async () => {
      render(
        <Component
          mockedStore={store}
          mockedProps={{
            ...props,
            currentPage: 2,
            statuses: [
              { status: '', date: null },
              { status: '', date: null },
              { status: '', date: null },
            ],
          }}
          mockedCodingKey={codingKey}
        />
      );

      const allButtons = screen.queryAllByRole('button');
      const removeStatusButtons = allButtons.filter((button) =>
        button.classList.contains('icon-bin')
      );

      // The first status should not have a remove button
      expect(removeStatusButtons.length).toBe(2); // Only the second and third statuses have remove buttons
    });

    it('Status: has an Add Status button', async () => {
      render(
        <Component
          mockedStore={store}
          mockedProps={{
            ...props,
            currentPage: 2,
            statuses: [
              { status: '', date: null },
              { status: '', date: null },
              { status: '', date: null },
            ],
          }}
          mockedCodingKey={codingKey}
        />
      );

      const addStatusButton = screen.getByRole('button', {
        name: 'Add status',
      });
      expect(addStatusButton).toBeInTheDocument();
    });

    it('Validation: highlights the invalid fields primary_pathology_id is in props', async () => {
      render(
        <Component
          mockedStore={store}
          mockedProps={{
            ...props,
            issueType: 'INJURY',
            invalidFields: ['primary_pathology_id'],
          }}
          mockedCodingKey={codingKey}
        />
      );

      const pathologyInput = screen.getByLabelText('Pathology');
      expect(pathologyInput).toHaveAttribute('aria-invalid', 'true');
    });

    describe('[FEATURE FLAG] concussion-medical-area', () => {
      beforeEach(() => {
        window.featureFlags['concussion-medical-area'] = true;
      });
      afterEach(() => {
        window.featureFlags['concussion-medical-area'] = false;
      });

      it('Concussion Assessment: shows the Concussion Assessment section', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                [codingSystemKeys.OSICS_10]: {
                  osics_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingKey}
          />
        );

        const concussionAssessmentSectionQuestion = screen.getByText(
          'Was a concussion assessment performed at the scene?'
        );
        expect(concussionAssessmentSectionQuestion).toBeInTheDocument();
      });

      it('Validation: highlights invalid fields when props are supplied', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              showAssessmentReportSelector: true,
              invalidFields: ['attached_concussion_assessments'],
              selectedCoding: {
                [codingSystemKeys.OSICS_10]: {
                  osics_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
              selectedIssueType: 'INJURY',
            }}
            mockedCodingKey={codingKey}
          />
        );

        const concussionAssessmentSectionQuestion = screen.getByText(
          'Was a concussion assessment performed at the scene?'
        );
        expect(concussionAssessmentSectionQuestion).toBeInTheDocument();
        const yesButton = screen.getByRole('button', { name: 'Yes' });
        await userEvent.click(yesButton);

        await waitFor(() => {
          expect(screen.getByLabelText('Attach report(s)')).toBeInTheDocument();
        });

        const attachReports = screen.getByLabelText('Attach report(s)');
        expect(attachReports.parentNode.parentNode.parentNode).toHaveClass(
          'kitmanReactSelect--invalid'
        );
      });
    });

    describe('Onset type', () => {
      it('Onset type: has the Onset Type field', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              issueIsAnInjury: true,
            }}
            mockedCodingKey={codingKey}
          />
        );
        const onsetTypeSelect = screen.getByLabelText('Onset Type');
        expect(onsetTypeSelect).toBeInTheDocument();
      });

      it('Validation: highlights the invalid fields when props are supplied', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedIssueType: 'INJURY',
              invalidFields: ['events_0'],
            }}
            mockedCodingKey={codingKey}
          />
        );

        const statusSelect = screen.getByLabelText('Status');
        expect(statusSelect.parentNode.parentNode.parentNode).toHaveClass(
          'kitmanReactSelect--invalid'
        );
      });
    });

    describe('[FEATURE FLAG] preliminary-injury-illness', () => {
      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = true;
      });
      afterEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
      });

      it('Status: status "resolved" is not available for the second status', async () => {
        const user = userEvent.setup();
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              statuses: [
                { status: '', date: null },
                { status: '', date: null },
              ],
            }}
            mockedCodingKey={codingKey}
          />
        );

        const statusSelects = screen.getAllByLabelText('Status');
        await user.click(statusSelects[1]);

        expect(screen.queryByText('Resolved')).not.toBeInTheDocument();
      });
    });

    describe('[FEATURE FLAG] chronic-injury-illness', () => {
      beforeEach(() => {
        window.featureFlags['chronic-injury-illness'] = true;
      });
      afterEach(() => {
        window.featureFlags['chronic-injury-illness'] = false;
      });

      it('Status: has a status section', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedIssueType: 'INJURY',
            }}
            mockedCodingKey={codingKey}
          />
        );

        const statusSelect = screen.getByLabelText('Status');
        expect(statusSelect).toBeInTheDocument();

        const datePicker = screen.getByLabelText(/Date/);
        expect(datePicker).toBeInTheDocument();
      });

      it('Status: does not have a status section when issue type is chronic', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedIssueType: 'CHRONIC_INJURY',
            }}
            mockedCodingKey={codingKey}
          />
        );

        expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Date')).not.toBeInTheDocument();
      });
    });

    describe('Coding Systems', () => {
      it('Renders OSIICS15 component when org coding system set to OSIICS15', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                coding_system: {
                  coding_system_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingSystemKeys.OSIICS_15}
          />
        );
        expect(screen.getByTestId('osiics15-component')).toBeInTheDocument();
        expect(
          screen.queryByTestId('osics10-component')
        ).not.toBeInTheDocument();
      });

      it('Renders OSIICS10 component when org coding system set to OSIICS10', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                coding_system: {
                  coding_system_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingSystemKeys.OSIICS_10}
          />
        );
        expect(screen.getByTestId('osics10-component')).toBeInTheDocument();
        expect(
          screen.queryByTestId('clinical-impressions-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('datalys-component')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('icd-component')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osiics15-component')
        ).not.toBeInTheDocument();
      });

      it('Renders ICD component when org coding system set to ICD', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                coding_system: {
                  coding_system_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingSystemKeys.ICD}
          />
        );
        expect(screen.getByTestId('icd-component')).toBeInTheDocument();
        expect(
          screen.queryByTestId('clinical-impressions-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('datalys-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osics10-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osiics15-component')
        ).not.toBeInTheDocument();
      });

      it('Renders DATALYS component when org coding system set to DATALYS', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                coding_system: {
                  coding_system_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingSystemKeys.DATALYS}
          />
        );
        expect(screen.getByTestId('datalys-component')).toBeInTheDocument();
        expect(
          screen.queryByTestId('clinical-impressions-component')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('icd-component')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osics10-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osiics15-component')
        ).not.toBeInTheDocument();
      });

      it('Renders CLINICAL_IMPRESSIONS component when org coding system set to CLINICAL_IMPRESSIONS', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              selectedCoding: {
                coding_system: {
                  coding_system_pathology_id: 417,
                  groups: ['concussion'],
                },
              },
              attachedConcussionAssessments: [],
              permissions: {
                medical: {},
                concussion: { canAttachConcussionAssessments: true },
              },
            }}
            mockedCodingKey={codingSystemKeys.CLINICAL_IMPRESSIONS}
          />
        );
        expect(
          screen.getByTestId('clinical-impressions-component')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('datalys-component')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('icd-component')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osics10-component')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('osiics15-component')
        ).not.toBeInTheDocument();
      });
    });

    describe('[PAST ATHLETE] Diagnosis Information', () => {
      it('Status: has the correct max date', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              isPastAthlete: true,
              maxPermittedExaminationDate: '2022-12-15T10:12:51.894Z',
            }}
            mockedCodingKey={codingKey}
          />
        );

        const datePicker = screen.getByLabelText(/Date/);
        expect(datePicker).toBeInTheDocument();
        const maxDateSpan = screen.getByTestId('maximum-date');
        expect(maxDateSpan).toHaveTextContent('2022-12-15T10:12:51.894Z');
      });
      it('Status: has the correct max date for subsequent statuses', async () => {
        render(
          <Component
            mockedStore={store}
            mockedProps={{
              ...props,
              currentPage: 2,
              isPastAthlete: true,
              maxPermittedExaminationDate: '2022-12-15T10:12:51.894Z',
              statuses: [
                { status: '', date: '2022-12-11T10:12:51.894Z' },
                { status: '', date: null },
              ],
            }}
            mockedCodingKey={codingKey}
          />
        );

        const dateLabels = screen.getAllByText('Date', { selector: 'label' });
        expect(dateLabels).toHaveLength(2);

        const firstMaxDateSpan = within(dateLabels[0]).getByTestId(
          'maximum-date'
        );
        expect(firstMaxDateSpan).toHaveTextContent('2022-12-15T10:12:51.894Z');

        const secondMinDateSpan = within(dateLabels[1]).getByTestId(
          'minimum-date'
        );
        expect(secondMinDateSpan).toHaveTextContent('2022-12-11T10:12:51.894Z');

        const secondMaxDateSpan = within(dateLabels[1]).getByTestId(
          'maximum-date'
        );
        expect(secondMaxDateSpan).toHaveTextContent('2022-12-15T10:12:51.894Z');
      });
    });
  });
});
