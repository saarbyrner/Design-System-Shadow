import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CollectionsTabGrid from '../CollectionsTabGrid';

describe('<CollectionsTabGrid />', () => {
  const props = {
    collectionsGrid: {
      columns: [
        {
          row_key: 'athlete',
          name: 'Athlete',
          readonly: true,
          id: 1,
          default: true,
        },
        { row_key: 'rpe', name: 'Rpe', readonly: false, id: 2, default: true },
        {
          row_key: 'minutes',
          name: 'Minutes',
          readonly: false,
          id: 3,
          default: true,
        },
        { row_key: 'load', name: 'Load', readonly: true, id: 4, default: true },
        {
          row_key: '%_difference',
          name: '% Difference',
          readonly: true,
          id: 5,
          default: true,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: {
            avatar_url: 'john_do_avatar.jpg',
            fullname: 'John Doh',
          },
          rpe: 1,
          minutes: 90,
          load: 90,
          '%_difference': { value: 1, comment: null },
        },
        {
          id: 2,
          athlete: {
            availability: 'available',
            avatar_url: 'james_bond_avatar.jpg',
            fullname: 'James Bond',
          },
          participation_level: 'full',
          include_in_group_calculations: false,
          '%_difference': { value: 1, comment: null },
          squads: [
            { name: 'Primary', primary: true },
            { name: 'Not Primary', primary: false },
          ],
        },
      ],
      next_id: null,
    },
    editMode: false,
    isLoading: false,
    onAttributesUpdate: jest.fn(),
    onAttributesBulkUpdate: jest.fn(),
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
        default_value: null,
        scale_increment: '0.5',
        is_protected: false,
      },
    ],
    selectedCollection: { name: 'Workload', type: 'DEFAULT' },
    t: (key) => key,
  };

  it('renders the correct content', () => {
    render(<CollectionsTabGrid {...props} />);

    expect(screen.getByText('Athlete')).toBeInTheDocument();
    expect(screen.getByText('Rpe')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();

    expect(
      screen.getByRole('row', { name: 'Athlete Rpe Minutes Load % Difference' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'J John Doh 1 90 90 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'J James Bond 1' })
    ).toBeInTheDocument();
  });

  it('renders inputs when edit mode is true', () => {
    render(<CollectionsTabGrid {...props} editMode />);

    // ----- Buttons -----
    expect(screen.getByRole('button', { name: 'Rpe' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minutes' })).toBeInTheDocument();
    // ----- Inputs -----
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(4);
    expect(inputs[0]).toHaveValue(1);
    expect(inputs[1]).toHaveValue(90);
  });

  it('renders a readonly cell for participation level', () => {
    const newCollectionsGrid = {
      ...props.collectionsGrid,
      columns: [
        {
          row_key: 'athlete',
          name: 'Athlete',
          readonly: true,
          id: 1,
          default: true,
        },
        {
          row_key: 'participation_level',
          name: 'Participation Level',
          readonly: true,
          protected: false,
          id: 2,
          default: false,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: {
            avatar_url: 'john_do_avatar.jpg',
            fullname: 'John Doh',
          },
          participation_level: {
            canonical_participation_level: 'none',
            default: true,
            id: 3864,
            include_in_group_calculations: false,
            name: 'No Participation',
          },
        },
      ],
      next_id: null,
    };
    render(
      <CollectionsTabGrid
        {...props}
        collectionsGrid={newCollectionsGrid}
        editMode
      />
    );
    expect(screen.getByText('No Participation')).toBeInTheDocument();
  });

  it('calls onAttributesUpdate when a cell value is changed', async () => {
    render(<CollectionsTabGrid {...props} editMode />);

    const rpeInput = screen.getAllByRole('spinbutton')[0];
    expect(rpeInput).toHaveValue(1);

    // change value
    fireEvent.change(rpeInput, {
      target: { value: '2' },
    });
    await waitFor(() => {
      expect(props.onAttributesUpdate).toHaveBeenCalledTimes(1);
    });

    expect(props.onAttributesUpdate).toHaveBeenNthCalledWith(
      1,
      { rpe: 2 },
      undefined
    );
  });

  it('calls onAttributesBulkUpdate when bulk edit is applied', async () => {
    const user = userEvent.setup();
    render(<CollectionsTabGrid {...props} editMode />);

    const bulkRpeButton = screen.getByRole('button', { name: 'Rpe' });
    await user.click(bulkRpeButton);
    const rpeInput = screen.getAllByRole('spinbutton')[4];
    expect(rpeInput).toHaveValue(null);
    fireEvent.change(rpeInput, { target: { value: '1' } });
    expect(rpeInput).toHaveValue(1);

    await user.click(screen.getByText('Apply'));

    expect(props.onAttributesBulkUpdate).toHaveBeenCalledTimes(1);
    expect(props.onAttributesBulkUpdate).toHaveBeenCalledWith({ rpe: 1 });
  });
});
