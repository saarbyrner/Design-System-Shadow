import { render, screen, within } from '@testing-library/react';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import {
  mockedIssueContextValue,
  mockedIssueWithDATALYSContextValue,
  mockedIssueWithICDContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';

import {
  MOCK_ORGANISATION_OSIICS10,
  MOCK_ORGANISATION_OSIICS15,
  MOCK_OSIICS15_CODING,
} from './utils';
import PresentationView from '../PresentationView';

jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

const renderComponent = (issueContext = mockedIssueContextValue) => {
  render(
    <MockedIssueContextProvider issueContext={issueContext}>
      <PresentationView t={(key) => key} />
    </MockedIssueContextProvider>
  );
};

describe('<PresentationView />', () => {
  beforeEach(() => {
    window.featureFlags = {
      'examination-date': true,
      'supplemental-recurrence-code': true,
    };

    useOrganisation.mockReturnValue({
      organisation: MOCK_ORGANISATION_OSIICS10,
    });
  });

  afterEach(() => {
    window.featureFlags = {};
    useOrganisation.mockReset();
  });

  const assertFieldHasCorectText = (field, matchingText) => {
    // Get all elements matching the label, e.g., all "Pathology:" spans.
    const labels = screen.getAllByText(`${field}:`);

    // Find the specific container that also has the matching text.
    const matchingContainers = labels
      .map((label) => label.parentNode.parentNode)
      .filter((container) => container.textContent.includes(matchingText));

    // Ensure one unique match
    if (matchingContainers.length !== 1) {
      throw new Error(
        `Expected to find 1 "${field}" field containing "${matchingText}", but found ${matchingContainers.length}.`
      );
    }

    const fieldContainer = matchingContainers[0];

    // Perform the final assertion on the uniquely identified container.
    expect(fieldContainer.parentNode).toHaveTextContent(matchingText);

    // Return the container for any further assertions.
    return fieldContainer;
  };

  it('renders the correct content', () => {
    const localContextMock = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        supplementary_coding: 'supplementary_coding',
      },
    };
    renderComponent(localContextMock);

    const supplementalLabel = screen.getByText('Supplemental Recurrence:');

    expect(supplementalLabel).toBeInTheDocument();
    assertFieldHasCorectText('Pathology', 'Pathology:Ankle Fracture');
    assertFieldHasCorectText(
      'Supplemental Recurrence',
      'Supplemental Recurrence:'
    );
    assertFieldHasCorectText(
      'Date of examination',
      'Date of examination:Feb 9, 2022'
    );
    assertFieldHasCorectText('Classification', 'Classification:Fracture');
    assertFieldHasCorectText('Body Area', 'Body Area:Ankle (Right)');
    assertFieldHasCorectText('Code', 'WUPM');
    assertFieldHasCorectText('Onset type', 'Onset type:Acute');
  });

  it('does not renders the supplementary coding when no value', () => {
    const localContextMock = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        supplementary_coding: undefined,
      },
    };
    renderComponent(localContextMock);
    const supplementalLabel = screen.queryByText('Supplemental Recurrence:');

    expect(supplementalLabel).not.toBeInTheDocument();
  });

  it('renders the correct content when a supplementary_coding is present', () => {
    const localContextMock = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        supplementary_coding: 'supplementary_coding',
      },
    };
    renderComponent(localContextMock);

    expect(screen.getByText('Date of examination:')).toBeInTheDocument();
    assertFieldHasCorectText('Pathology', 'Pathology:Ankle Fracture');
    assertFieldHasCorectText('Supplemental Recurrence', 'supplementary_coding');
    assertFieldHasCorectText('Classification', 'Fracture');
    assertFieldHasCorectText('Body Area', 'Ankle (Right)');
    assertFieldHasCorectText('Code', 'WUPM');
    assertFieldHasCorectText('Onset type', 'Onset type:Acute');
  });

  it('renders the correct content when a supplementary_pathology is present', () => {
    const localContextMock = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        supplementary_pathology: 'supplementary_pathology',
      },
    };
    renderComponent(localContextMock);

    expect(screen.getByText('Supplemental Pathology:')).toBeInTheDocument();
    assertFieldHasCorectText('Pathology', 'Pathology:Ankle Fracture');
    assertFieldHasCorectText(
      'Supplemental Pathology',
      'Supplemental Pathology:supplementary_pathology'
    );
    assertFieldHasCorectText(
      'Date of examination',
      'Date of examination:Feb 9, 2022'
    );
    assertFieldHasCorectText('Classification', 'Classification:Fracture');
    assertFieldHasCorectText('Body Area', 'Body Area:Ankle (Right)');
    assertFieldHasCorectText('Code', 'Code:WUPM');
    assertFieldHasCorectText('Onset type', 'Onset type:Acute');
  });

  describe('when the issue uses the ICD coding system', () => {
    beforeEach(() => {
      window.featureFlags = {
        'emr-multiple-coding-systems': true,
        'examination-date': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the correct content', () => {
      renderComponent(mockedIssueWithICDContextValue);

      expect(
        screen.queryByText('Supplemental Recurrence:')
      ).not.toBeInTheDocument();
      assertFieldHasCorectText(
        'Pathology',
        'Pathology:Fracture of foot and toe, except ankle'
      );
      assertFieldHasCorectText(
        'Date of examination',
        'Date of examination:Feb 9, 2022'
      );
      assertFieldHasCorectText('Body Area', 'Body Area:Ankle (Left)');
      assertFieldHasCorectText('Code', 'Code:S92');
      assertFieldHasCorectText('Onset type', 'Onset type:Acute');
    });
  });

  describe('when the issue uses the DATALYS coding system', () => {
    beforeEach(() => {
      window.featureFlags = {
        'examination-date': true,
        'emr-multiple-coding-systems': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the correct content', () => {
      renderComponent(mockedIssueWithDATALYSContextValue);

      expect(
        screen.queryByText('Supplemental Recurrence:')
      ).not.toBeInTheDocument();
      assertFieldHasCorectText(
        'Pathology',
        'Pathology:Fracture of foot and toe, except ankle'
      );
      assertFieldHasCorectText(
        'Date of examination',
        'Date of examination:Feb 9, 2022'
      );
      assertFieldHasCorectText('Classification', 'Classification:Nerve injury');
      assertFieldHasCorectText('Body Area', 'Body Area:Left Leg');
      assertFieldHasCorectText('Tissue type', 'Tissue type:Nervous tissue');
      assertFieldHasCorectText('Onset type', 'Onset type:Acute');
    });
  });

  describe('when concussion-medical-area feature flag is true', () => {
    const issueContextConcussion = { ...mockedIssueContextValue };
    issueContextConcussion.issue = {
      osics: {
        osics_pathology: 'Acute Concussion with visual symptoms',
        osics_body_area: 'Head',
        osics_pathology_id: 419,
        osics_classification: 'Concussion/ Brain Injury',
        ocics_id: 'HNCO',
        groups: ['concussion'],
      },
      side: 'N/A',
      onset: 'Gradual',
      examination_date: '2022-06-03T00:00:00+01:00',
      concussion_assessments: [],
    };

    beforeEach(() => {
      window.featureFlags['concussion-medical-area'] = true;
      window.featureFlags['examination-date'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the additional details section for concussion issue', () => {
      renderComponent(issueContextConcussion);

      expect(
        screen.getByRole('heading', { name: 'Additional questions' })
      ).toBeInTheDocument();
      assertFieldHasCorectText(
        'Was a concussion assessment performed at the scene?',
        'No'
      );
    });

    it('renders yes in the additional details section for concussion test performed', () => {
      const issueContextConcussionWithAssessment = {
        ...mockedIssueContextValue,
      };
      issueContextConcussionWithAssessment.issue = {
        osics: {
          osics_pathology: 'Acute Concussion with visual symptoms',
          osics_body_area: 'Head',
          osics_pathology_id: 419,
          osics_classification: 'Concussion/ Brain Injury',
          ocics_id: 'HNCO',
          groups: ['concussion'],
        },
        side: 'N/A',
        onset: 'Gradual',
        examination_date: '2022-06-03T00:00:00+01:00',
        concussion_assessments: [
          {
            created_at: '2022-04-25T00:00:00Z',
            form: {
              category: 'concussion',
              created_at: '2022-05-10T15:47:00Z',
              enabled: true,
              group: 'scat5',
              id: 3,
              key: 'return_to_play',
              name: 'Return to play',
              updated_at: '2022-05-10T15:47:00Z',
            },
            id: 5,
          },
        ],
      };
      renderComponent(issueContextConcussionWithAssessment);

      expect(
        screen.getByRole('heading', { name: 'Additional questions' })
      ).toBeInTheDocument();
      assertFieldHasCorectText(
        'Was a concussion assessment performed at the scene?',
        'Yes'
      );
    });

    it('does not render the additional questions section for non concussion issue', () => {
      renderComponent();
      expect(
        screen.queryByRole('heading', { name: 'Additional questions' })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] include-bamic-on-injury', () => {
    const issueContextBAMIC = { ...mockedIssueContextValue };
    issueContextBAMIC.issue = {
      osics: {
        osics_pathology: 'Ankle Fracture',
        osics_body_area: 'Head',
        osics_pathology_id: 419,
        osics_classification: 'Concussion/ Brain Injury',
        ocics_id: 'HNCO',
      },
      bamic_grade: {
        grade: '2',
        name: 'Grade 2',
      },
      bamic_grade_id: 3,
      bamic_site: {
        site: 'b',
        name: 'b - myotendinous / muscular',
      },
      bamic_site_id: 2,
    };

    beforeEach(() => {
      window.featureFlags['include-bamic-on-injury'] = true;
    });

    afterEach(() => {
      window.featureFlags['include-bamic-on-injury'] = false;
    });

    it('renders the correct content', () => {
      renderComponent(issueContextBAMIC);

      expect(
        screen.queryByText('Supplemental Recurrence:')
      ).not.toBeInTheDocument();
      assertFieldHasCorectText('Grade', 'Grade:Grade 2');
      assertFieldHasCorectText('Site', 'Site:b - myotendinous / muscular');
    });
  });

  describe('[feature-flag] nfl-injury-flow-fields', () => {
    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
      window.featureFlags['nfl-injury-flow-fields'] = true;
    });

    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });

    it('renders the Other reason onset field', () => {
      const localContextMock = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          onset_other_text: 'test info',
        },
      };
      renderComponent(localContextMock);

      expect(
        screen.queryByText('Supplemental Recurrence:')
      ).not.toBeInTheDocument();
      assertFieldHasCorectText('Other - Onset type', 'test info');
    });

    it('should render the Description of onset field for injuries when nfl-injury-flow-fields is enabled', () => {
      renderComponent(mockedIssueContextValue);
      expect(screen.getByText('Description of onset:')).toBeInTheDocument();
    });

    it('should not render the Description of onset field when nfl-injury-flow-fields is disabled', () => {
      window.setFlag('nfl-injury-flow-fields', false);
      renderComponent(mockedIssueContextValue);
      expect(
        screen.queryByText('Description of onset:')
      ).not.toBeInTheDocument();
    });
  });

  describe('Coding Systems', () => {
    describe('OSIICS15', () => {
      const mockContextOsiics15Org = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          coding: MOCK_OSIICS15_CODING,
        },
      };
      const mockContextOsiics15OrgWithSupplementalData = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          coding: MOCK_OSIICS15_CODING,
          supplementary_pathology: 'value-here',
        },
      };
      const issue = mockContextOsiics15OrgWithSupplementalData.issue;
      const pathology = issue.coding.pathologies[0];
      const classification = pathology.coding_system_classification.name;
      const code = pathology.code;
      const side = pathology.coding_system_side?.side_name;
      const onset = issue.onset;

      beforeEach(() => {
        useOrganisation.mockReturnValue({
          organisation: MOCK_ORGANISATION_OSIICS15,
        });
      });

      afterEach(() => {
        useOrganisation.mockReset();
      });

      it('renders all fields with valid data', () => {
        renderComponent(mockContextOsiics15Org);

        expect(
          screen.queryByText('Supplemental Recurrence:')
        ).not.toBeInTheDocument(); // not part of the current iteration but it will work when BE provides the value
        expect(
          screen.queryByText('Supplemental Pathology:')
        ).not.toBeInTheDocument(); // same here
        assertFieldHasCorectText(
          'Pathology',
          'Pathology:RED-S (Relative Energy Deficiency in Sport)'
        );
        assertFieldHasCorectText(
          'Date of examination',
          'Date of examination:Feb 9, 2022'
        );
        assertFieldHasCorectText(
          'Classification',
          'Classification:Bone contusion'
        );
        assertFieldHasCorectText('Body Area', 'Body Area:Upper arm');
        assertFieldHasCorectText('Code', 'WUPM');
      });

      it('renders supplemental pathology field when data present', () => {
        renderComponent(mockContextOsiics15OrgWithSupplementalData);

        assertFieldHasCorectText(
          'Supplemental Pathology',
          'Supplemental Pathology:value-here'
        );
        expect(
          screen.queryByText('Supplemental Recurrence:')
        ).not.toBeInTheDocument();
      });

      it('renders coding system Pathology dropdown', () => {
        renderComponent(mockContextOsiics15OrgWithSupplementalData);
        const selectedPathology = pathology.pathology;
        const examinationDate = formatStandard({
          date: moment(issue.examination_date),
        });

        const dropdown = screen.getAllByText(/Pathology/)[0].parentNode;
        const dateOfExamination =
          screen.getByText(/Date of examination/).parentNode;

        expect(dropdown).toHaveTextContent(`Pathology:${selectedPathology}`);
        expect(dateOfExamination).toHaveTextContent(
          `Date of examination:${examinationDate}`
        );
      });

      it('renders Date of examination field', () => {
        renderComponent(mockContextOsiics15OrgWithSupplementalData);
        const examinationDate = formatStandard({
          date: moment(issue.examination_date),
        });
        const dateOfExamination =
          screen.getByText(/Date of examination/).parentNode;

        expect(dateOfExamination).toHaveTextContent(
          `Date of examination:${examinationDate}`
        );
      });

      it('renders Pathology-related fields', () => {
        renderComponent(mockContextOsiics15OrgWithSupplementalData);

        const classificationField =
          screen.getByText(/Classification/).parentNode;
        const codeField = screen.getByText(/Code/).parentNode;
        const sideField = screen.getByText(/Side/).parentNode;
        const onsetField = screen.getByText(/Onset/).parentNode;

        expect(classificationField).toHaveTextContent(
          `Classification:${classification.trim()}`
        );
        expect(codeField).toHaveTextContent(`Code:${code.trim()}`);
        expect(sideField).toHaveTextContent(`Side:${side.trim()}`);
        expect(onsetField).toHaveTextContent(`Onset:${onset.trim()}`);
      });
    });
  });

  describe('[feature-flag] multi-part-injury-ci-code', () => {
    const mockContextWithSecondaryPathologies = {
      ...mockedIssueContextValue,
      issue: {
        ...mockedIssueContextValue.issue,
        occurrence_date: '2022-01-13T11:00:00.000Z',
        examination_date: '2022-02-09T11:00:00.000Z',
        coding: {
          clinical_impressions: {
            pathology: 'Primary CI Pathology',
            secondary_pathologies: [
              {
                id: 1,
                record: {
                  pathology: 'Secondary Pathology 1',
                  clinical_impression_classification: {
                    name: 'Classification 1',
                  },
                  clinical_impression_body_area: { name: 'Body Area 1' },
                  code: 'CODE1',
                },
                side: { name: 'Right' },
              },
            ],
          },
        },
      },
    };

    afterEach(() => {
      window.featureFlags['multi-part-injury-ci-code'] = false;
    });

    it('renders secondary CI code section when feature flag is true and data is present', () => {
      window.featureFlags['multi-part-injury-ci-code'] = true;
      window.featureFlags['emr-multiple-coding-systems'] = true;
      renderComponent(mockContextWithSecondaryPathologies);

      expect(
        screen.getByRole('heading', { name: 'Secondary CI Code' })
      ).toBeInTheDocument();
      // The primary pathology is rendered outside the secondary section
      assertFieldHasCorectText('Pathology', 'Pathology:Primary CI Pathology');

      // Now check the secondary fields
      const lists = screen.getAllByRole('list');

      // The secondary pathology is in the second list
      const secondaryListItems = within(lists[1]).getAllByRole('listitem');

      expect(secondaryListItems[0]).toHaveTextContent(
        'Pathology:Secondary Pathology 1'
      );
      expect(secondaryListItems[1]).toHaveTextContent(
        'Date of examination:Feb 9, 2022'
      );
      expect(secondaryListItems[2]).toHaveTextContent(
        'Classification:Classification 1'
      );
      expect(secondaryListItems[3]).toHaveTextContent('Body Area:Body Area 1');
      expect(secondaryListItems[4]).toHaveTextContent('Side:Right');
      expect(secondaryListItems[5]).toHaveTextContent('Code:CODE1');
    });

    it('does not render secondary CI code section when feature flag is true but no data is present', () => {
      window.featureFlags['multi-part-injury-ci-code'] = true;
      renderComponent();

      expect(screen.queryByText('Secondary CI Code')).not.toBeInTheDocument();
    });

    it('does not render secondary CI code section when feature flag is false', () => {
      renderComponent(mockContextWithSecondaryPathologies);

      expect(screen.queryByText('Secondary CI Code')).not.toBeInTheDocument();
    });
  });
});
