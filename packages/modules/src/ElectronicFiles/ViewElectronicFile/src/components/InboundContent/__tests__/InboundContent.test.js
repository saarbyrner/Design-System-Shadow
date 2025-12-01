import { axios } from '@kitman/common/src/utils/services';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { initialState as splitSetupSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import { initialState as detailsGridSliceInitialState } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';
import { medicalAttachmentCategories } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/getMedicalAttachmentCategories';
import {
  useUpdateViewedMutation,
  useSplitDocumentMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import {
  mockState,
  mockUploadedFiles,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import {
  splitDocumentSuccessToast,
  splitDocumentErrorToast,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { generateEndpointUrl } from '@kitman/modules/src/ElectronicFiles/shared/services/api/splitDocument';
import InboundContent from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/InboundContent';

setI18n(i18n);

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Document: ({ onLoadSuccess = (pdf = { numPages: 10 }) => pdf.numPages }) => {
    return <div>{onLoadSuccess({ numPages: 10 })}</div>;
  },
  Outline: null,
  Page: () => <div>Page</div>,
}));
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockUpdateViewedMutation = jest.fn();
const mockSplitDocumentMutation = jest.fn();

const defaultProps = {
  electronicFile: mockInboundData.data,
  t: i18nextTranslateStub(),
};

const selectedCategory = {
  id: medicalAttachmentCategories.medical_attachment_categories[0].id,
  label: medicalAttachmentCategories.medical_attachment_categories[0].name,
};
const selectedPlayer = { id: 40211, label: 'Tomas Albornoz' };
const testFileName = 'Test name';
const testDate = '2024-04-03T00:00:00+00:00';
const testPageRange = '1-10';

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
    },
  ],
};

const store = storeFake({
  ...mockState,
  splitSetupSlice: validSplitSetupState,
  detailsGridSlice: validDetailsGridState,
  globalApi: {},
  medicalSharedApi: {},
  electronicFilesApi: {},
});

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <InboundContent {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('<InboundContent />', () => {
  beforeAll(() => {
    /*
     * Silence react-pdf warning https://github.com/wojtekmaj/react-pdf/issues/564
     * This warning only comes up on the test, due to the way the react-pdf library has to be mocked
     */
    jest.spyOn(global.console, 'error').mockImplementationOnce((message) => {
      if (
        !message.includes('Warning: Cannot update a component') &&
        !message.includes('while rendering a different component')
      ) {
        global.console.error(message);
      }
    });
  });
  beforeEach(() => {
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useSplitDocumentMutation.mockReturnValue([mockSplitDocumentMutation], {
      isLoading: false,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () =>
          Promise.resolve({
            blob: mockUploadedFiles[0].file,
          }),
      })
    );
  });

  it('renders correctly', async () => {
    renderComponent();

    expect(await screen.findByText('Attach')).toBeInTheDocument();
  });

  it('does not render the document splitter if the eFax is archived', async () => {
    renderComponent({
      ...defaultProps,
      electronicFile: {
        ...defaultProps.electronicFile,
        archived: true,
      },
    });

    await waitFor(() => {
      expect(screen.queryByText('Attach')).not.toBeInTheDocument();
    });
  });

  it('does not render the document splitter if the eFax attachment url is null', async () => {
    renderComponent({
      ...defaultProps,
      electronicFile: {
        ...defaultProps.electronicFile,
        attachment: {
          ...defaultProps.electronicFile?.attachment,
          url: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByText('Attach')).not.toBeInTheDocument();
    });
  });

  it('calls updateViewed on load if viewed = false', async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockUpdateViewedMutation).toHaveBeenCalledTimes(1);
      expect(mockUpdateViewedMutation).toHaveBeenCalledWith({
        viewed: true,
        inboundElectronicFileIds: [1],
      });
    });
  });

  it('renders the success toast on split document', async () => {
    const user = userEvent.setup();

    const request = jest.spyOn(axios, 'post');

    renderComponent();

    const nextButton = await screen.findByRole('button', {
      name: 'Next',
    });

    await user.click(nextButton);

    const saveButton = await screen.findByRole('button', {
      name: 'Save',
    });

    await user.click(saveButton);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(generateEndpointUrl(1), {
      allocations_attributes: [
        {
          athlete_id: selectedPlayer.id,
          document_date: testDate,
          file_name: testFileName,
          medical_attachment_category_ids: [selectedCategory.id],
          range: testPageRange,
        },
      ],
    });

    expect(store.dispatch).toHaveBeenLastCalledWith({
      payload: splitDocumentSuccessToast(),
      type: 'toasts/add',
    });
  });

  it('renders the error toast on split document', async () => {
    const user = userEvent.setup();

    const request = jest.spyOn(axios, 'post');

    server.use(
      rest.post(
        generateEndpointUrl(defaultProps.electronicFile?.id),
        (req, res, ctx) => res(ctx.status(500))
      )
    );

    renderComponent();

    const nextButton = await screen.findByRole('button', {
      name: 'Next',
    });

    await user.click(nextButton);

    const saveButton = await screen.findByRole('button', {
      name: 'Save',
    });

    await user.click(saveButton);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(generateEndpointUrl(1), {
      allocations_attributes: [
        {
          athlete_id: selectedPlayer.id,
          document_date: testDate,
          file_name: testFileName,
          medical_attachment_category_ids: [selectedCategory.id],
          range: testPageRange,
        },
      ],
    });

    expect(store.dispatch).toHaveBeenLastCalledWith({
      payload: splitDocumentErrorToast(),
      type: 'toasts/add',
    });
  });
});
