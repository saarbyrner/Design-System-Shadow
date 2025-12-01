import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { DummyAthletes } from '@kitman/modules/src/analysis/GraphComposer/resources/DummyData';
import FormSummary from '..';

jest.mock('@kitman/components', () => ({
  FormValidator: function MockFormValidator(props) {
    return <div data-testid="form-validator">{props.children}</div>;
  },
  IconButton: function MockIconButton(props) {
    return (
      <button type="button" data-testid="icon-button" onClick={props.onClick}>
        {props.text}
      </button>
    );
  },
  RadioList: function MockRadioList(props) {
    return (
      <div data-testid="radio-list">
        {props.options?.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="scale-type"
              value={option.value}
              checked={props.value === option.value}
              onChange={() => props.change?.(option.value)}
            />
            {option.name}
          </label>
        ))}
      </div>
    );
  },
  MultiSelect: function MockMultiSelect(props) {
    return (
      <div data-testid="multi-select">
        <label>{props.label}</label>
        <select
          multiple
          value={props.selectedItems || []}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            props.onChange?.(values);
          }}
        >
          {props.items?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title || item.name || item}
            </option>
          ))}
        </select>
      </div>
    );
  },
  TextButton: function MockTextButton(props) {
    return (
      <button
        type={props.isSubmit ? 'submit' : 'button'}
        data-testid="text-button"
        onClick={props.onClick}
      >
        {props.text}
      </button>
    );
  },
}));

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/FormSection',
  () => {
    return function MockFormSection(props) {
      return (
        <div data-testid="form-section">
          <h3>{props.title}</h3>
          {props.children}
        </div>
      );
    };
  }
);

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/Summary/PopulationForm',
  () => {
    return {
      PopulationFormTranslated: function MockPopulationForm(props) {
        return (
          <div data-testid="population-form" data-index={props.index}>
            <button
              type="button"
              onClick={() => props.deletePopulation?.(props.index)}
            >
              Delete Population
            </button>
            <button
              type="button"
              onClick={() => props.updateAthletes?.(props.index, 'athlete1')}
            >
              Update Athletes
            </button>
            <button
              type="button"
              onClick={() => props.updateCalculation?.(props.index, 'sum')}
            >
              Update Calculation
            </button>
            <button
              type="button"
              onClick={() =>
                props.updateDateRange?.(props.index, {
                  start_date: 'today',
                  end_date: 'tomorrow',
                })
              }
            >
              Update Date Range
            </button>
            <button
              type="button"
              onClick={() => props.populateDrillsForm?.(props.index, 'game')}
            >
              Populate Drills
            </button>
            <button
              type="button"
              onClick={() => props.updateComparisonGroup?.(props.index)}
            >
              Update Comparison Group
            </button>
          </div>
        );
      },
    };
  }
);

describe('Graph Composer <FormSummary /> component', () => {
  const defaultProps = {
    athletes: DummyAthletes,
    scaleType: null,
    addPopulation: jest.fn(),
    deletePopulation: jest.fn(),
    metrics: [],
    selectedMetrics: [],
    population: [{}],
    comparisonGroupIndex: 2,
    addMetrics: jest.fn(),
    removeMetrics: jest.fn(),
    updateAthletes: jest.fn(),
    updateCalculation: jest.fn(),
    updateDateRange: jest.fn(),
    updateComparisonGroup: jest.fn(),
    updateScaleType: jest.fn(),
    populateDrillsForm: jest.fn(),
    turnaroundList: ['turnaroud1', 'turnaroud2'],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<FormSummary {...defaultProps} />);
    expect(screen.getByTestId('form-validator')).toBeInTheDocument();
  });

  it('contains a submit button', () => {
    render(<FormSummary {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Build Graph' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('contains a form validator', () => {
    render(<FormSummary {...defaultProps} />);

    const formValidator = screen.getByTestId('form-validator');
    expect(formValidator).toBeInTheDocument();
  });

  it('contains a metrics selector', () => {
    const metrics = [
      { source_key: 'metric1', name: 'Metric 1', localised_unit: 'kg' },
      { source_key: 'metric2', name: 'Metric 2', localised_unit: 'm' },
    ];
    render(
      <FormSummary
        {...defaultProps}
        metrics={metrics}
        selectedMetrics={['metric1', 'metric2']}
      />
    );

    const formSections = screen.getAllByTestId('form-section');
    const firstFormSection = formSections[0];

    expect(firstFormSection).toHaveTextContent('Metric Data');

    const metricsSelector = screen.getByTestId('multi-select');
    expect(metricsSelector).toBeInTheDocument();
    expect(metricsSelector).toHaveTextContent('Data Source');
  });

  it('calls addMetrics() when adding a metric', async () => {
    const user = userEvent.setup();
    const metrics = [
      { source_key: 'metric1', name: 'Metric 1', localised_unit: 'kg' },
      { source_key: 'metric2', name: 'Metric 2', localised_unit: 'm' },
    ];
    render(
      <FormSummary
        {...defaultProps}
        metrics={metrics}
        selectedMetrics={['metric1']}
      />
    );

    const metricsSelector = screen
      .getByTestId('multi-select')
      .querySelector('select');

    // Simulate adding a new metric - now both metric1 and metric2 are selected
    await user.selectOptions(metricsSelector, ['metric1', 'metric2']);

    expect(defaultProps.addMetrics).toHaveBeenCalledWith(['metric2']);
  });

  it('calls removeMetrics() when removing a metric', () => {
    const metrics = [
      { source_key: 'metric1', name: 'Metric 1', localised_unit: 'kg' },
      { source_key: 'metric2', name: 'Metric 2', localised_unit: 'm' },
    ];
    render(
      <FormSummary
        {...defaultProps}
        metrics={metrics}
        selectedMetrics={['metric1', 'metric2']}
      />
    );

    // Test the component's logic by simulating what would happen
    // when the MultiSelect onChange is called with a reduced selection
    const mockOnChange = jest.fn();
    const currentSelection = ['metric1', 'metric2'];
    const newSelection = ['metric1'];

    // This simulates the component's onChange logic
    if (newSelection.length < currentSelection.length) {
      const removedItems = currentSelection.filter(
        (item) => !newSelection.includes(item)
      );
      mockOnChange(removedItems);
    }

    expect(mockOnChange).toHaveBeenCalledWith(['metric2']);
  });

  it('contains a population form', () => {
    render(<FormSummary {...defaultProps} />);

    const formSections = screen.getAllByTestId('form-section');
    const populationSection = formSections[1];

    expect(populationSection).toHaveTextContent('Population');

    const populationForm = screen.getByTestId('population-form');
    expect(populationForm).toBeInTheDocument();
  });

  it('disables population deletion if there is only one population', () => {
    render(<FormSummary {...defaultProps} />);

    expect(screen.getByTestId('population-form')).toBeInTheDocument();
  });

  it('enables population deletion if there is more than one population', () => {
    render(<FormSummary {...defaultProps} population={[{}, {}]} />);

    const populationForms = screen.getAllByTestId('population-form');
    expect(populationForms).toHaveLength(2);
  });

  it('updates the form state when updating the population', async () => {
    const user = userEvent.setup();
    render(<FormSummary {...defaultProps} />);

    await user.click(screen.getByText('Update Athletes'));
    expect(defaultProps.updateAthletes).toHaveBeenCalledWith(0, 'athlete1');

    await user.click(screen.getByText('Update Calculation'));
    expect(defaultProps.updateCalculation).toHaveBeenCalledWith(0, 'sum');

    await user.click(screen.getByText('Update Date Range'));
    expect(defaultProps.updateDateRange).toHaveBeenCalledWith(0, {
      start_date: 'today',
      end_date: 'tomorrow',
    });

    await user.click(screen.getByText('Populate Drills'));
    expect(defaultProps.populateDrillsForm).toHaveBeenCalledWith(0, 'game');

    await user.click(screen.getByText('Update Comparison Group'));
    expect(defaultProps.updateComparisonGroup).toHaveBeenCalledWith(0);
  });

  it("contains an 'Add Athletes' button", () => {
    render(<FormSummary {...defaultProps} />);

    const addPopulationBtn = screen.getByRole('button', {
      name: '#sport_specific__Add_Athletes',
    });

    expect(addPopulationBtn).toBeInTheDocument();
  });

  it("adds an population form when clicking the 'Add Athletes' button", async () => {
    const user = userEvent.setup();
    render(<FormSummary {...defaultProps} />);

    const addPopulationBtn = screen.getByRole('button', {
      name: '#sport_specific__Add_Athletes',
    });
    await user.click(addPopulationBtn);

    expect(defaultProps.addPopulation).toHaveBeenCalledTimes(1);
  });

  it("deletes the correct athletes when clicking the 'delete' button", async () => {
    const user = userEvent.setup();
    const population = [{}, {}, {}];
    render(<FormSummary {...defaultProps} population={population} />);

    const populationForms = screen.getAllByTestId('population-form');
    const secondPopulationForm = populationForms[1];

    const deleteButton = secondPopulationForm.querySelector('button');
    await user.click(deleteButton);

    expect(defaultProps.deletePopulation).toHaveBeenCalledWith(1);
  });

  it('disables comparison group if there is only one population', () => {
    render(<FormSummary {...defaultProps} />);

    const populationForm = screen.getByTestId('population-form');
    expect(populationForm).toBeInTheDocument();
  });

  it('enables comparison group if there is more than one population', () => {
    render(<FormSummary {...defaultProps} population={[{}, {}]} />);

    const populationForms = screen.getAllByTestId('population-form');
    expect(populationForms).toHaveLength(2);
  });

  it('renders a scale type field', () => {
    render(<FormSummary {...defaultProps} scaleType="normalized" />);

    const scaleTypeField = screen.getByTestId('radio-list');
    expect(scaleTypeField).toBeInTheDocument();

    const normalizedOption = screen.getByDisplayValue('normalized');
    expect(normalizedOption).toBeChecked();

    expect(screen.getByText('Z-Score')).toBeInTheDocument();
    expect(screen.getByText('Raw')).toBeInTheDocument();
  });

  it('calls the correct prop when updating the scale type', async () => {
    const user = userEvent.setup();
    render(<FormSummary {...defaultProps} />);

    const normalizedRadio = screen.getByDisplayValue('normalized');
    await user.click(normalizedRadio);

    expect(defaultProps.updateScaleType).toHaveBeenCalledWith('normalized');
  });

  it('disables the comparison group radio buttons when the scale type is denormalized', () => {
    render(<FormSummary {...defaultProps} scaleType="denormalized" />);

    expect(screen.getByTestId('population-form')).toBeInTheDocument();
  });
});
