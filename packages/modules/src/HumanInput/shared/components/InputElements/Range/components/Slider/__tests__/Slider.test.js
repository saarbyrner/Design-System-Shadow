import { render, screen } from '@testing-library/react';
import SliderSelector from '@kitman/modules/src/HumanInput/shared/components/InputElements/Range/components/Slider';

const MOCK_ELEMENT = {
  id: 2025,
  element_type: 'Forms::Elements::Inputs::Range',
  config: {
    text: 'How blue is the sky today?',
    data_point: 5,
    element_id: 'pi_sky_blue',
    optional: false,
    custom_params: {
      readonly: false,
      style: 'slider',
      increment: 0.5,
    },
    min: 0,
    max: 10,
  },
  visible: true,
  order: 1,
  form_elements: [],
};

describe('<SliderSelector />', () => {
  const props = {
    element: MOCK_ELEMENT,
    value: 5,
    onChange: jest.fn(),
  };

  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
  });

  it('renders 5 value', () => {
    render(<SliderSelector {...props} />);

    expect(screen.getByText('How blue is the sky today?')).toBeInTheDocument();

    const slider = screen.getByRole('slider');

    expect(slider).not.toHaveAttribute('readOnly');

    expect(slider).toHaveAttribute('aria-valuenow', '5');
  });

  it('renders 7.5 value', () => {
    render(<SliderSelector {...props} value={7.5} />);

    expect(screen.getByText('How blue is the sky today?')).toBeInTheDocument();

    const slider = screen.getByRole('slider');

    expect(slider).not.toHaveAttribute('readOnly');

    expect(slider).toHaveAttribute('aria-valuenow', '7.5');
  });

  it('renders component as read only', () => {
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(<SliderSelector {...props} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });
});
