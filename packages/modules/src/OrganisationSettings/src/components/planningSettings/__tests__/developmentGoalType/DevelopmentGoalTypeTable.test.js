import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalTypeTable from '../../developmentGoalType/DevelopmentGoalTypeTable';
import { mockDevelopmentGoalTypes, mockSquads } from '../../utils/mocks';

describe('<DevelopmentGoalTypeTable />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isLoading: false,
      developmentGoalTypes: mockDevelopmentGoalTypes,
      squads: mockSquads,
      isValidationCheckAllowed: false,
      onDelete: jest.fn(),
      onChangeName: jest.fn(),
      onChangeSquads: jest.fn(),
      onAddNew: jest.fn(),
      onDeleteNew: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  describe('when view is PRESENTATION', () => {
    it('renders the data table with correct headers and row data', () => {
      render(<DevelopmentGoalTypeTable {...baseProps} view="PRESENTATION" />);

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

      expect(within(firstDataRow).getByText('First goal')).toBeInTheDocument();
      expect(
        within(firstDataRow).getByText('International Squad')
      ).toBeInTheDocument();

      // Check content of the second row
      const secondDataRow = rows[2];
      expect(
        within(secondDataRow).getByText('Second goal')
      ).toBeInTheDocument();
      expect(
        within(secondDataRow).getByText('Academy Squad')
      ).toBeInTheDocument();
    });
  });

  describe('when view is EDIT', () => {
    it('renders the data table with input fields for each row', () => {
      render(<DevelopmentGoalTypeTable {...baseProps} view="EDIT" />);

      // Check for inputs with the correct initial values
      expect(screen.getByDisplayValue('First goal')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second goal')).toBeInTheDocument();

      // Check for the "Add" button
      expect(
        screen.getByRole('button', { name: 'Add development goal type' })
      ).toBeInTheDocument();
    });

    it('renders the correct squad selections in the dropdowns', async () => {
      const user = userEvent.setup();
      render(<DevelopmentGoalTypeTable {...baseProps} view="EDIT" />);

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
  });

  describe('when there are no development goal types', () => {
    it('displays the no development goal types message', () => {
      render(
        <DevelopmentGoalTypeTable
          {...baseProps}
          view="PRESENTATION"
          developmentGoalTypes={[]}
        />
      );
      expect(
        screen.getByText('No development goal types added')
      ).toBeInTheDocument();
    });
  });
});
