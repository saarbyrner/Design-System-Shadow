import moment from 'moment-timezone';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import i18n from '@kitman/common/src/utils/i18n';
import { server, rest } from '@kitman/services/src/mocks/server';
import MassScanningModal from '@kitman/modules/src/Medical/shared/components/MassScanningModal';
import { generateSpecificJobUrl } from '@kitman/services/src/services/medical/scanning/splitDocument';
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
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { initialState as splitSetupSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import { initialState as detailsGridSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';
import { jobsUrl } from '@kitman/services/src/services/medical/scanning/createJob';
import { axios } from '@kitman/common/src/utils/services';
import {
  uploadScanErrorToast,
  uploadScanProgressToast,
} from '@kitman/modules/src/Medical/shared/components/MassScanningModal/consts';
import {
  splitDocumentSuccessToast,
  splitDocumentErrorToast,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import {
  mockUploadUrl,
  headers,
} from '@kitman/services/src/mocks/handlers/uploads/putFileToPresignedUrl.mock';

const mockScanComponentText = 'Mocked scan component';
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/components/src/DocumentScanner');

const selectedCategory = {
  id: medicalAttachmentCategories.medical_attachment_categories[0].id,
  label: medicalAttachmentCategories.medical_attachment_categories[0].name,
};
const selectedPlayer = { id: 40211, label: 'Tomas Albornoz' };
const testFileName = 'Test name';
const testDate = '2024-04-03T00:00:00+00:00';
const testPageRange = '1-5'; // Mock scanner returns 5 pages

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
      associatedIssues: [],
    },
  ],
};

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

const defaultProps = {
  isOpen: true,
  onSavedSuccess: jest.fn(),
  onClose: jest.fn(),
  toastAction: jest.fn(),
  athleteId: null,
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
          <MassScanningModal {...props} />
        </LocalizationProvider>
      </Provider>
    </I18nextProvider>
  );

describe('<MassScanningModal/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-mass-scanning'] = true;

    useGetPermissionsQuery.mockReturnValue({
      data: {},
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
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
    useGetAthleteDataQuery.mockReturnValue({
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
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    window.featureFlags['medical-mass-scanning'] = false;

    moment.tz.setDefault();
    mockDispatch.mockClear();
  });

  it('renders the modal in scanning step', async () => {
    renderComponent();
    expect(screen.getByText('Scan')).toBeInTheDocument();
    const ScannerComponent = await screen.findByText(mockScanComponentText);
    expect(ScannerComponent).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Add',
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText('Attach')).not.toBeInTheDocument();
  });

  it('calls onClose when canceled', async () => {
    const user = userEvent.setup();
    renderComponent();
    await screen.findByText(mockScanComponentText);
    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
      hidden: true,
    });
    await user.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders the DocumentSplitter step after adding a scan', async () => {
    const user = userEvent.setup();
    renderComponent();
    await screen.findByText(mockScanComponentText);
    expect(screen.getByText('Scan')).toBeInTheDocument();
    const AddButton = screen.getByRole('button', {
      name: 'Add',
      hidden: true,
    });

    const postRequests = jest.spyOn(axios, 'post');
    const putRequests = jest.spyOn(axios, 'put');

    await user.click(AddButton);
    const scannerText = screen.queryByText(mockScanComponentText);
    if (scannerText !== null) {
      await waitForElementToBeRemoved(scannerText);
    }
    expect(postRequests).toHaveBeenCalledWith(jobsUrl);
    expect(putRequests).toHaveBeenCalledWith(
      mockUploadUrl,
      {
        fileStandIn: 'notReallyAFile',
      },
      { headers }
    );

    expect(defaultProps.toastAction).toHaveBeenCalledWith({
      toast: uploadScanProgressToast(),
      type: 'CREATE_TOAST',
    });
    expect(defaultProps.toastAction).toHaveBeenCalledWith({
      id: uploadScanProgressToast().id,
      type: 'REMOVE_TOAST_BY_ID',
    });
    expect(defaultProps.toastAction).not.toHaveBeenCalledWith({
      toast: uploadScanErrorToast(),
      type: 'CREATE_TOAST',
    });

    expect(screen.getByText('Attach')).toBeInTheDocument();
  });

  it('renders the success toast and calls onSavedSuccess', async () => {
    const user = userEvent.setup();
    defaultProps.onClose.mockClear();
    defaultProps.onSavedSuccess.mockClear();

    renderComponent();
    await screen.findByText(mockScanComponentText);
    const AddButton = screen.getByRole('button', {
      name: 'Add',
      hidden: true,
    });

    await user.click(AddButton);
    const scannerText = screen.queryByText(mockScanComponentText);
    if (scannerText !== null) {
      await waitForElementToBeRemoved(scannerText);
    }

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
    await user.click(saveButton);

    expect(defaultProps.toastAction).toHaveBeenCalledWith({
      toast: splitDocumentSuccessToast(),
      type: 'CREATE_TOAST',
    });
    expect(defaultProps.onSavedSuccess).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders the error toast and does not call onSavedSuccess', async () => {
    const user = userEvent.setup();
    defaultProps.onClose.mockClear();
    defaultProps.onSavedSuccess.mockClear();

    const testJobId = 1;
    server.use(
      rest.put(generateSpecificJobUrl(testJobId), (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderComponent();
    await screen.findByText(mockScanComponentText);
    const AddButton = screen.getByRole('button', {
      name: 'Add',
      hidden: true,
    });

    await user.click(AddButton);
    const scannerText = screen.queryByText(mockScanComponentText);
    if (scannerText !== null) {
      await waitForElementToBeRemoved(scannerText);
    }

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
    await user.click(saveButton);

    expect(defaultProps.toastAction).toHaveBeenCalledWith({
      toast: splitDocumentErrorToast(),
      type: 'CREATE_TOAST',
    });
    expect(defaultProps.onSavedSuccess).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
