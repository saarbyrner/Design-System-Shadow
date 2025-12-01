import { render, screen, within } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { FILTER_KEY } from '@kitman/modules/src/ElectronicFiles/shared/types';
import Filters from '@kitman/modules/src/ElectronicFiles/shared/components/Filters';

setI18n(i18n);

const mockOnSearch = jest.fn();
const mockOnUpdateFilter = jest.fn();

const defaultProps = {
  allowedFilters: [FILTER_KEY.search, FILTER_KEY.dateRange],
  onSearch: mockOnSearch,
  onUpdateFilter: mockOnUpdateFilter,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps, state = mockState) =>
  render(
    <Provider store={storeFake(state)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Filters {...props} />
      </LocalizationProvider>
    </Provider>
  );

const allFilters = [
  { filterKey: FILTER_KEY.search, label: 'Search' },
  { filterKey: FILTER_KEY.dateRange, label: 'Date range' },
  { filterKey: FILTER_KEY.status, label: 'Status' },
];

describe('<Filters />', () => {
  it('renders correctly', () => {
    allFilters.forEach((currentFilter) => {
      const { container } = renderComponent({
        ...defaultProps,
        allowedFilters: [currentFilter.filterKey],
      });

      const otherFilters = allFilters.filter(
        (filter) => filter.filterKey !== currentFilter.filterKey
      );

      expect(
        within(container).getByLabelText(currentFilter.label)
      ).toBeInTheDocument();

      otherFilters.forEach((otherFilter) => {
        expect(
          within(container).queryByLabelText(otherFilter.label)
        ).not.toBeInTheDocument();
      });
    });

    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.RefreshOutlined}Icon`)
    ).not.toBeInTheDocument();
  });

  it('renders disabled filters in loading state correctly', () => {
    renderComponent(
      {
        ...defaultProps,
        allowedFilters: [allFilters[1].filterKey],
      },
      {
        ...mockState,
        electronicFilesApi: {
          ...mockState.electronicFilesApi,
          queries: {
            ...mockState.electronicFilesApi.queries,
            searchInboundElectronicFileList: {
              ...mockState.electronicFilesApi.queries
                .searchInboundElectronicFileList,
              status: 'pending',
            },
            searchOutboundElectronicFileList: {
              ...mockState.electronicFilesApi.queries
                .searchOutboundElectronicFileList,
              status: 'pending',
            },
            searchContactList: {
              ...mockState.electronicFilesApi.queries.searchContactList,
              status: 'pending',
            },
          },
        },
      }
    );

    expect(screen.getByLabelText(allFilters[1].label)).toBeInTheDocument();
    expect(screen.getByLabelText(allFilters[1].label)).toBeDisabled();
  });

  it('shows refresh action when showRefreshAction is true', () => {
    renderComponent({
      ...defaultProps,
      showRefreshAction: true,
    });

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.RefreshOutlined}Icon`)
    ).toBeInTheDocument();
  });
});
