import { render, screen, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import {
  useFetchInboundElectronicFileQuery,
  useFetchOutboundElectronicFileQuery,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useSplitDocumentMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { getContactDisplayText } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import MainContent from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/MainContent';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockSplitDocumentMutation = jest.fn();

const props = {
  id: 1,
  t: i18nextTranslateStub(),
};

const store = storeFake(mockState);

const renderComponent = () =>
  render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MainContent {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('<MainContent />', () => {
  beforeEach(() => {
    useFetchInboundElectronicFileQuery.mockReturnValue({
      data: mockInboundData,
      isSuccess: true,
    });
    useFetchOutboundElectronicFileQuery.mockReturnValue({
      data: mockOutboundData,
      isSuccess: true,
    });
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
    useSplitDocumentMutation.mockReturnValue([mockSplitDocumentMutation], {
      isLoading: false,
    });
  });
  it('renders details correctly', async () => {
    renderComponent();

    await waitFor(() => {
      const data = inboundData.data[0];

      const fromText = getContactDisplayText({
        firstName: data.received_from.first_name,
        lastName: data.received_from.last_name,
        companyName: data.received_from.company_name,
        faxNumber: data.received_from.fax_number.number,
      });

      expect(screen.getByText(fromText)).toBeInTheDocument();
      expect(
        screen.getByText(formatStandard({ date: moment(data.date) }))
      ).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('renders loading spinner correctly', () => {
      useFetchInboundElectronicFileQuery.mockReturnValue({
        isLoading: true,
        isFetching: true,
      });

      renderComponent();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders correctly when error with 404 status', () => {
      useFetchInboundElectronicFileQuery.mockReturnValue({
        data: {
          data: null,
          meta: {
            prev_id: null,
            next_id: null,
          },
        },
        isSuccess: false,
        isError: true,
        error: {
          status: 404,
        },
      });

      renderComponent();
      expect(screen.getByText('eFile not found.')).toBeInTheDocument();
    });

    it('renders correctly when other error', () => {
      useFetchInboundElectronicFileQuery.mockReturnValue({
        data: {
          data: null,
          meta: {
            prev_id: null,
            next_id: null,
          },
        },
        isSuccess: false,
        isError: true,
        error: {
          status: 500,
        },
      });

      renderComponent();
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });
});
