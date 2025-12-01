import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import HeaderWidgetModal from '..';
import { organisationBackgroundColor } from '../../utils';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<HeaderWidgetModal />', () => {
  const props = {
    backgroundColor: '#ffffff',
    userName: 'Test User',
    name: 'Testing Dashboard',
    open: false,
    onClickCloseModal: jest.fn(),
    onClickSaveHeaderWidget: jest.fn(),
    onSetHeaderWidgetBackgroundColor: jest.fn(),
    onSetHeaderWidgetName: jest.fn(),
    onSetHeaderWidgetPopulation: jest.fn(),
    onSetShowOrganisationLogo: jest.fn(),
    onSetShowOrganisationName: jest.fn(),
    onSetHideOrganisationDetails: jest.fn(),
    orgLogo: '/test/lovely/logo.png',
    orgName: 'Test Organisation',
    selectedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    showOrgLogo: true,
    showOrgName: true,
    hideOrgDetails: false,
    squadAthletes: {
      position_groups: [],
    },
    squadName: 'Squad 1',
    squads: [
      {
        id: '1',
        name: 'Squad 1',
      },
    ],
    t: i18nextTranslateStub(),
    widgetId: null,
    canManageDashboard: true,
  };

  let trackEventMock;

  beforeEach(() => {
    trackEventMock = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: trackEventMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('contains a closed modal', () => {
    renderWithStore(<HeaderWidgetModal {...props} open={false} />);

    expect(screen.queryByText('Header')).not.toBeInTheDocument();
  });

  it('contains an open modal', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<HeaderWidgetModal {...props} open />);

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(props.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('contains the correct label for the name input', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    expect(screen.getByDisplayValue('Testing Dashboard')).toBeInTheDocument();
  });

  it('contains the correct label for the population selector', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    expect(screen.getByText('Population')).toBeInTheDocument();
  });

  it('contains an athlete selector dropdown', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    const athleteSelector = screen.getByTestId('DropdownWrapper');
    expect(athleteSelector).toBeInTheDocument();
  });

  it('contains the correct label for the ColorPicker', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    expect(screen.getByText('Background Colour')).toBeInTheDocument();
  });

  it('calls trackEvent with correct data when save button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<HeaderWidgetModal {...props} open />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(trackEventMock).toHaveBeenCalledWith('Add Header Widget');
  });

  describe('The Organisation Logo Checkbox', () => {
    it('has the correct label', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      expect(screen.getByText('Logo')).toBeInTheDocument();
    });

    it('is checked if showOrgLogo is true', () => {
      renderWithStore(<HeaderWidgetModal {...props} open showOrgLogo />);

      const logoCheckbox = screen.getByRole('checkbox', { name: 'Logo' });
      expect(logoCheckbox).toBeChecked();
    });

    it('is not checked if showOrgLogo is false', () => {
      renderWithStore(
        <HeaderWidgetModal {...props} open showOrgLogo={false} />
      );

      const logoCheckbox = screen.getByRole('checkbox', { name: 'Logo' });
      expect(logoCheckbox).not.toBeChecked();
    });

    it('calls the correct callback when it is clicked', async () => {
      const user = userEvent.setup();
      renderWithStore(<HeaderWidgetModal {...props} open />);

      const logoCheckbox = screen.getByRole('checkbox', { name: 'Logo' });
      await user.click(logoCheckbox);

      expect(props.onSetShowOrganisationLogo).toHaveBeenCalledWith(false);
    });
  });

  describe('The Organisation Name Checkbox', () => {
    it('has the correct label', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      const nameCheckbox = screen.getByRole('checkbox', { name: 'Name' });
      expect(nameCheckbox).toBeInTheDocument();
    });

    it('is checked if showOrgName is true', () => {
      renderWithStore(<HeaderWidgetModal {...props} open showOrgName />);

      const nameCheckbox = screen.getByRole('checkbox', { name: 'Name' });
      expect(nameCheckbox).toBeChecked();
    });

    it('is not checked if showOrgName is false', () => {
      renderWithStore(
        <HeaderWidgetModal {...props} open showOrgName={false} />
      );

      const nameCheckbox = screen.getByRole('checkbox', { name: 'Name' });
      expect(nameCheckbox).not.toBeChecked();
    });

    it('calls the correct callback when it is clicked', async () => {
      const user = userEvent.setup();
      renderWithStore(<HeaderWidgetModal {...props} open />);

      const nameCheckbox = screen.getByRole('checkbox', { name: 'Name' });
      await user.click(nameCheckbox);

      expect(props.onSetShowOrganisationName).toHaveBeenCalledWith(false);
    });
  });

  describe('the preview', () => {
    it('has the correct label', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('contains a HeaderWidget component inside', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('has the correct org logo', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('has the correct header name', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('calls the correct props when the value of the header name input changes', async () => {
      const user = userEvent.setup();
      renderWithStore(<HeaderWidgetModal {...props} open />);

      const nameInput = screen.getByDisplayValue('Testing Dashboard');

      await user.click(nameInput);
      await fireEvent.change(nameInput, { target: { value: 'Test' } });

      // Check that the callback was called (it gets called for every character)
      expect(props.onSetHeaderWidgetName).toHaveBeenCalled();
    });
  });

  it('has a save button in the footer', () => {
    renderWithStore(<HeaderWidgetModal {...props} open />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
  });

  it('calls the correct props when the save button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<HeaderWidgetModal {...props} open />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(props.onClickSaveHeaderWidget).toHaveBeenCalledTimes(1);
  });

  describe('when rep-dashboard-ui-upgrade FF is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
    });

    it('contains background colour options', () => {
      renderWithStore(<HeaderWidgetModal {...props} open />);

      const backgroundColourDropdown = screen.getByRole('button', {
        name: 'Custom',
      });
      expect(backgroundColourDropdown).toBeInTheDocument();
    });

    it('has initial value as transparent', () => {
      const updatedProps = {
        ...props,
        backgroundColor: 'transparent',
      };
      renderWithStore(<HeaderWidgetModal {...updatedProps} open />);

      const backgroundColourDropdown = screen.getByRole('button', {
        name: 'Transparent',
      });
      expect(backgroundColourDropdown).toBeInTheDocument();
    });

    it('has initial value as custom', () => {
      const updatedProps = {
        ...props,
        backgroundColor: '#ffffff',
      };
      renderWithStore(<HeaderWidgetModal {...updatedProps} open />);

      const backgroundColourDropdown = screen.getByRole('button', {
        name: 'Custom',
      });
      expect(backgroundColourDropdown).toBeInTheDocument();
    });

    it('has initial value as organisation_branding', () => {
      const updatedProps = {
        ...props,
        backgroundColor: organisationBackgroundColor,
      };
      renderWithStore(<HeaderWidgetModal {...updatedProps} open />);

      const backgroundColourDropdown = screen.getByRole('button', {
        name: 'Organisation Branding',
      });
      expect(backgroundColourDropdown).toBeInTheDocument();
    });
  });
});
