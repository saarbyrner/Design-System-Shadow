import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { data as mockOsics } from '@kitman/services/src/mocks/handlers/medical/osics';
import { data as mockGrades } from '@kitman/services/src/mocks/handlers/medical/getGrades';
import { data as mockSides } from '@kitman/services/src/mocks/handlers/medical/getSides';
import { searchCoding } from '@kitman/services';
import EditView from '../EditView';

// Mock child components to isolate the EditView component
jest.mock(
  '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/ConcussionAssessmentSection',
  () => ({
    // The component is exported as ConcussionAssessmentSectionTranslated
    ConcussionAssessmentSectionTranslated: () => (
      <div data-testid="concussion-assessment-section" />
    ),
  })
);

jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

// Mock the searchCoding API call used by AsyncSelect components
jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  searchCoding: jest.fn(() => Promise.resolve({ results: [] })),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: { reducerPath: 'globalApi' },
  },
  medicalSharedApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: { reducerPath: 'medicalSharedApi' },
  },
});
// MOCKS FOR ORGANISATION CODING SYSTEMS
const MOCK_ORGANISATION_OSICS = {
  organisation: {
    coding_system_key: 'osics_10',
  },
};
const MOCK_ORGANISATION_ICD = {
  organisation: {
    coding_system_key: 'icd_10',
    coding_system: { id: 2, name: 'ICD-10', key: 'icd_10' },
  },
};
const MOCK_ORGANISATION_DATALYS = {
  organisation: { coding_system_key: 'datalys' },
};
const MOCK_ORGANISATION_CI = {
  organisation: {
    coding_system_key: 'clinical_impressions',
    coding_system: { id: 2, name: 'CI-10', key: 'CI10' },
  },
};
const MOCK_ORGANISATION_OSIICS15 = {
  organisation: {
    coding_system: { id: 5, name: 'OSIICS-15', key: 'osiics_15' },
    coding_system_key: 'osiics_15',
  },
  isSuccess: true,
};

const { injuries } = mockOsics;
const {
  osics_pathologies: mockInjuriesPathologies,
  osics_classifications: mockInjuriesClassifications,
  osics_body_areas: mockInjuriesBodyAreas,
} = injuries;

const baseProps = {
  athleteId: 123,
  athleteData: {},
  pathologies: mockInjuriesPathologies,
  classifications: mockInjuriesClassifications,
  bodyAreas: mockInjuriesBodyAreas,
  sides: mockSides,
  onsetOptions: [
    { id: 1, name: 'Acute' },
    { id: 2, name: 'Chronic' },
    { id: 3, name: 'Gradual' },
    { id: 5, name: 'Overuse' },
    { id: 6, name: 'Traumatic' },
    { id: 4, name: 'Other', require_additional_input: true },
  ],
  details: { coding: { [codingSystemKeys.OSICS_10]: {} } },
  onSelectDetail: jest.fn(),
  showAssessmentReportSelector: false,
  onChangeShowAssessmentReportSelector: jest.fn(),
  bamicGrades: mockGrades,
  isContinuationIssue: false,
  isChronicIssue: false,
  t: i18nextTranslateStub(),
};

// This helper ensures props are correctly merged, preventing common errors
const renderComponent = (customProps = {}) => {
  const props = {
    ...baseProps,
    ...customProps,
    details: {
      ...baseProps.details,
      ...(customProps.details || {}),
    },
  };

  const view = render(
    <Provider store={defaultStore}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <EditView {...props} />
      </LocalizationProvider>
    </Provider>
  );

  return {
    user: userEvent.setup(),
    ...view,
  };
};

describe('EditView', () => {
  beforeEach(() => {
    baseProps.onSelectDetail.mockClear();
    baseProps.onChangeShowAssessmentReportSelector.mockClear();

    window.featureFlags['examination-date'] = true;
    useOrganisation.mockReturnValue(MOCK_ORGANISATION_OSICS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.featureFlags = {};
  });

  describe('General Rendering', () => {
    it('renders the correct default content', () => {
      renderComponent();

      expect(screen.getByLabelText('Pathology type')).toBeDisabled();
      expect(screen.getByLabelText('Pathology')).toBeInTheDocument();
      expect(screen.getByText('Classification:')).toBeInTheDocument();
      expect(screen.getByText('Body area:')).toBeInTheDocument();
      expect(screen.getByText('Code:')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of examination')).toBeInTheDocument();
      expect(screen.getByLabelText('Onset type')).toBeEnabled();
      expect(screen.getByTestId('SegmentedControl|Label')).toHaveTextContent(
        'Side'
      );
    });

    it('disables fields when a request is pending', () => {
      renderComponent({ isRequestPending: true });

      expect(screen.getByLabelText('Pathology')).toBeDisabled();

      const classificationContainer =
        screen.getByText(/Classification:/).parentElement;
      const editClassificationBtn = within(classificationContainer).getByRole(
        'button'
      );
      expect(editClassificationBtn).toBeDisabled();

      const bodyAreaContainer = screen.getByText(/Body area:/).parentElement;
      const editBodyAreaBtn = within(bodyAreaContainer).getByRole('button');
      expect(editBodyAreaBtn).toBeDisabled();

      expect(screen.getByLabelText('Date of examination')).toBeDisabled();
      expect(screen.getByLabelText('Onset type')).toBeDisabled();

      const sideGroup = screen.getByTestId('SegmentedControl|Group');
      const sideButtons = within(sideGroup).getAllByRole('button');
      sideButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('disables/enables fields correctly when the issue has recurrence', () => {
      window.featureFlags['pm-injury-edit-mode-of-onset'] = true;
      renderComponent({ hasRecurrence: true });

      expect(screen.getByLabelText('Pathology type')).toBeDisabled();
      expect(
        screen.queryByRole('button', { name: 'Edit classification' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Edit body area' })
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText('Onset type')).toBeEnabled();

      const sideGroup = screen.getByTestId('SegmentedControl|Group');
      const sideButtons = within(sideGroup).getAllByRole('button');
      sideButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('UI Interactions', () => {
    it('shows a select input when clicking the edit classification button', async () => {
      const { user } = renderComponent();

      const descriptionContainer =
        screen.getByText(/Classification:/).parentElement;
      expect(descriptionContainer).toHaveTextContent('Classification:');

      const editButton = within(descriptionContainer).getByRole('button');
      await user.click(editButton);

      expect(descriptionContainer).not.toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Classification' })
      ).toBeInTheDocument();
    });

    it('shows a select input when clicking the edit body area button', async () => {
      const { user } = renderComponent();

      const descriptionContainer = screen.getByText(/Body area:/).parentElement;
      expect(descriptionContainer).toHaveTextContent('Body area:');

      const editButton = within(descriptionContainer).getByRole('button');
      await user.click(editButton);

      expect(descriptionContainer).not.toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Body area' })
      ).toBeInTheDocument();
    });
  });

  describe('when using ICD coding system', () => {
    const icdProps = {
      details: {
        coding: {
          [codingSystemKeys.ICD]: {
            icd_id: 123,
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
          },
        },
      },
    };

    beforeEach(() => {
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_ICD);
    });

    it('renders the correct content', () => {
      renderComponent(icdProps);
      expect(
        screen.getByText('S92 Fracture of foot and toe, except ankle')
      ).toBeInTheDocument();
    });

    it('disables the pathology dropdown when the issue has recurrence', () => {
      renderComponent({ ...icdProps, hasRecurrence: true });
      const pathologyLabel = screen.getByText('Pathology');
      const selectContainer = pathologyLabel.parentElement.nextElementSibling;
      expect(selectContainer).toHaveClass('kitmanReactSelect--is-disabled');
    });
  });

  describe('when using DATALYS coding system', () => {
    const datalysProps = {
      details: {
        coding: {
          [codingSystemKeys.DATALYS]: {
            id: 123,
            code: 'S92',
            pathology: 'Fracture of foot and toe, except ankle',
            datalys_body_area_id: 1,
            datalys_classification_id: 13,
            datalys_tissue_type: 'Nervous tissue',
          },
        },
      },
    };

    beforeEach(() => {
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_DATALYS);
    });

    it('renders the correct content', () => {
      renderComponent(datalysProps);
      expect(
        screen.getByText('S92 Fracture of foot and toe, except ankle')
      ).toBeInTheDocument();

      expect(screen.getByText('Body area:').nextSibling).toHaveTextContent(
        'Ankle'
      );
      expect(screen.getByText('Classification:').nextSibling).toHaveTextContent(
        'Osteoarthritis'
      );
      expect(screen.getByText('Tissue type:').nextSibling).toHaveTextContent(
        'Nervous tissue'
      );
    });

    it('calls onSelectDetail when modifying classification', async () => {
      const customClassifications = [
        { id: 13, name: 'Osteoarthritis' }, // Initial value
        { id: 99, name: 'Test Sprain' }, // The new value we will select
      ];

      const { user } = renderComponent({
        ...datalysProps,
        classifications: customClassifications,
      });

      const classificationContainer =
        screen.getByText(/Classification:/).parentElement;
      const editButton = within(classificationContainer).getByRole('button');
      await user.click(editButton);

      const classificationSelectInput = screen.getByRole('textbox', {
        name: 'Classification',
      });
      await user.click(classificationSelectInput);

      const optionToSelect = await screen.findByText('Test Sprain');
      await user.click(optionToSelect);

      expect(baseProps.onSelectDetail).toHaveBeenCalledWith('coding', {
        [codingSystemKeys.DATALYS]: {
          ...datalysProps.details.coding[codingSystemKeys.DATALYS],
          datalys_classification_id: 99,
        },
      });
    });
  });

  describe('when using CI coding system', () => {
    const ciProps = {
      details: {
        coding: {
          [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
            id: 123,
            code: 'S92',
            pathology: 'Fracture of foot and toe, except ankle',
            clinical_impression_body_area_id: 1,
            clinical_impression_classification_id: 13,
          },
        },
      },
    };

    beforeEach(() => {
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_CI);
    });

    it('renders the correct content', () => {
      renderComponent(ciProps);
      expect(
        screen.getByText('S92 Fracture of foot and toe, except ankle')
      ).toBeInTheDocument();
      expect(screen.getByText('Body area:').nextSibling).toHaveTextContent(
        'Ankle'
      );
      expect(screen.getByText('Classification:').nextSibling).toHaveTextContent(
        'Osteoarthritis'
      );
    });

    it('does not allow modification of body area and classifications', () => {
      renderComponent(ciProps);
      expect(
        screen.queryByRole('button', { name: 'Edit body area' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Edit classification' })
      ).not.toBeInTheDocument();
    });

    it('persists all existing data when updating pathology', async () => {
      // FIX: Define all constants before they are used
      const newPathologyOption = {
        id: 459,
        code: 'N64',
        pathology: 'New Pathology',
      };
      // The `getCodingFieldOption` helper (used internally) prepends the code to the label
      const expectedOptionLabel = 'N64 New Pathology';

      const complexCiProps = {
        details: {
          coding: {
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              id: 123,
              code: 'S92',
              pathology: 'Fracture of foot and toe, except ankle',
              clinical_impression_body_area_id: 1,
              clinical_impression_body_area: 'Forearm',
              clinical_impression_classification_id: 13,
              clinical_impression_classification: 'Gen Trauma',
              side_id: 3,
              side: 'Midline',
              groups: [],
              secondary_pathologies: [],
            },
          },
        },
      };

      searchCoding.mockResolvedValue({
        results: [newPathologyOption],
      });

      const { user } = renderComponent(complexCiProps);

      const pathologyLabel = screen.getByText('Pathology');
      const selectContainer = pathologyLabel.closest('.kitmanReactSelect');
      const pathologySelectInput = within(selectContainer).getByRole('textbox');

      await user.type(pathologySelectInput, 'New');
      const optionToSelect = await screen.findByText(expectedOptionLabel);
      await user.click(optionToSelect);

      expect(baseProps.onSelectDetail).toHaveBeenCalledWith('coding', {
        [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
          // All existing data is preserved
          ...complexCiProps.details.coding[
            codingSystemKeys.CLINICAL_IMPRESSIONS
          ],
          // New data from the selection is merged on top
          ...newPathologyOption,
        },
      });
    });
  });

  describe('[feature-flag] concussion-medical-area', () => {
    beforeEach(() => {
      window.featureFlags['concussion-medical-area'] = true;
    });

    it('does not render ConcussionAssessmentSection for a non-concussion injury', () => {
      renderComponent();
      expect(
        screen.queryByTestId('concussion-assessment-section')
      ).not.toBeInTheDocument();
    });

    it('renders ConcussionAssessmentSection for a concussion injury', () => {
      const concussionProps = {
        details: {
          coding: {
            [codingSystemKeys.OSICS_10]: {
              osics_pathology_id: 417,
              groups: ['concussion'],
            },
          },
        },
      };
      renderComponent(concussionProps);
      expect(
        screen.getByTestId('concussion-assessment-section')
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] include-bamic-on-injury', () => {
    beforeEach(() => {
      window.featureFlags['include-bamic-on-injury'] = true;
    });

    it('renders Bamic fields when isBamic is true', () => {
      renderComponent({ details: { isBamic: true } });
      expect(screen.getByLabelText('Grade')).toBeInTheDocument();
      expect(screen.getByLabelText('Site')).toBeInTheDocument();
    });

    it('does not render Bamic fields when isBamic is false', () => {
      renderComponent({ details: { isBamic: false } });
      expect(screen.queryByLabelText('Grade')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Site')).not.toBeInTheDocument();
    });

    it('disables Bamic fields when a request is pending', () => {
      renderComponent({ details: { isBamic: true }, isRequestPending: true });
      expect(screen.getByLabelText('Grade')).toBeDisabled();
      expect(screen.getByLabelText('Site')).toBeDisabled();
    });
  });

  describe('[feature-flag] custom-pathologies', () => {
    beforeEach(() => {
      window.featureFlags['custom-pathologies'] = true;
    });

    it('shows and hides the supplemental pathology input on button clicks', async () => {
      const { user, container } = renderComponent();
      const addPathologyButton = screen.getByRole('button', {
        name: 'Add supplemental pathology',
      });
      await user.click(addPathologyButton);

      expect(
        screen.queryByRole('button', { name: 'Add supplemental pathology' })
      ).not.toBeInTheDocument();
      const supplementalInput = screen.getByLabelText('Supplemental pathology');
      expect(supplementalInput).toBeInTheDocument();

      const deleteButton = container.querySelector('.icon-bin');
      expect(deleteButton).toBeInTheDocument();
      await user.click(deleteButton);

      expect(
        screen.queryByLabelText('Supplemental pathology')
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add supplemental pathology' })
      ).toBeInTheDocument();
    });

    it('disables add pathology button when issue has recurrence', () => {
      renderComponent({ hasRecurrence: true });
      expect(
        screen.getByRole('button', { name: 'Add supplemental pathology' })
      ).toBeDisabled();
    });
  });

  describe('[feature-flag] supplemental-recurrence-code', () => {
    beforeEach(() => {
      window.featureFlags['supplemental-recurrence-code'] = true;
    });

    it('shows supplemental recurrence input if occurrenceType is recurrence', () => {
      renderComponent({
        occurrenceType: 'recurrence',
        hasRecurrence: true,
        details: { supplementaryCoding: 'some value' },
      });
      expect(screen.getByText('Supplemental recurrence')).toBeInTheDocument();
    });

    it('does not show supplemental recurrence input if occurrenceType is new', () => {
      renderComponent({ occurrenceType: 'new', hasRecurrence: true });
      expect(
        screen.queryByText('Supplemental recurrence')
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-injury-flow-fields', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['pm-injury-edit-mode-of-onset'] = true;
    });

    it('enables fields when the issue is a continuation', () => {
      renderComponent({
        isContinuationIssue: true,
        details: { onset: 4, onsetDescription: 'mocked onset description' },
      });

      expect(screen.getByLabelText('Onset type')).toBeEnabled();

      const label = screen.getByText('Description of onset');
      const onsetDescriptionContainer = label.closest(
        'div[class*="onsetDescription"]'
      );
      const textarea = within(onsetDescriptionContainer).getByRole('textbox');
      expect(textarea).toBeEnabled();

      const sideGroup = screen.getByTestId('SegmentedControl|Group');
      const sideButtons = within(sideGroup).getAllByRole('button');
      sideButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('renders the Description of onset field with correct value', () => {
      renderComponent({
        details: { onset: 4, onsetDescription: 'mocked onset description' },
      });

      const label = screen.getByText('Description of onset');
      const onsetDescriptionContainer = label.closest(
        'div[class*="onsetDescription"]'
      );
      const textarea = within(onsetDescriptionContainer).getByRole('textbox');

      expect(textarea).toHaveValue('mocked onset description');
    });
  });

  const osiics15Props = {
    ...baseProps,
    details: {
      coding: {
        pathologies: [
          {
            id: 1592,
            code: 'WUPM',
            pathology: 'RED-S (Relative Energy Deficiency in Sport)',
            coding_system_version: {
              id: 5,
              coding_system: { id: 5, name: 'OSIICS-15', key: 'osiics_15' },
              name: 'OSIICS-15.1',
            },
            coding_system_body_area: { id: 19, name: 'Upper arm' },
            coding_system_classification: { id: 24, name: 'Bone contusion  ' },
          },
        ],
      },
    },
  };

  describe('EditView - OSIICS15', () => {
    beforeEach(() => {
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_OSIICS15);
    });

    it('renders Osiics15 component correctly when no data is present', async () => {
      renderComponent({
        details: { coding: { pathologies: [] } },
      });

      const bodyAreaLabel = await screen.findByText('Body area:');
      expect(bodyAreaLabel.parentElement).toHaveTextContent('Body area: N/A');

      const classificationLabel = screen.getByText('Classification:');
      expect(classificationLabel.parentElement).toHaveTextContent(
        'Classification: N/A'
      );

      const codeLabel = screen.getByText('Code:');
      expect(codeLabel.parentElement).toHaveTextContent('Code: N/A');

      expect(screen.getByText('Side')).toBeInTheDocument();
    });

    it('renders Osiics15 component correctly when data IS present', async () => {
      renderComponent(osiics15Props);

      const bodyAreaLabel = await screen.findByText('Body area:');
      expect(bodyAreaLabel.parentElement).toHaveTextContent(
        'Body area: Upper arm'
      );

      const classificationLabel = screen.getByText('Classification:');
      expect(classificationLabel.parentElement).toHaveTextContent(
        'Classification: Bone contusion'
      );

      const codeLabel = screen.getByText('Code:');
      expect(codeLabel.parentElement).toHaveTextContent('Code: WUPM');

      expect(screen.getByText('Side')).toBeInTheDocument();
    });
  });

  describe('EditView - CI Coding System & Date Pickers', () => {
    beforeEach(() => {
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_CI);
    });

    it('renders the movement aware date picker when coding system is CI and correct FFs are ON', () => {
      window.featureFlags['examination-date'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = true;
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = false;

      renderComponent();
      expect(
        screen.queryByTestId('IssueExaminationDatePicker')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('MovementAwareDatePicker')
      ).toBeInTheDocument();
    });

    it('renders the IssueExaminationDatePicker when coding system is NOT CI and correct FFs are ON', () => {
      window.featureFlags['examination-date'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = true;
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
      useOrganisation.mockReturnValue(MOCK_ORGANISATION_ICD);

      renderComponent();
      expect(
        screen.getByTestId('IssueExaminationDatePicker')
      ).toBeInTheDocument();
    });

    it('does not render any special date picker when movement FFs are OFF', () => {
      window.featureFlags['player-movement-aware-datepicker'] = false;
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = false;

      renderComponent();

      expect(
        screen.queryByTestId('IssueExaminationDatePicker')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('MovementAwareDatePicker')
      ).not.toBeInTheDocument();
    });
  });
});
