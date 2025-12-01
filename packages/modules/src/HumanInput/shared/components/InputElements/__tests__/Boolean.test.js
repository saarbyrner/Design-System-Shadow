import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { BooleanInputTranslated as Boolean } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Boolean';

setI18n(i18n);

const MOCK_ELEMENT = {
  id: 4009,
  element_type: 'Forms::Elements::Inputs::Boolean',
  config: {
    text: 'Are you Right-Handed?',
    data_point: false,
    element_id: 'pi_right_handed',
    optional: false,
    custom_params: {
      readonly: false,
      style: 'toggle',
    },
  },
  visible: true,
  order: 13,
  form_elements: [],
};

describe('<Boolean/>', () => {
  const i18nT = i18nextTranslateStub();

  const props = {
    element: MOCK_ELEMENT,
    value: true,
    onChange: jest.fn(),
    t: i18nT,
  };

  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
  });

  it('renders true value', () => {
    render(<Boolean {...props} />);

    expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByRole('group')).not.toHaveAttribute('readOnly');

    // Options
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();

    // "Yes" selected (value: true)
    expect(screen.getByText('Yes')).toHaveClass('Mui-selected');
  });

  it('renders false value', () => {
    render(<Boolean {...props} value={false} />);

    expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByRole('group')).not.toHaveAttribute('readOnly');

    // Options
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();

    // "No" selected (value: false)
    expect(screen.getByText('No')).toHaveClass('Mui-selected');
  });

  it('renders component as read only', () => {
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(<Boolean {...props} />);

    expect(screen.getByText('No')).toHaveClass('Mui-disabled');
    expect(screen.getByText('Yes')).toHaveClass('Mui-disabled');
  });

  describe('style: toggle', () => {
    it('renders component as toggle if custom_params.style is toggle', () => {
      MOCK_ELEMENT.config.custom_params.style = 'toggle';

      render(<Boolean {...props} />);

      expect(screen.getByRole('group')).toBeInTheDocument();

      expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    });
  });

  describe('style: checkbox', () => {
    it('renders component as checkbox if custom_params.style is checkbox', () => {
      MOCK_ELEMENT.config.custom_params.style = 'checkbox';

      render(<Boolean {...props} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();

      expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
      expect(screen.queryByText('No')).not.toBeInTheDocument();
    });
  });

  describe('style: switch', () => {
    beforeEach(() => {
      MOCK_ELEMENT.config.custom_params.style = 'switch';
    });
    it('renders true value', () => {
      render(<Boolean {...props} />);

      expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('readOnly');

      const switchElement = screen.getByRole('checkbox');

      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toBeChecked();
    });

    it('renders false value', () => {
      render(<Boolean {...props} value={false} />);

      expect(screen.getByText('Are you Right-Handed?')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('readOnly');

      const switchElement = screen.getByRole('checkbox');

      expect(switchElement).toBeInTheDocument();
      expect(switchElement).not.toBeChecked();
    });

    it('renders component as read only', () => {
      MOCK_ELEMENT.config.custom_params.readonly = true;

      render(<Boolean {...props} />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('readOnly');
    });
  });
});
