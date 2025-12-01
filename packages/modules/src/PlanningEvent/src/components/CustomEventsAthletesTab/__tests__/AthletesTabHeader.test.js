import { screen, within } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockedEventSquads } from '@kitman/modules/src/PlanningEvent/src/components/AddAthletesSidePanel/__tests__/utils';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import AthletesTabHeader from '../components/AthletesTabHeader';

jest.mock('@kitman/common/src/hooks/useLocationSearch');

describe('<AthletesTabHeader />', () => {
  const props = {
    athletes: [],
    event: { id: 4 },
    onUpdateEvent: jest.fn(),
    t: i18nextTranslateStub(),
    canEditEvent: true,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the title', () => {
    renderWithProviders(<AthletesTabHeader {...props} />);
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('renders the Add Athletes button when canEditEvent is true', () => {
    renderWithProviders(<AthletesTabHeader {...props} />);
    expect(
      screen.getByRole('button', { name: 'Add Athletes' })
    ).toBeInTheDocument();
  });

  it('does not render the Add Athletes button when canEditEvent is false', () => {
    renderWithProviders(<AthletesTabHeader {...props} canEditEvent={false} />);
    expect(
      screen.queryByRole('button', { name: 'Add Athletes' })
    ).not.toBeInTheDocument();
  });

  it('does not render the Add Athletes button when canEditEvent is true, but isVirtualEvent', () => {
    useLocationSearch.mockReturnValue(
      new URLSearchParams({
        original_start_time: '2024-05-29T10%3A25%3A00.000Z',
      })
    );
    renderWithProviders(<AthletesTabHeader {...props} />);
    expect(
      screen.queryByRole('button', { name: 'Add Athletes' })
    ).not.toBeInTheDocument();
  });

  it('clicking on add athletes button opens side panel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthletesTabHeader {...props} />);
    await user.click(screen.getByRole('button', { name: 'Add Athletes' }));

    const content = await screen.findByTestId('DropdownWrapper');
    expect(
      within(content).getByText(mockedEventSquads.squads[0].name)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('should call onUpdateEvent on click of done with athlete ids', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthletesTabHeader {...props} />);

    await user.click(screen.getByRole('button', { name: 'Add Athletes' }));
    await user.click(screen.getByRole('button', { name: 'Done' }));

    expect(props.onUpdateEvent).toHaveBeenCalledWith({
      athlete_ids: [1, 2, 3],
      id: 4,
    });
  });
});
