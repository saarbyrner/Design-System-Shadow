import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data } from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingResults';
import BenchmarkValidator from '..';

describe('<BenchmarkValidator />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    dataToValidate: data,
    title: 'Liverpool, September 2023/2024',
    isLoading: false,
    submitValidations: jest.fn(),
  };

  it('should render as expected', () => {
    render(<BenchmarkValidator {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getAllByTestId('Accordion')).toHaveLength(
      data.age_group_seasons.length
    );
  });

  it('should check all checkboxes in Accordion once Select all button is clicked and then clear', () => {
    render(<BenchmarkValidator {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'U9' }));
    fireEvent.click(screen.getAllByText('Select all')[0]);

    const checkBoxesInAccordion = screen.getAllByRole('checkbox');

    checkBoxesInAccordion.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    fireEvent.click(screen.getAllByText('Clear')[0]);

    checkBoxesInAccordion.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should copy selected checkboxes to all accordions', () => {
    render(<BenchmarkValidator {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'U9' }));
    fireEvent.click(screen.getAllByText('Select all')[0]);

    fireEvent.click(screen.getAllByText('Copy selection to all')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'U10' }));

    const checkBoxesInAccordions = screen.getAllByRole('checkbox');

    checkBoxesInAccordions.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it('should expand and collapse all accordions as expected', async () => {
    render(<BenchmarkValidator {...defaultProps} />);

    fireEvent.click(screen.getByText('Expand all'));
    expect(screen.getAllByRole('checkbox')).toHaveLength(28);

    fireEvent.click(screen.getByText('Collapse all'));

    await waitFor(() => {
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  it('should call submitBenchmarkTestValidations with validated metrics on click of Validate', () => {
    render(<BenchmarkValidator {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'U9' }));
    fireEvent.click(screen.getAllByText('Select all')[0]);
    fireEvent.click(screen.getByText('Validate'));

    expect(defaultProps.submitValidations).toHaveBeenCalledWith({
      org: 6,
      validatedMetrics: [
        { age_group_season_id: 223, training_variable_id: 16340 },
        { age_group_season_id: 223, training_variable_id: 16341 },
        { age_group_season_id: 223, training_variable_id: 16342 },
        { age_group_season_id: 223, training_variable_id: 16343 },
        { age_group_season_id: 223, training_variable_id: 16340 },
        { age_group_season_id: 223, training_variable_id: 16341 },
        { age_group_season_id: 223, training_variable_id: 16342 },
        { age_group_season_id: 223, training_variable_id: 16343 },
      ],
      window: 5,
      season: 2011,
    });
  });

  it('should call submitBenchmarkTestValidations with null validated metrics on click of Validate', () => {
    render(<BenchmarkValidator {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'U9' }));
    fireEvent.click(screen.getAllByText('Clear')[0]);
    fireEvent.click(screen.getByText('Validate'));

    expect(defaultProps.submitValidations).toHaveBeenCalledWith({
      org: 6,
      validatedMetrics: null,
      window: 5,
      season: 2011,
    });
  });
});
