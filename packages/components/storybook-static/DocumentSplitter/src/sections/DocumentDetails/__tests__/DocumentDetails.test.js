import moment from 'moment-timezone';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { minimalSquadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import {
  useGetDocumentNoteCategoriesQuery,
  useSearchPastAthletesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import DocumentDetails from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails';
import { DOCUMENT_DETAILS_DATA_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { medicalAttachmentCategories } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/getMedicalAttachmentCategories';

setI18n(i18n);

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

const mockHandleChange = jest.fn();
const mockPlayers = [
  {
    group: 'International Squad',
    id: 108269,
    label: 'Mohamed Ali 2',
  },
];

const defaultProps = {
  data: {},
  validation: { hasErrors: false },
  handleChange: mockHandleChange,
  t: i18nextTranslateStub(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = storeFake({
  medicalSharedApi: {
    useGetDocumentNoteCategoriesQuery: jest.fn(),
  },
  globalApi: {
    useGetSquadAthletesQuery: jest.fn(),
  },
});

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={mockStore}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <DocumentDetails {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('Document Details section', () => {
  beforeEach(() => {
    window.featureFlags['medical-files-tab-enhancement'] = true;

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
    moment.tz.setDefault();
    window.featureFlags['medical-files-tab-enhancement'] = false;
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    renderComponent();

    expect(
      screen.queryByText('Invalid document details')
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('File name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of document')).toBeInTheDocument();
    expect(screen.getByLabelText('Categories')).toBeInTheDocument();
    expect(screen.getByLabelText('Players')).toBeInTheDocument();
  });

  it('renders supplied data values correctly', () => {
    const data = {
      [DOCUMENT_DETAILS_DATA_KEY.fileName]: 'Test name',
      [DOCUMENT_DETAILS_DATA_KEY.documentCategories]: [
        { id: 1, label: 'Concussion Docs' },
      ],
      [DOCUMENT_DETAILS_DATA_KEY.players]: mockPlayers,
      [DOCUMENT_DETAILS_DATA_KEY.documentDate]: '2024-04-03T00:00:00+00:00',
    };
    renderComponent({ ...defaultProps, data });

    const fileNameInput = screen.getByLabelText('File name');
    expect(fileNameInput).toHaveValue('Test name');

    expect(screen.getByText('Concussion Docs')).toBeInTheDocument();
    expect(screen.getByText('Mohamed Ali 2')).toBeInTheDocument();

    const datePicker = screen.getByLabelText('Date of document');
    expect(datePicker).toHaveValue('03/04/2024');
  });

  it('calls handleChange when a File name is entered', async () => {
    const user = userEvent.setup();

    renderComponent();
    const fileNameInput = screen.getByLabelText('File name');

    const fileNameText = 'My filename';
    await user.type(fileNameInput, fileNameText);
    expect(fileNameInput).toHaveValue(fileNameText);

    expect(mockHandleChange).toHaveBeenCalledWith({
      [DOCUMENT_DETAILS_DATA_KEY.fileName]: fileNameText,
    });
  });

  it('calls handleChange when a Date is entered', async () => {
    renderComponent();
    const datePicker = screen.getByLabelText('Date of document');
    fireEvent.change(datePicker, {
      target: { value: '03/04/2024' }, // 3rd April
    });

    expect(mockHandleChange).toHaveBeenCalledWith({
      [DOCUMENT_DETAILS_DATA_KEY.documentDate]: '2024-04-03T00:00:00+00:00',
    });
  });

  it('calls handleChange when a Category is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const categorySelect = screen.getByLabelText('Categories');

    const category =
      medicalAttachmentCategories.medical_attachment_categories[0];

    await user.click(categorySelect);
    await user.click(
      screen.getByRole('option', {
        name: category.name,
      })
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      [DOCUMENT_DETAILS_DATA_KEY.documentCategories]: [
        { id: 1, label: 'Concussion Docs' },
      ],
    });
  });

  it('calls handleChange when a player is selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const playerSelect = screen.getByLabelText('Players');
    await user.click(playerSelect);
    await user.click(screen.getByRole('option', { name: 'Mohamed Ali 2' }));

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      [DOCUMENT_DETAILS_DATA_KEY.players]: mockPlayers,
    });
  });

  it('renders file name TextField as invalid if validation failed', async () => {
    renderComponent({
      ...defaultProps,
      validation: {
        hasErrors: true,
        errors: {
          [DOCUMENT_DETAILS_DATA_KEY.fileName]: [
            'Something wrong with filename',
          ],
        },
      },
    });

    expect(screen.getByText('Invalid document details')).toBeInTheDocument();
    expect(screen.getByLabelText('File name')).not.toBeValid();
    expect(screen.getByLabelText('Date of document')).toBeValid();
    expect(screen.getByLabelText('Categories')).toBeValid();
    expect(screen.getByLabelText('Players')).toBeValid();
  });
});
