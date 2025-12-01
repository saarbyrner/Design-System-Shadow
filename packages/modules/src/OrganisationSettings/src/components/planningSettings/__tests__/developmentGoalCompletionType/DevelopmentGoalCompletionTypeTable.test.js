import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalCompletionTypeTable from '../../developmentGoalCompletionType/DevelopmentGoalCompletionTypeTable';
import { mockDevelopmentGoalCompletionTypes } from '../../utils/mocks';

describe('<DevelopmentGoalCompletionTypeTable />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isLoading: false,
      developmentGoalCompletionTypes: mockDevelopmentGoalCompletionTypes,
      isValidationCheckAllowed: false,
      onArchive: jest.fn(),
      onChangeName: jest.fn(),
      onAddNew: jest.fn(),
      onDeleteNew: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  describe('when view is PRESENTATION', () => {
    it('renders the data table with the correct headers and row data', () => {
      render(
        <DevelopmentGoalCompletionTypeTable
          {...baseProps}
          view="PRESENTATION"
        />
      );

      // Check column header
      expect(
        screen.getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();

      // Check content of the rows
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1]; // 0 is the header
      const secondDataRow = rows[2];

      expect(
        within(firstDataRow).getByText('First goal completion type')
      ).toBeInTheDocument();
      expect(
        within(secondDataRow).getByText('Second goal completion type')
      ).toBeInTheDocument();
    });

    it('displays an empty state message when there are no items', () => {
      render(
        <DevelopmentGoalCompletionTypeTable
          {...baseProps}
          view="PRESENTATION"
          developmentGoalCompletionTypes={[]}
        />
      );
      expect(
        screen.getByText('No development goal completion types')
      ).toBeInTheDocument();
    });

    it('calls onArchive when the archive action is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DevelopmentGoalCompletionTypeTable
          {...baseProps}
          view="PRESENTATION"
        />
      );
      const firstRow = screen.getAllByRole('row')[1];

      const actionMenuButton = within(firstRow).getByRole('button');

      await user.click(actionMenuButton);
      const archiveAction = await screen.findByText('Archive');
      await user.click(archiveAction);

      expect(baseProps.onArchive).toHaveBeenCalledTimes(1);
      expect(baseProps.onArchive).toHaveBeenCalledWith(
        mockDevelopmentGoalCompletionTypes[0].id
      );
    });
  });

  describe('when view is EDIT', () => {
    it('renders the table with input fields for each row', () => {
      render(<DevelopmentGoalCompletionTypeTable {...baseProps} view="EDIT" />);

      // Check for inputs with the correct initial values
      expect(
        screen.getByDisplayValue('First goal completion type')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Second goal completion type')
      ).toBeInTheDocument();
    });

    it('renders the "Add" button and calls onAddNew when clicked', async () => {
      const user = userEvent.setup();

      render(<DevelopmentGoalCompletionTypeTable {...baseProps} view="EDIT" />);

      const addButton = screen.getByRole('button', {
        name: 'Add development goal completion type',
      });

      await user.click(addButton);

      expect(baseProps.onAddNew).toHaveBeenCalledTimes(1);
    });

    it('calls onChangeName when a name is edited', async () => {
      render(<DevelopmentGoalCompletionTypeTable {...baseProps} view="EDIT" />);

      const firstInput = screen.getByDisplayValue('First goal completion type');

      fireEvent.change(firstInput, { target: { value: 'An Edited Name' } });

      expect(baseProps.onChangeName).toHaveBeenCalledWith(
        mockDevelopmentGoalCompletionTypes[0].id,
        'An Edited Name'
      );
    });

    it('renders a delete button for a new item and calls onDeleteNew when clicked', async () => {
      const user = userEvent.setup();
      const newTypes = [
        ...mockDevelopmentGoalCompletionTypes,
        { id: 'NEW_ITEM_123', name: '' },
      ];

      render(
        <DevelopmentGoalCompletionTypeTable
          {...baseProps}
          view="EDIT"
          developmentGoalCompletionTypes={newTypes}
        />
      );

      // Find the new row by its empty input value
      const newRow = screen.getByDisplayValue('').closest('tr');

      const deleteButton = within(newRow).getByRole('button');
      await user.click(deleteButton);

      expect(baseProps.onDeleteNew).toHaveBeenCalledTimes(1);
      expect(baseProps.onDeleteNew).toHaveBeenCalledWith('NEW_ITEM_123');
    });
  });
});
