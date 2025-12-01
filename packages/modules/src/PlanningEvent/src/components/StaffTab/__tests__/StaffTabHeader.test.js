import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as staffMockedData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import StaffTabHeader from '../components/StaffTabHeader';

jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<StaffTabHeader />', () => {
  const props = {
    event: { id: 4 },
    onUpdateEvent: jest.fn(),
    t: i18nextTranslateStub(),
    canEditEvent: true,
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the title', () => {
    render(<StaffTabHeader {...props} />);
    expect(screen.getByText('Staff')).toBeInTheDocument();
  });

  it('renders the Add Staff button when canEditEvent is true', () => {
    render(<StaffTabHeader {...props} />);
    expect(
      screen.getByRole('button', { name: 'Add staff' })
    ).toBeInTheDocument();
  });

  it('clicking on add staff button opens side panel', async () => {
    render(<StaffTabHeader {...props} />);
    userEvent.click(screen.getByRole('button', { name: 'Add staff' }));

    expect(
      await screen.findByText(staffMockedData[0].fullname)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('does not render the Add Staff button when canEditEvent is false', () => {
    render(<StaffTabHeader {...props} canEditEvent={false} />);
    expect(
      screen.queryByRole('button', { name: 'Add staff' })
    ).not.toBeInTheDocument();
  });

  it('does not render the Add Staff button when canEditEvent is true, but isVirtualEvent', () => {
    useLocationSearch.mockReturnValue(
      new URLSearchParams({
        original_start_time: '2024-05-29T10%3A25%3A00.000Z',
      })
    );
    render(<StaffTabHeader {...props} />);
    expect(
      screen.queryByRole('button', { name: 'Add staff' })
    ).not.toBeInTheDocument();
  });
});
