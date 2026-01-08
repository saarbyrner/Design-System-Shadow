import moment from 'moment-timezone';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  SPLIT_DOCUMENT_MODES,
  DOCUMENT_SPLITTER_USAGE,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { minimalSquadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import {
  useGetDocumentNoteCategoriesQuery,
  useGetAthleteDataQuery,
  useSearchPastAthletesQuery,
  useGetAncillaryEligibleRangesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { medicalAttachmentCategories } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/getMedicalAttachmentCategories';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentSplitter from '@kitman/components/src/DocumentSplitter';
import { initialState as splitSetupSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import { initialState as detailsGridSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

const selectedCategory = {
  id: medicalAttachmentCategories.medical_attachment_categories[0].id,
  label: medicalAttachmentCategories.medical_attachment_categories[0].name,
};
const selectedPlayer = { id: 40211, label: 'Tomas Albornoz' };
const testFileName = 'Test name';
const testDate = '2024-04-03T00:00:00+00:00';
const testPageRange = '1-10';

const mockAssociatedIssues = [
  { id: 101, label: 'Injury 1', type: 'Injury', group: 'Open injury/illness' },
  {
    id: 102,
    label: 'Illness 1',
    type: 'Illness',
    group: 'Open injury/illness',
  },
  {
    id: 103,
    label: 'Chronic Injury 1',
    type: 'ChronicInjury',
    group: 'Chronic conditions',
  },
];

const validSplitSetupState = {
  documentDetails: {
    ...splitSetupSliceInitialState.documentDetails,
    fileName: testFileName,
    documentDate: testDate,
    documentCategories: [selectedCategory],
    players: [selectedPlayer],
  },
  splitOptions: {
    ...splitSetupSliceInitialState.splitOptions,
    splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
    numberOfSections: 1,
  },
};

const validDetailsGridState = {
  ...detailsGridSliceInitialState,
  defaults: {
    defaultCategories: [selectedCategory],
    defaultFileName: testFileName,
    defaultDateOfDocument: testDate,
  },
  dataRows: [
    {
      id: 1,
      pages: testPageRange,
      player: selectedPlayer,
      categories: [selectedCategory],
      fileName: testFileName,
      dateOfDocument: testDate,
      associatedIssues: mockAssociatedIssues,
    },
  ],
};

const expectedSubmissionData = [
  {
    athlete_id: selectedPlayer.id,
    document_date: testDate,
    file_name: testFileName,
    medical_attachment_category_ids: [1],
    range: testPageRange,
    injury_occurrence_ids: [101],
    illness_occurrence_ids: [102],
    chronic_issue_ids: [103],
  },
];

const defaultState = {
  medicalSharedApi: {
    useGetDocumentNoteCategoriesQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  },
  globalApi: {
    useGetSquadAthletesQuery: jest.fn(),
  },
  toasts: [],
  splitSetupSlice: validSplitSetupState,
  detailsGridSlice: validDetailsGridState,
};

const mockProcessAllocations = jest.fn().mockResolvedValue(); // no value

const defaultProps = {
  isOpen: true,
  usage: DOCUMENT_SPLITTER_USAGE.massScanning,
  totalPages: 10,
  athleteId: null,
  processAllocationsCallback: mockProcessAllocations,
  onSaveSuccessCallback: jest.fn(),
  onSaveErrorCallback: jest.fn(),
  onCloseCallback: jest.fn(),
  onStepChangedCallback: jest.fn(),
  t: i18nextTranslateStub(),
};

const mockDispatch = jest.fn();
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const renderComponent = (props = defaultProps, state = defaultState) =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <DocumentSplitter {...props} />
        </LocalizationProvider>
      </Provider>
    </I18nextProvider>
  );

describe('DocumentSplitter', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
    useSearchPastAthletesQuery.mockReturnValue({
      data: {
        athletes: [],
      },
      error: false,
      isLoading: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: minimalSquadAthletes,
      error: false,
      isLoading: false,
    });
    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: medicalAttachmentCategories.medical_attachment_categories,
      error: false,
      isLoading: false,
    });
    useGetAthleteDataQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    mockDispatch.mockClear();
  });

  it('renders the SplitSetup as first step', async () => {
    renderComponent();
    expect(screen.getByText('Attach')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Next',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Reset',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Save',
      })
    ).not.toBeInTheDocument();
    expect(defaultProps.onStepChangedCallback).not.toHaveBeenCalled();
  });

  it('renders the details grid step after clicking next', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText('Attach')).toBeInTheDocument();
    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    expect(nextButton).toBeInTheDocument();
    await user.click(nextButton);

    expect(defaultProps.onStepChangedCallback).toHaveBeenCalledWith(
      'allocations'
    );

    expect(nextButton).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Save',
      })
    ).toBeInTheDocument();

    const resetButton = screen.getByRole('button', {
      name: 'Reset',
    });
    expect(resetButton).toBeInTheDocument();

    await user.click(resetButton);

    expect(defaultProps.onStepChangedCallback).toHaveBeenCalledWith(
      'documentDetails'
    );
    expect(mockProcessAllocations).not.toHaveBeenCalled();
  });

  it('calls processAllocationsCallback and onSaveSuccessCallback after clicking save when no errors', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText('Attach')).toBeInTheDocument();
    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);
    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    mockDispatch.mockClear();
    mockProcessAllocations.mockResolvedValue();

    await user.click(saveButton);

    expect(mockProcessAllocations).toHaveBeenCalledWith(expectedSubmissionData);
    expect(defaultProps.onSaveSuccessCallback).toHaveBeenCalled();
    expect(defaultProps.onSaveErrorCallback).not.toHaveBeenCalled();
    expect(defaultProps.onCloseCallback).toHaveBeenCalled();
  });

  it('calls processAllocationsCallback but not onSaveSuccessCallback when errors', async () => {
    const user = userEvent.setup();
    renderComponent();
    expect(screen.getByText('Attach')).toBeInTheDocument();
    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);
    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    mockDispatch.mockClear();
    mockProcessAllocations.mockRejectedValue('Mocked error');

    await user.click(saveButton);

    expect(mockProcessAllocations).toHaveBeenCalledWith(expectedSubmissionData);
    expect(defaultProps.onSaveSuccessCallback).not.toHaveBeenCalled();
    expect(defaultProps.onSaveErrorCallback).toHaveBeenCalledWith(undefined);
    expect(defaultProps.onCloseCallback).not.toHaveBeenCalled();
  });

  it('calls onSaveErrorCallback when errors', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText('Attach')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);
    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    mockDispatch.mockClear();
    mockProcessAllocations.mockRejectedValue({
      response: {
        data: {
          errors: {
            documents: ["a document_date can't be in the future"],
          },
          success: false,
        },
      },
    });

    await user.click(saveButton);

    expect(mockProcessAllocations).toHaveBeenCalledWith(expectedSubmissionData);
    expect(defaultProps.onSaveSuccessCallback).not.toHaveBeenCalled();
    expect(defaultProps.onSaveErrorCallback).toHaveBeenCalledWith(
      'A document date cannot be in the future'
    );
    expect(defaultProps.onCloseCallback).not.toHaveBeenCalled();
  });

  it('calls processAllocationsCallback with correct issue IDs when associated issues are present', async () => {
    const user = userEvent.setup();
    const stateWithIssues = {
      ...defaultState,
      detailsGridSlice: {
        ...defaultState.detailsGridSlice,
        dataRows: [
          {
            ...defaultState.detailsGridSlice.dataRows[0],
            associatedIssues: mockAssociatedIssues,
          },
        ],
      },
    };
    renderComponent(defaultProps, stateWithIssues);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await user.click(nextButton);
    const saveButton = screen.getByRole('button', { name: 'Save' });

    mockDispatch.mockClear();
    mockProcessAllocations.mockResolvedValue();

    await user.click(saveButton);

    expect(mockProcessAllocations).toHaveBeenCalledWith([
      {
        ...expectedSubmissionData[0],
        injury_occurrence_ids: [101],
        illness_occurrence_ids: [102],
        chronic_issue_ids: [103],
      },
    ]);
    expect(defaultProps.onSaveSuccessCallback).toHaveBeenCalled();
    expect(defaultProps.onSaveErrorCallback).not.toHaveBeenCalled();
    expect(defaultProps.onCloseCallback).toHaveBeenCalled();
  });
});
