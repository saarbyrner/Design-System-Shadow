import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DrillLabelsTable from '../../drillLabels/DrillLabelsTable';
import { mockDrillLabels, mockSquads } from '../../utils/mocks';

describe('<DrillLabelsTable />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isLoading: false,
      drillLabels: mockDrillLabels,
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
      render(<DrillLabelsTable {...baseProps} view="PRESENTATION" />);

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
      expect(within(firstDataRow).getByText('label_1')).toBeInTheDocument();
      expect(
        within(firstDataRow).getByText('International Squad')
      ).toBeInTheDocument();

      // Check content of the second row
      const secondDataRow = rows[2];
      expect(within(secondDataRow).getByText('label_2')).toBeInTheDocument();
      expect(
        within(secondDataRow).getByText('International Squad, Academy Squad')
      ).toBeInTheDocument();
    });
  });

  describe('when view is EDIT', () => {
    it('renders the data table with input fields for each row', () => {
      render(<DrillLabelsTable {...baseProps} view="EDIT" />);

      // Check for inputs with the correct initial values
      expect(screen.getByDisplayValue('label_1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('label_2')).toBeInTheDocument();

      // Check for the "Add" button
      expect(
        screen.getByRole('button', { name: 'Add drill label' })
      ).toBeInTheDocument();
    });

    it('renders the correct squad selections in the dropdowns', async () => {
      const user = userEvent.setup();
      render(<DrillLabelsTable {...baseProps} view="EDIT" />);

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
        <DrillLabelsTable {...baseProps} view="EDIT" />
      );
      // The main element should have the edit class
      const tableContainer = container.querySelector('.planningSettingsTable');
      expect(tableContainer).toHaveClass('planningSettingsTable--edit');
    });
  });

  describe('when there are no drill labels', () => {
    it('displays the no drill labels message', () => {
      render(
        <DrillLabelsTable {...baseProps} view="PRESENTATION" drillLabels={[]} />
      );
      expect(screen.getByText('No drill labels added')).toBeInTheDocument();
    });
  });
});
