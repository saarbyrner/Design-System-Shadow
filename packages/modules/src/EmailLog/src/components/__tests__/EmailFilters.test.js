import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import EmailFilters from '../EmailFilters';
import { defaultFilters } from '../../../shared/constants';

describe('EmailFilters', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    filters: {
      ...defaultFilters,
      type: 'dmr',
      dateRange: ['2024-01-01', '2024-01-02'],
      distributionType: 'automatic',
      messageStatus: 'errored',
    },
    search: {
      subject: 'test message',
      recipient: 'test@test.com',
    },
    handleFiltersChange: jest.fn(),
    handleSearchChange: jest.fn(),
  };

  const renderComponent = () => {
    return render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <EmailFilters {...props} />
      </LocalizationProvider>
    );
  };

  it('renders the filters correctly', () => {
    renderComponent();
    expect(screen.getByLabelText('Type')).toHaveValue('DMR');
    expect(screen.getByLabelText('Search email subject')).toHaveValue(
      'test message'
    );
    expect(screen.getByLabelText('Sent date range')).toHaveValue(
      '01/01/2024 – 01/02/2024'
    );
    expect(screen.getByLabelText('Search by recipient')).toHaveValue(
      'test@test.com'
    );
    expect(screen.getByLabelText('Status')).toHaveValue('Failure');
    expect(screen.getByLabelText('Distribution type')).toHaveValue('Automatic');
  });
});
