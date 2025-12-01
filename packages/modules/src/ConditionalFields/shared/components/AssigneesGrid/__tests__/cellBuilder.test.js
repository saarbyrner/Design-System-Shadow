import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

import buildCellContent from '../cellBuilder';
import { data } from '../../../services/mocks/data/assignees.mock';

const assignment = data.assignments[1];

const payloadForCellBuilder = {
  editMode: false,
  assignment,
  assignments: data.assignments.map((asgmt) => ({
    squad_id: asgmt.assignee.id,
    active: asgmt.active,
  })),
  onChange: jest.fn(),
};

describe('buildCellContent', () => {
  it('renders the squad', () => {
    render(buildCellContent({ row_key: 'squad' }, payloadForCellBuilder));
    expect(screen.getByText(assignment.assignee.name)).toBeInTheDocument();
  });
  it('renders the active players', () => {
    render(
      buildCellContent({ row_key: 'active_players' }, payloadForCellBuilder)
    );
    expect(
      screen.getByText(assignment.assignee.active_athlete_count)
    ).toBeInTheDocument();
  });
  it('renders the assigned disabled checkbox when edit mode = false', () => {
    render(buildCellContent({ row_key: 'assigned' }, payloadForCellBuilder));
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeDisabled();
  });

  it('renders the assigned enabled checkbox when edit mode = true', () => {
    render(
      buildCellContent(
        { row_key: 'assigned' },
        { ...payloadForCellBuilder, editMode: true }
      )
    );
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeEnabled();
    expect(checkbox).toBeChecked();
  });

  it('renders the assigned enabled and checked checkbox when edit mode = true and active = true', () => {
    render(
      buildCellContent(
        { row_key: 'assigned' },
        { ...payloadForCellBuilder, editMode: true }
      )
    );
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeEnabled();
    expect(checkbox).toBeChecked();
  });

  it('calls on change when the assigned checked checkbox is clicked and checkbox is unchecked', async () => {
    const { rerender } = render(
      buildCellContent(
        { row_key: 'assigned' },
        {
          ...payloadForCellBuilder,
          editMode: true,
          assignments: data.assignments.map((asgmt, index) => ({
            squad_id: asgmt.assignee.id,
            active: index === 1,
          })),
        }
      )
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeEnabled();

    await userEvent.click(checkbox);

    expect(payloadForCellBuilder.onChange).toHaveBeenCalledTimes(1);

    rerender(
      buildCellContent(
        { row_key: 'assigned' },
        {
          ...payloadForCellBuilder,
          editMode: true,
          assignments: data.assignments.map((asgmt, index) => ({
            squad_id: asgmt.assignee.id,
            active: index !== 1,
          })),
        }
      )
    );

    expect(checkbox).not.toBeChecked();
  });
  it('renders the version assigned date correctly when assigned', () => {
    render(
      buildCellContent({ row_key: 'assigned_date' }, payloadForCellBuilder)
    );

    expect(
      screen.getByText(
        DateFormatter.formatStandard({
          date: moment(assignment.updated_at),
        })
      )
    ).toBeInTheDocument();
  });
  it('renders the version assigned date correctly when not assigned', () => {
    render(
      buildCellContent(
        { row_key: 'assigned_date' },
        { ...payloadForCellBuilder, assignment: data.assignments[2] }
      )
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders the version assigned date correctly when not currently assigned but was assigned previously', () => {
    render(
      buildCellContent(
        { row_key: 'assigned_date' },
        {
          ...payloadForCellBuilder,
          assignment: {
            ...data.assignments[1],
            active: false,
          },
        }
      )
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
