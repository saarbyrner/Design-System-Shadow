import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CoachingPrinciplesCell from '../index';

describe('<CoachingPrinciplesCell />', () => {
  const props = {
    principles: [],
    activityId: 1,
    isDisabled: false,
    isDraggingPrinciple: false,
    showPrinciplesPanel: jest.fn(),
    onDeletePrinciple: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no principles', () => {
    render(<CoachingPrinciplesCell {...props} />);

    // Should render the add principle button
    expect(screen.getByTestId('add-principle-button')).toBeInTheDocument();

    // Should not render any TextTags (principles)
    expect(screen.queryByTestId('TextTag')).not.toBeInTheDocument();

    // Should render the principle cell container
    expect(
      document.querySelector('.sessionPlanningGrid__cell--principle')
    ).toBeInTheDocument();
  });

  it('renders correctly with principles', () => {
    const mockedPrinciples = [
      {
        id: 1,
        name: 'principle_one',
        principle_categories: [{ name: 'principle_categories_one' }],
        principle_types: [{ name: 'principle_type_one' }],
        phases: [{ name: 'phase_one' }],
        squads: [],
        isNewPrinciple: false,
      },
      {
        id: 2,
        name: 'principle_two',
        principle_categories: [{ name: 'principle_categories_two' }],
        principle_types: [{ name: 'principle_type_two' }],
        phases: [{ name: 'phase_two' }],
        squads: [],
        isNewPrinciple: false,
      },
    ];

    render(<CoachingPrinciplesCell {...props} principles={mockedPrinciples} />);

    // Should render principle names with categories, phases, and types
    expect(
      screen.getByText(
        'principle_one (principle_categories_one, phase_one, principle_type_one)'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'principle_two (principle_categories_two, phase_two, principle_type_two)'
      )
    ).toBeInTheDocument();

    const addButton = screen.getByTestId('add-principle-button');
    expect(addButton).toBeInTheDocument();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('disables the add principles button when isDisabled is true', () => {
    render(<CoachingPrinciplesCell {...props} isDisabled />);

    const addPrinciplesButton = screen.getByTestId('add-principle-button');
    expect(addPrinciplesButton).toBeDisabled();
  });

  it('enables the add principles button when isDisabled is false', () => {
    render(<CoachingPrinciplesCell {...props} isDisabled={false} />);

    const addPrinciplesButton = screen.getByTestId('add-principle-button');
    expect(addPrinciplesButton).toBeEnabled();
  });

  it('calls the correct callback when clicking the add principles button', async () => {
    const user = userEvent.setup();
    render(<CoachingPrinciplesCell {...props} />);

    const addPrinciplesButton = screen.getByTestId('add-principle-button');
    await user.click(addPrinciplesButton);

    expect(props.showPrinciplesPanel).toHaveBeenCalledWith(props.activityId);
    expect(props.showPrinciplesPanel).toHaveBeenCalledTimes(1);
  });

  it('calls the correct callback when deleting a principle', async () => {
    const user = userEvent.setup();
    const mockedPrinciples = [
      {
        id: 1,
        name: 'principle_one',
        principle_categories: [{ name: 'principle_categories_one' }],
        principle_types: [{ name: 'principle_type_one' }],
        phases: [{ name: 'phase_one' }],
        squads: [],
        isNewPrinciple: false,
      },
    ];

    render(<CoachingPrinciplesCell {...props} principles={mockedPrinciples} />);

    const deleteButton = document.querySelector('button .icon-close');

    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(props.onDeletePrinciple).toHaveBeenCalledWith(props.activityId, 1);
    expect(props.onDeletePrinciple).toHaveBeenCalledTimes(1);
  });

  it('renders the mobile heading text', () => {
    render(<CoachingPrinciplesCell {...props} />);

    expect(screen.getByText('Principle')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(<CoachingPrinciplesCell {...props} />);

    // Should have the correct cell classes
    const principleCell = document.querySelector(
      '.sessionPlanningGrid__cell--principle'
    );
    expect(principleCell).toBeInTheDocument();
    expect(principleCell).toHaveClass('sessionPlanningGrid__cell');
  });

  it('renders principles in a list structure', () => {
    const mockedPrinciples = [
      {
        id: 1,
        name: 'principle_one',
        principle_categories: [{ name: 'category_one' }],
        principle_types: [{ name: 'type_one' }],
        phases: [{ name: 'phase_one' }],
        squads: [],
        isNewPrinciple: false,
      },
      {
        id: 2,
        name: 'principle_two',
        principle_categories: [{ name: 'category_two' }],
        principle_types: [{ name: 'type_two' }],
        phases: [{ name: 'phase_two' }],
        squads: [],
        isNewPrinciple: false,
      },
    ];

    render(<CoachingPrinciplesCell {...props} principles={mockedPrinciples} />);

    // Should render a list
    expect(screen.getByRole('list')).toBeInTheDocument();

    // Should render list items for each principle
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
});
