import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CollectionsTabGrid from '../CollectionsTabGrid';

jest.mock('@kitman/common/src/utils/planningEvent', () => ({
  validateRpe: () => true,
}));

const defaultProps = {
  collectionsGrid: {
    columns: [
      { row_key: 'athlete', name: 'Athlete', readonly: true, id: 1 },
      { row_key: 'rpe', name: 'Rpe', readonly: false, id: 2 },
      { row_key: 'minutes', name: 'Minutes', readonly: false, id: 3 },
      { row_key: 'load', name: 'Load', readonly: true, id: 4 },
      { row_key: '%_difference', name: '% Difference', readonly: true, id: 5 },
    ],
    rows: [
      {
        id: 1,
        athlete: { avatar_url: 'john_do_avatar.jpg', fullname: 'John Doh' },
        rpe: 1,
        minutes: 90,
        load: 90,
        '%_difference': { value: 1, comment: null },
      },
      {
        id: 2,
        athlete: {
          avatar_url: 'john_do_avatar.jpg',
          fullname: 'John Doe but with a more doe-ier name',
        },
        participation_level: 'full',
        include_in_group_calculations: false,
        '%_difference': { value: 1, comment: null },
      },
    ],
  },
  editMode: false,
  isLoading: false,
  onAttributesUpdate: jest.fn(),
  onAttributesBulkUpdate: jest.fn(),
  onClickDeleteColumn: jest.fn(),
  onValidateCell: jest.fn(),
  rowErrors: [],
  organisationTrainingVariables: [
    {
      id: 22741,
      training_variable: {
        id: 2,
        variable_type_id: 6,
        min: 1,
        max: 4,
        invert_scale: false,
      },
    },
  ],
  selectedCollection: { name: 'Workload', type: 'DEFAULT' },
  t: i18nextTranslateStub(),
};

describe('<CollectionsTabGrid />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<CollectionsTabGrid {...defaultProps} />);

    expect(screen.getByText('Athlete')).toBeInTheDocument();
    expect(screen.getByText('Rpe')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /J/i })[1]).toHaveAttribute(
      'src',
      'john_do_avatar.jpg'
    );
    expect(
      screen.getByRole('row', { name: 'J John Doh 1 90 90 1' })
    ).toBeInTheDocument();
  });

  it('renders inputs when edit mode is true and handles updates', async () => {
    render(<CollectionsTabGrid {...defaultProps} editMode />);

    const rpeInput = screen.getAllByRole('spinbutton')[0];
    const minutesInput = screen.getAllByRole('spinbutton')[1];

    expect(rpeInput).toHaveValue(1);
    expect(minutesInput).toHaveValue(90);

    await fireEvent.change(minutesInput, { target: { value: '120' } });

    expect(defaultProps.onAttributesUpdate).toHaveBeenNthCalledWith(
      1,
      {
        minutes: 120,
      },
      undefined
    );
  });

  it('renders a readonly cell for participation level', () => {
    const newCollectionsGrid = {
      ...defaultProps.collectionsGrid,
      columns: [
        { row_key: 'athlete', name: 'Athlete', readonly: true },
        {
          row_key: 'participation_level',
          name: 'Participation Level',
          readonly: true,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: { avatar_url: 'john_do_avatar.jpg', fullname: 'John Doh' },
          participation_level: { name: 'No Participation' },
        },
      ],
    };
    render(
      <CollectionsTabGrid
        {...defaultProps}
        collectionsGrid={newCollectionsGrid}
        editMode
      />
    );

    // We expect to find the text of the participation level
    expect(screen.getByText('No Participation')).toBeInTheDocument();
  });

  it('allows bulk updates for editable columns', async () => {
    const user = userEvent.setup();
    render(
      <CollectionsTabGrid {...defaultProps} editMode isBulkTooltipValid />
    );

    const bulkRpeButton = screen.getByRole('button', { name: /Rpe/i });

    await user.click(bulkRpeButton);

    await fireEvent.change(screen.getAllByRole('spinbutton')[4], {
      target: { value: '123' },
    });
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    await user.click(applyButton);

    expect(defaultProps.onAttributesBulkUpdate).toHaveBeenCalledWith({
      rpe: 123.0,
    });
  });

  it('renders dropdown when edit mode is true and assessment item is present', async () => {
    const user = userEvent.setup();
    const newCollectionsGrid = {
      ...defaultProps.collectionsGrid,
      columns: [
        { row_key: 'athlete', name: 'Athlete', readonly: true },
        {
          row_key: 'training_variable_yeah',
          name: 'Training Variable Yeah',
          assessment_item_id: 1,
          training_variable_id: 2,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: { fullname: 'John Doh' },
          training_variable_yeah: { value: 2, comment: null },
        },
      ],
    };
    render(
      <CollectionsTabGrid
        {...defaultProps}
        collectionsGrid={newCollectionsGrid}
        editMode
      />
    );

    // Find the dropdown by its value
    const editInput = screen.getByRole('textbox');

    // Simulate selecting a different option
    await user.click(editInput);
    const option = screen.getByText('1');
    await user.click(option);

    // Assert that the update function was called with the correct values
    expect(defaultProps.onAttributesUpdate).toHaveBeenCalledWith(
      {
        training_variable_yeah: { value: 1, comment: null },
        value: 1,
        assessment_item_id: 1,
        columnId: undefined,
      },
      undefined
    );
  });

  it('allows a row with a null value to be saved', async () => {
    const user = userEvent.setup();

    const newCollectionsGrid = {
      ...defaultProps.collectionsGrid,
      columns: [
        { row_key: 'athlete', name: 'Athlete' },
        { row_key: 'accomodation', name: 'Accomodation' },
      ],
      rows: [
        {
          id: 1,
          athlete: { fullname: 'John Doh' },
          accomodation: null,
        },
      ],
    };

    render(
      <CollectionsTabGrid
        {...defaultProps}
        collectionsGrid={newCollectionsGrid}
        editMode
      />
    );

    const accommodationDropdown = screen.getByRole('button', {
      name: /Accomodation/i,
    });

    await user.click(accommodationDropdown);

    const input = screen.getAllByRole('spinbutton');
    await fireEvent.change(input[1], { target: { value: '1' } });
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    await user.click(applyButton);

    expect(defaultProps.onAttributesBulkUpdate).toHaveBeenCalledWith({
      accomodation: 1,
    });
  });
});
