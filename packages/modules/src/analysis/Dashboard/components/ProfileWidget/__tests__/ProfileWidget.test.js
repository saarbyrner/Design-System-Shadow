import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import ProfileWidget from '../index';

const defaultFields = [
  'Name',
  'Availability Status',
  'Date of Birth (Age)',
  '#sport_specific__Position',
];

describe('<ProfileWidget />', () => {
  const defaultProps = {
    canManageDashboard: true,
    isPreview: false,
    selectedInfoFields: [
      { name: 'name' },
      { name: 'availability' },
      { name: 'date_of_birth' },
      { name: 'position' },
    ],
    showError: false,
    athleteId: 'test-athlete-id',
    availabilityStatus: 'available',
    fieldInformation: [],
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    onEdit: jest.fn(),
    showAvailabilityIndicator: false,
    showSquadNumber: false,
    backgroundColour: '#ffffff',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<ProfileWidget {...defaultProps} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    defaultFields.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('renders a menu button', async () => {
    renderWithStore(<ProfileWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass('profileWidget__widgetMenu');
  });

  it("does not render a meatball menu when the user doesn't have the manage dashboard permission", () => {
    renderWithStore(
      <ProfileWidget {...defaultProps} canManageDashboard={false} />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render a meatball menu when in preview mode', () => {
    renderWithStore(<ProfileWidget {...defaultProps} isPreview />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders an image with the correct imageUrl', () => {
    renderWithStore(
      <ProfileWidget {...defaultProps} imageUrl="/images/lovelyImage.jpg" />
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/images/lovelyImage.jpg');
  });

  it('calls onEdit with the correct params when clicking the Edit Widget item', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      athleteId: '700',
      onEdit: mockOnEdit,
      selectedInfoFields: [
        { name: 'name' },
        { name: 'name' },
        { name: 'date_of_birth' },
        { name: 'date_of_birth' },
      ],
      showAvailabilityIndicator: true,
      showSquadNumber: false,
      widgetId: 145,
    };

    renderWithStore(<ProfileWidget {...props} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Edit Widget'));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(
      145,
      '700',
      true,
      false,
      [
        { name: 'name' },
        { name: 'name' },
        { name: 'date_of_birth' },
        { name: 'date_of_birth' },
      ],
      '#ffffff'
    );
  });

  it('has the correct text displayed on the delete confirmation modal', async () => {
    const user = userEvent.setup();

    renderWithStore(<ProfileWidget {...defaultProps} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Delete'));

    expect(
      screen.getByText('#sport_specific__Delete_Athlete_Profile_widget?')
    ).toBeInTheDocument();
  });

  it('calls the correct function on delete confirm', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <ProfileWidget {...defaultProps} onDelete={mockOnDelete} />
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Delete'));

    // Get the primary delete button from the confirmation modal
    const confirmButtons = screen.getAllByText('Delete');
    const modalConfirmButton = confirmButtons.find((button) =>
      button.closest('button')?.className.includes('textButton--primary')
    );

    await user.click(modalConfirmButton.closest('button'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders info fields with the correct information', () => {
    const fieldInformation = [
      { name: 'name', value: 'Robin van Persie' },
      { name: 'dob', value: '6 Aug 1983' },
      { name: 'height', value: '183cm' },
      { name: 'position', value: 'Forward' },
    ];

    renderWithStore(
      <ProfileWidget {...defaultProps} fieldInformation={fieldInformation} />
    );

    Object.values(fieldInformation).forEach((field) => {
      expect(screen.getByText(field.value)).toBeInTheDocument();
    });
  });

  it('renders info fields with the correct information when fieldInformation is []', () => {
    renderWithStore(<ProfileWidget {...defaultProps} fieldInformation={[]} />);

    defaultFields.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('shows the availability indicator when props.showAvailabilityIndicator is true', () => {
    const { container } = renderWithStore(
      <ProfileWidget
        {...defaultProps}
        showAvailabilityIndicator
        availabilityStatus="unavailable"
      />
    );

    const availabilityIndicator = container.querySelector(
      '.profileWidget__availabilityIndicator'
    );
    expect(availabilityIndicator).toBeInTheDocument();
  });

  it('shows the availability indicator with the correct class when props.showAvailabilityIndicator is true and availabilityStatus is injured', () => {
    renderWithStore(
      <ProfileWidget
        {...defaultProps}
        showAvailabilityIndicator
        availabilityStatus="injured"
      />
    );

    const availabilityIndicator = document.querySelector(
      '.profileWidget__availabilityIndicator--injured'
    );
    expect(availabilityIndicator).toBeInTheDocument();
  });

  it('renders an error overlay with the correct message and background image when showError is true', () => {
    renderWithStore(<ProfileWidget {...defaultProps} showError />);

    expect(
      screen.getByText(
        '#sport_specific__Select_a_single_athlete_to_view_this_widget'
      )
    ).toBeInTheDocument();
  });

  describe('when rep-dashboard-ui-upgrade FF is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    it('should render availability indicator with V2 class suffix', () => {
      const updatedProps = {
        ...defaultProps,
        showAvailabilityIndicator: true,
        availabilityStatus: 'unavailable',
      };

      const { container } = renderWithStore(
        <ProfileWidget {...updatedProps} />
      );

      expect(
        container.querySelector('.profileWidget__availabilityIndicatorV2')
      ).toBeInTheDocument();
    });
  });
});
