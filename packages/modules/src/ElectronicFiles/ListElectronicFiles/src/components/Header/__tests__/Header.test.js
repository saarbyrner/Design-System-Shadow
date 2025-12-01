import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Header from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/Header';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { useSearchInboundElectronicFileListQuery } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const props = {
  t: i18nextTranslateStub(),
};

const initialState = mockState;

const renderComponent = (state = initialState) =>
  render(
    <Provider store={storeFake(state)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Header {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('<Header />', () => {
  beforeEach(() => {
    useSearchInboundElectronicFileListQuery.mockReturnValue({
      data: inboundData,
      error: false,
      isLoading: false,
    });
  });
  it('renders title and button correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 5, name: /inbox/i })
    ).toBeInTheDocument();
  });
});
