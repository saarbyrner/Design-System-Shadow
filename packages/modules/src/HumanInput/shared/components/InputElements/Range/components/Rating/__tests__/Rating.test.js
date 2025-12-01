import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingSelector from '@kitman/modules/src/HumanInput/shared/components/InputElements/Range/components/Rating';

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
      style: 'rating',
      increment: 0.5,
    },
    min: 0,
    max: 10,
  },
  visible: true,
  order: 1,
  form_elements: [],
};

describe('<RatingSelector />', () => {
  const props = {
    element: MOCK_ELEMENT,
    value: 5,
    onChange: jest.fn(),
  };

  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
  });

  it('renders 4 value', async () => {
    render(<RatingSelector {...props} />);

    expect(screen.getByText('How blue is the sky today?')).toBeInTheDocument();

    const radio = screen.getByLabelText(/4 Stars/i);
    await userEvent.click(radio, { target: { value: 4 } });
    expect(radio.value).toBe('4');
  });

  it('renders 7 value', async () => {
    render(<RatingSelector {...props} />);

    expect(screen.getByText('How blue is the sky today?')).toBeInTheDocument();

    const radio = screen.getByLabelText(/7.5 Stars/i);
    await userEvent.click(radio, { target: { value: 7.5 } });
    expect(radio.value).toBe('7.5');
  });

  it('renders component as read only', () => {
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(<RatingSelector {...props} />);

    const ratingElement = screen.getByLabelText('5 Stars');
    expect(ratingElement).toHaveClass('Mui-readOnly');
  });
});
