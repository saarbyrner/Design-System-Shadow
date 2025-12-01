import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useGetSquadsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import Filters from '@kitman/modules/src/ConditionalFields/OrganisationApp/src/components/ClubConsentTab/Filters';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const mockOnSearch = jest.fn();
const mockOnUpdateFilter = jest.fn();

const props = {
  onSearch: mockOnSearch,
  onUpdateFilter: mockOnUpdateFilter,
  t: i18nextTranslateStub(),
};

const renderComponent = () =>
  render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Filters {...props} />
    </LocalizationProvider>
  );

describe('<Filters />', () => {
  beforeEach(() => {
    useGetSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Squad 1' },
        { id: 2, name: 'Squad 2' },
      ],
    });
  });
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
    expect(screen.getByLabelText('Consent')).toBeInTheDocument();
  });
  it('calls onSearch when the search input is changed', () => {
    renderComponent();
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });
  it('calls onUpdateFilter when the squad is changed', async () => {
    const user = userEvent.setup();
    renderComponent();
    const squadInput = screen.getByLabelText('Squads');
    await user.click(squadInput);
    await user.click(screen.getByText('Squad 2'));

    expect(mockOnUpdateFilter).toHaveBeenCalledWith({
      squad_ids: [2],
      page: 1,
    });
  });
  it('calls onUpdateFilter when the consent is changed', async () => {
    const user = userEvent.setup();
    renderComponent();
    const consentInput = screen.getByLabelText('Consent');
    await user.click(consentInput);
    await user.click(screen.getByText('Consented'));

    expect(mockOnUpdateFilter).toHaveBeenCalledTimes(1);
  });
});
