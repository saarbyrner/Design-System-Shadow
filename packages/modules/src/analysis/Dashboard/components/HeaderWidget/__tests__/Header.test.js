import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import HeaderWidget from '../index';

jest.mock('@kitman/common/src/utils', () => ({
  ...jest.requireActual('@kitman/common/src/utils'),
  TrackEvent: jest.fn(),
}));

describe('<HeaderWidget />', () => {
  const emptySquadAthletesSelection = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
  };

  const props = {
    canManageDashboard: true,
    selectedPopulation: _cloneDeep(emptySquadAthletesSelection),
    showOrgLogo: true,
    showOrgName: true,
    hideOrgDetails: false,
    squadAthletes: {
      position_groups: [],
    },
    onEdit: jest.fn(),
    onDuplicate: jest.fn(),
    onDelete: jest.fn(),
    userName: 'Test User',
    orgName: 'Test Org',
    squadName: 'Test Squad',
    squads: [],
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with the correct default backgroundColor', () => {
    const { container } = renderWithStore(<HeaderWidget {...props} />);

    const headerElement = container.querySelector('.headerWidget');
    expect(headerElement).toHaveStyle(`background: ${colors.white}`);
  });

  it('renders correctly with the correct backgroundColor if one is passed in as a prop', () => {
    const { container } = renderWithStore(
      <HeaderWidget {...props} backgroundColor={colors.orange_100} />
    );

    const headerElement = container.querySelector('.headerWidget');
    expect(headerElement).toHaveStyle(`background: ${colors.orange_100}`);
  });

  it('renders correctly with the orgLogo', () => {
    const { container } = renderWithStore(
      <HeaderWidget {...props} orgLogo="/test/logo/url.png" />
    );

    const logoElement = container.querySelector('.headerWidget__logo');
    expect(logoElement).toHaveAttribute('src', '/test/logo/url.png');
  });

  it('does not render the orgLogo when showOrgLogo is false', () => {
    const { container } = renderWithStore(
      <HeaderWidget
        {...props}
        orgLogo="/test/logo/url.png"
        showOrgLogo={false}
      />
    );

    const logoElement = container.querySelector('.headerWidget__logo');
    expect(logoElement).not.toBeInTheDocument();
  });

  it('applies the correct class when the background color is dark', () => {
    const { container } = renderWithStore(
      <HeaderWidget {...props} backgroundColor={colors.black_100} />
    );

    const headerElement = container.querySelector('.headerWidget--whiteFont');
    expect(headerElement).toBeInTheDocument();
  });

  it('applies the correct class when the background color is light', () => {
    const { container } = renderWithStore(
      <HeaderWidget {...props} backgroundColor={colors.white} />
    );

    const headerElement = container.querySelector('.headerWidget--blackFont');
    expect(headerElement).toBeInTheDocument();
  });

  it('renders the correct dashboard name', () => {
    renderWithStore(<HeaderWidget {...props} name="Test Dashboard Name" />);

    const nameElement = screen.getByText('Test Dashboard Name');
    expect(nameElement).toBeInTheDocument();
  });

  it('renders the org and squad name', () => {
    renderWithStore(
      <HeaderWidget {...props} orgName="Test Org" squadName="Test Squad" />
    );

    const orgSquadElement = screen.getByText('Test Org - Test Squad');
    expect(orgSquadElement).toBeInTheDocument();
  });

  it('hide org and squad name', () => {
    const updatedProps = {
      ...props,
      hideOrgDetails: true,
    };
    const { container } = renderWithStore(
      <HeaderWidget
        {...updatedProps}
        orgName="Test Org"
        squadName="Test Squad"
      />
    );

    const orgSquadElement = container.querySelector('.headerWidget__orgSquad');
    expect(orgSquadElement).not.toBeInTheDocument();
  });

  it('only renders the squad name when showOrgName is false', () => {
    renderWithStore(
      <HeaderWidget
        {...props}
        orgName="Test Org"
        showOrgName={false}
        squadName="Test Squad"
      />
    );

    const squadElement = screen.getByText('Test Squad');
    expect(squadElement).toBeInTheDocument();
  });

  it('renders the current user name', () => {
    renderWithStore(<HeaderWidget {...props} userName="Test A. User" />);

    const userElement = screen.getByText('Report by: Test A. User');
    expect(userElement).toBeInTheDocument();
  });

  it('renders a meatball menu with the correct items', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(
      <HeaderWidget {...props} canManageDashboard />
    );

    const menuButton = container.querySelector('.headerWidget__widgetMenu');
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByText('Edit Widget')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it("does not render a meatball menu when the user doesn't have the manage dashboard permission", () => {
    const { container } = renderWithStore(
      <HeaderWidget {...props} canManageDashboard={false} />
    );

    const menuButton = container.querySelector('.headerWidget__widgetMenu');
    expect(menuButton).not.toBeInTheDocument();
  });

  it('calls onEdit with the correct params when clicking the Edit Widget item', async () => {
    const user = userEvent.setup();
    const mockEdit = jest.fn();
    const { container } = renderWithStore(
      <HeaderWidget
        {...props}
        name="test"
        widgetId={144}
        backgroundColor={colors.orange_100}
        onEdit={mockEdit}
      />
    );

    const menuButton = container.querySelector('.headerWidget__widgetMenu');
    await user.click(menuButton);

    const editButton = screen.getByText('Edit Widget');
    await user.click(editButton);

    expect(mockEdit).toHaveBeenCalledWith(
      144,
      'test',
      props.selectedPopulation,
      colors.orange_100,
      true,
      true,
      false
    );
  });

  it('has the correct text displayed on the delete confirmation modal', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<HeaderWidget {...props} />);

    const menuButton = container.querySelector('.headerWidget__widgetMenu');
    await user.click(menuButton);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(screen.getByText('Delete Header widget?')).toBeInTheDocument();
  });

  it('calls the correct function on delete confirm', async () => {
    const user = userEvent.setup();
    const mockDelete = jest.fn();
    const { container } = renderWithStore(
      <HeaderWidget {...props} onDelete={mockDelete} />
    );

    const menuButton = container.querySelector('.headerWidget__widgetMenu');
    await user.click(menuButton);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', {
      name: 'Delete',
    });
    await user.click(confirmButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  describe('when pivoting and the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows the correct date range', () => {
      renderWithStore(
        <HeaderWidget
          {...props}
          selectedDateRange={{
            start_date: '2019-08-26T00:00:00Z',
            end_date: '2019-09-02T23:59:59+01:00',
          }}
          selectedTimePeriod="custom_date_range"
        />
      );

      expect(screen.getByText('26 Aug 2019 - 2 Sep 2019')).toBeInTheDocument();
    });
  });

  describe('when pivoting', () => {
    it('shows the correct time period', () => {
      renderWithStore(
        <HeaderWidget {...props} selectedTimePeriod="yesterday" />
      );

      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('shows the correct population when pivoted', () => {
      renderWithStore(
        <HeaderWidget
          {...props}
          selectedPopulation={{
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: true,
            squads: [],
          }}
        />
      );

      expect(
        screen.getByText('#sport_specific__All_Squads')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('renders todays date in ll format using the dateFormatter utility', () => {
      renderWithStore(<HeaderWidget {...props} />);

      expect(
        screen.getByText(`Report Date: ${moment(Date.now()).format('ll')}`)
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders todays date', () => {
      renderWithStore(<HeaderWidget {...props} />);

      expect(
        screen.getByText(
          `Report Date: ${moment(Date.now()).format('D MMM YYYY')}`
        )
      ).toBeInTheDocument();
    });
  });

  describe('when rep-dashboard-ui-upgrade FF is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
    });

    it('renders icon icon-hamburger-circled-dots', () => {
      const { container } = renderWithStore(<HeaderWidget {...props} />);

      const iconElement = container.querySelector(
        '.icon-hamburger-circled-dots'
      );
      expect(iconElement).toBeInTheDocument();
    });

    it('show black font colour if background is transparent', () => {
      const { container } = renderWithStore(
        <HeaderWidget {...props} backgroundColor={colors.transparent} />
      );

      const iconElement = container.querySelector(
        '.icon-hamburger-circled-dots.headerWidget--blackFont'
      );
      expect(iconElement).toBeInTheDocument();
    });
  });
});
