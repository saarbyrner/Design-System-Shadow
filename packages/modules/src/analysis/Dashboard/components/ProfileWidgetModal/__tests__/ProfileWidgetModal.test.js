import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import ProfileWidgetModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<ProfileWidgetModal />', () => {
  const props = {
    athleteId: null,
    athletes: [],
    canManageDashboard: true,
    previewData: {},
    open: false,
    onClickCloseModal: jest.fn(),
    onClickSaveProfileWidget: jest.fn(),
    onSelectAthlete: jest.fn(),
    onSelectWidgetInfoItem: jest.fn(),
    onSetAvatarAvailability: jest.fn(),
    onSetAvatarSquadNumber: jest.fn(),
    onSetBackgroundColour: jest.fn(),
    selectedInfoFields: [
      { name: 'name' },
      { name: 'availability' },
      { name: 'date_of_birth' },
      { name: 'position' },
    ],
    showAvailabilityIndicator: false,
    showSquadNumber: false,
    t: (key) => key,
  };

  let trackEventMock;

  beforeEach(() => {
    window.setFlag('squad-numbers', true);
    trackEventMock = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: trackEventMock,
    });
  });

  afterEach(() => {
    window.setFlag('squad-numbers', false);
    jest.clearAllMocks();
  });

  it('contains a modal', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText('#sport_specific__Athlete_Profile')
    ).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    render(<ProfileWidgetModal {...props} open />);

    const closeButton = document.querySelector('.reactModal__closeBtn');
    await user.click(closeButton);

    expect(props.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('contains an athletes dropdown within the form with the correct label', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByText('#sport_specific__Athlete')).toBeInTheDocument();
  });

  it('contains an athletes dropdown within the form which is optional', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('calls the correct callback when an athlete is selected in the dropdown', async () => {
    const user = userEvent.setup();
    const athletes = [
      { id: 123, fullname: 'John Doe' },
      { id: 456, fullname: 'Jane Smith' },
    ];

    render(<ProfileWidgetModal {...props} athletes={athletes} open />);

    const option = screen.getByText('Jane Smith');
    await user.click(option);

    expect(props.onSelectAthlete).toHaveBeenCalledWith('456');
  });

  it('contains a pictureOverlays section with two checkboxes', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByText('Picture overlays')).toBeInTheDocument();
    expect(screen.getByText('Availability Indicator')).toBeInTheDocument();
    expect(
      screen.getByText('#sport_specific__Squad_Number')
    ).toBeInTheDocument();
  });

  it('calls the correct callback when the availability indicator checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<ProfileWidgetModal {...props} open />);

    const checkbox = screen.getByText('Availability Indicator');
    await user.click(checkbox);

    expect(props.onSetAvatarAvailability).toHaveBeenCalledWith(true);
  });

  it('calls the correct callback when the squad number checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<ProfileWidgetModal {...props} open />);

    const checkbopx = screen.getByText('#sport_specific__Squad_Number');
    await user.click(checkbopx);

    expect(props.onSetAvatarSquadNumber).toHaveBeenCalledWith(true);
  });

  it('calls trackEvent with correct Data', async () => {
    const user = userEvent.setup();
    render(<ProfileWidgetModal {...props} open />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(trackEventMock).toHaveBeenCalledWith('Add Profile Widget');
  });

  describe('if squad-numbers feature flag is false', () => {
    beforeEach(() => {
      window.setFlag('squad-numbers', false);
    });

    afterEach(() => {
      window.setFlag('squad-numbers', true);
    });

    it('does not show the squad numbers checkbox', () => {
      render(<ProfileWidgetModal {...props} open />);

      expect(
        screen.queryByText('#sport_specific__Squad_Number')
      ).not.toBeInTheDocument();
    });
  });

  it('contains a widgetInfo section with four dropdowns', () => {
    render(<ProfileWidgetModal {...props} open />);

    const widgetInfoItems = document.querySelectorAll(
      '.profileWidgetModal__widgetInfoItem'
    );
    expect(widgetInfoItems.length).toBe(4);
  });

  it('has the correct default values in the widgetInfo dropdowns', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(props.selectedInfoFields[0].name).toBe('name');
    expect(props.selectedInfoFields[1].name).toBe('availability');
    expect(props.selectedInfoFields[2].name).toBe('date_of_birth');
    expect(props.selectedInfoFields[3].name).toBe('position');
  });

  it('contains a footer with a save button', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls the correct callback when clicking save', async () => {
    const user = userEvent.setup();
    render(<ProfileWidgetModal {...props} open />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(props.onClickSaveProfileWidget).toHaveBeenCalledTimes(1);
  });

  it('contains a preview section with the correct label', () => {
    render(<ProfileWidgetModal {...props} open />);

    expect(screen.getByText('Preview:')).toBeInTheDocument();
  });

  describe('when rep-dashboard-ui-upgrade FF is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
    });

    it('should render upgraded classes', () => {
      render(<ProfileWidgetModal {...props} open />);

      // The upgraded version adds background color options
      expect(screen.getByText('Background Colour')).toBeInTheDocument();
    });

    it('should render background options', () => {
      render(<ProfileWidgetModal {...props} open />);

      expect(screen.getByText('Background Colour')).toBeInTheDocument();
      expect(
        document.querySelector(
          '.profileWidgetModal__backgroundColourOptions--container'
        )
      ).toBeInTheDocument();
    });

    it('should render modal with updated height', () => {
      render(<ProfileWidgetModal {...props} open />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveStyle('height: 740px');
    });
  });
});
