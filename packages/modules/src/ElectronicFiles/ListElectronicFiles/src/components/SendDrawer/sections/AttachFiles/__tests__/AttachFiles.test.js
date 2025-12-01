import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useSearchPastAthletesQuery,
  useGetMedicalAttachmentsFileTypesQuery,
  useGetDocumentNoteCategoriesQuery,
  useSearchMedicalEntityAttachmentsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  mockState,
  mockSquadAthletes,
  mockDateRangeValue,
  mockDocumentFileTypes,
  mockDocumentCategories,
  mockFiles,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import AttachFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer/sections/AttachFiles';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockHandleChange = jest.fn();
const mockHandleAttachSelectedFiles = jest.fn();
const props = {
  handleChange: mockHandleChange,
  handleAttachSelectedFiles: mockHandleAttachSelectedFiles,
  t: i18nextTranslateStub(),
};

const initialState = mockState.sendDrawerSlice;

const renderComponent = (state = initialState) => {
  const store = storeFake({
    sendDrawerSlice: state,
  });
  return render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AttachFiles {...props} />
      </LocalizationProvider>
    </Provider>
  );
};

describe('AttachFiles section', () => {
  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      error: false,
      isLoading: false,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: { permissions: {} },
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
    useGetMedicalAttachmentsFileTypesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useSearchMedicalEntityAttachmentsQuery.mockReturnValue({
      data: {
        entity_attachments: [],
        meta: { pagination: { next_token: null } },
      },
      error: false,
      isLoading: false,
    });
  });

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('From documents')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
    expect(screen.getByLabelText('File types')).toBeInTheDocument();
    expect(screen.getByLabelText('Categories')).toBeInTheDocument();
    expect(screen.getByLabelText('Search files')).toBeInTheDocument();
  });

  it('calls updateData when selecting an athlete', async () => {
    const user = userEvent.setup();

    useGetSquadAthletesQuery.mockReturnValue({
      data: mockSquadAthletes,
      error: false,
      isLoading: false,
    });

    renderComponent();

    const athleteDropdown = screen.getByLabelText('Athlete');

    await user.click(athleteDropdown);

    await user.click(screen.getByRole('option', { name: 'Mohamed Ali 2' }));

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('athlete', {
      group: 'International Squad',
      id: 108269,
      label: 'Mohamed Ali 2',
    });
  });

  it('calls updateData when selecting a date range is selected', async () => {
    renderComponent();

    const input = screen.getByLabelText('Date range');

    fireEvent.change(input, {
      target: { value: mockDateRangeValue },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('documentDateRange', {
      start_date: '2024-03-04T00:00:00+00:00',
      end_date: '2024-03-07T00:00:00+00:00',
    });
  });

  it('calls updateData when selecting a file type', async () => {
    const user = userEvent.setup();

    useGetMedicalAttachmentsFileTypesQuery.mockReturnValue({
      data: mockDocumentFileTypes,
      error: false,
      isLoading: false,
    });

    renderComponent();

    const categoryDropdown = screen.getByLabelText('File types');

    await user.click(categoryDropdown);

    await user.click(screen.getByRole('option', { name: 'Images' }));

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('documentFileTypes', [
      { id: 'image', label: 'Images' },
    ]);
  });

  it('calls updateData when selecting a category', async () => {
    const user = userEvent.setup();

    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: mockDocumentCategories,
      error: false,
      isLoading: false,
    });

    renderComponent();

    const categoryDropdown = screen.getByLabelText('Categories');

    await user.click(categoryDropdown);

    await user.click(screen.getByRole('option', { name: 'Category 2' }));

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('documentCategories', [
      { id: 2, label: 'Category 2' },
    ]);
  });

  it('calls updateData when selecting a file', async () => {
    const user = userEvent.setup();

    useSearchMedicalEntityAttachmentsQuery.mockReturnValue({
      data: mockFiles,
      error: false,
      isLoading: false,
    });

    renderComponent({
      ...initialState,
      data: {
        ...initialState.data,
        athlete: {
          group: 'International Squad',
          id: 108269,
          label: 'Mohamed Ali 2',
        },
      },
    });

    const filesDropdown = screen.getByLabelText('Files');

    await user.click(filesDropdown);

    await user.click(
      screen.getAllByRole('option', {
        name: 'liverpool.jpg - 34.7 kB',
      })[0]
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('selectedFiles', [
      {
        id: mockFiles.entity_attachments[0].attachment.id,
        label: mockFiles.entity_attachments[0].attachment.name,
        file: mockFiles.entity_attachments[0].attachment,
      },
    ]);
  });

  it('calls useSearchMedicalEntityAttachmentsQuery when searching', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...initialState,
      data: {
        ...initialState.data,
      },
    });

    const searchText = 'dummy text';

    const filesDropdown = screen.getByLabelText('Search files');

    await user.type(filesDropdown, searchText);

    expect(filesDropdown).toHaveValue(searchText);

    expect(useSearchMedicalEntityAttachmentsQuery).toHaveBeenCalled();
  });

  it('calls attachFiles when clicking on Attach', async () => {
    const user = userEvent.setup();

    useSearchMedicalEntityAttachmentsQuery.mockReturnValue({
      data: mockFiles,
      error: false,
      isLoading: false,
    });

    renderComponent({
      ...initialState,
      data: {
        ...initialState.data,
        athlete: {
          group: 'International Squad',
          id: 108269,
          label: 'Mohamed Ali 2',
        },
        selectedFiles: [
          {
            id: mockFiles.entity_attachments[0].attachment.id,
            label: mockFiles.entity_attachments[0].attachment.name,
            file: mockFiles.entity_attachments[0].attachment,
          },
        ],
      },
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Attach',
      })
    );

    expect(mockHandleAttachSelectedFiles).toHaveBeenCalledTimes(1);
    expect(mockHandleAttachSelectedFiles).toHaveBeenCalledWith();
  });
});
