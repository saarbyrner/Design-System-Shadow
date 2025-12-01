import { screen } from '@testing-library/react';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import RadioSlider from '..';

describe('<RadioSlider />', () => {
  const defaultProps = {
    option: { value: DEFAULT_BIO_BAND_RANGE, label: 'Any' },
    onChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('should render default options', () => {
    renderWithUserEventSetup(<RadioSlider {...defaultProps} />);

    expect(screen.getByRole('radio', { name: 'Any' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Select range' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('should render slider component and label on click of select range', async () => {
    const { user } = renderWithUserEventSetup(
      <RadioSlider {...defaultProps} />
    );

    expect(screen.queryByRole('slider')).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Select range' }));
    // 2 sliders make up the component.
    expect(screen.getAllByRole('slider')).toHaveLength(2);
    expect(screen.getByText('65%–100% of AH')).toBeInTheDocument();
  });

  it('should render slider component and label if value is NOT default', async () => {
    renderWithUserEventSetup(
      <RadioSlider
        {...defaultProps}
        option={{ ...defaultProps, value: [75, 85] }}
      />
    );

    // 2 sliders make up the component.
    expect(screen.getAllByRole('slider')).toHaveLength(2);
    expect(screen.getByText('75%–85% of AH')).toBeInTheDocument();
  });

  it('should call onChange with range value on click of Apply', async () => {
    const mockOption = {
      value: [75, 85],
      label: '75%–85% of AH',
    };

    const { user } = renderWithUserEventSetup(
      <RadioSlider {...defaultProps} option={mockOption} />
    );

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(defaultProps.onChange).toHaveBeenCalledWith(mockOption);
  });

  it('should call onChange with Any value on click of Apply', async () => {
    const { user } = renderWithUserEventSetup(
      <RadioSlider {...defaultProps} />
    );

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.option);
  });
});
