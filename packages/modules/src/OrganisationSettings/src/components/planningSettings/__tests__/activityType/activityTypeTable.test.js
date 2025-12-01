import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityTypeTable from '../../activityType/ActivityTypeTable';
import { mockActivityTypes, mockSquads } from '../../utils/mocks';

describe('<ActivityTypeTable />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isLoading: false,
      activityTypes: mockActivityTypes,
      squads: mockSquads,
      isValidationCheckAllowed: false,
      onDelete: jest.fn(),
      onChangeName: jest.fn(),
      onChangeActivityCategory: jest.fn(),
      onChangeSquads: jest.fn(),
      onAddNew: jest.fn(),
      onDeleteNew: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  describe('when view is PRESENTATION', () => {
    it('renders the data table with correct headers and row data', () => {
      render(<ActivityTypeTable {...baseProps} view="PRESENTATION" />);

      // Check column headers
      expect(
        screen.getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();

      // Check content of the first row
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1]; // 0 is the header

      expect(
        within(firstDataRow).getByText('First activity')
      ).toBeInTheDocument();
      expect(
        within(firstDataRow).getByText('International Squad')
      ).toBeInTheDocument();

      // Check content of the second row
      const secondDataRow = rows[2];
      expect(
        within(secondDataRow).getByText('Second activity')
      ).toBeInTheDocument();
      expect(
        within(secondDataRow).getByText('Academy Squad')
      ).toBeInTheDocument();
    });
  });

  describe('when view is EDIT', () => {
    it('renders the data table with input fields for each row', () => {
      render(<ActivityTypeTable {...baseProps} view="EDIT" />);

      // Check for inputs with the correct initial values
      expect(screen.getByDisplayValue('First activity')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second activity')).toBeInTheDocument();

      // Check for the "Add" button
      expect(
        screen.getByRole('button', { name: 'Add activity type' })
      ).toBeInTheDocument();
    });

    it('renders the correct squad selections in the dropdowns', async () => {
      const user = userEvent.setup();
      render(<ActivityTypeTable {...baseProps} view="EDIT" />);

      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];

      // Find the dropdown in the first row and check its selected value
      const firstSquadSelect = within(firstDataRow).getByText(
        'International Squad'
      );
      expect(firstSquadSelect).toBeInTheDocument();

      // Open the dropdown to check its options
      await user.click(firstSquadSelect);
      expect(
        await screen.findByText('Academy Squad', { selector: 'div' })
      ).toBeInTheDocument();
    });

    it('has the correct edit-mode styles on the table', () => {
      const { container } = render(
        <ActivityTypeTable {...baseProps} view="EDIT" />
      );
      // The main element should have the edit class
      const tableContainer = container.querySelector('.planningSettingsTable');
      expect(tableContainer).toHaveClass('planningSettingsTable--edit');
    });
  });

  describe('when activity type categories are enabled', () => {
    it('renders the category column and data correctly', () => {
      const propsWithCategories = {
        ...baseProps,
        activityTypeCategoriesEnabled: true,
        activityTypeCategories: [
          { id: 1, name: 'Conditioning' },
          { id: 2, name: 'Football Based' },
        ],
        activityTypes: [
          {
            id: 1,
            name: 'First activity',
            squads: [{ id: 8, name: 'International Squad' }],
            event_activity_type_category: { id: 1, name: 'Conditioning' },
          },
          {
            id: 2,
            name: 'Second activity',
            squads: [{ id: 73, name: 'Academy Squad' }],
            event_activity_type_category: { id: 2, name: 'Football Based' },
          },
        ],
      };
      render(
        <ActivityTypeTable {...propsWithCategories} view="PRESENTATION" />
      );

      // Check for the new "Category" header
      expect(
        screen.getByRole('columnheader', { name: 'Category' })
      ).toBeInTheDocument();

      // Check that the category data is rendered in the correct rows
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Conditioning')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Football Based')).toBeInTheDocument();
    });
  });

  describe('when there are no activity types', () => {
    it('displays the no activity types message', () => {
      render(
        <ActivityTypeTable
          {...baseProps}
          view="PRESENTATION"
          activityTypes={[]}
        />
      );
      expect(screen.getByText('No activity types added')).toBeInTheDocument();
    });
  });
});
