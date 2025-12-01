import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import DescriptionField from '../common/DescriptionField';

describe('PlanningEventSidePanel <DescriptionField /> component', () => {
  const mockOnUpdateEventDetails = jest.fn();

  const defaultProps = {
    description: 'test',
    maxLength: 10,
    onUpdateEventDetails: mockOnUpdateEventDetails,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<DescriptionField {...defaultProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders Textarea with correct props', () => {
    render(<DescriptionField {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('test');
    expect(textarea).toHaveAttribute('data-maxlimit', '10');
  });

  it('calls onUpdateEventDetails with correct values when onChange triggered', () => {
    render(<DescriptionField {...defaultProps} />);

    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, { target: { value: 'New text' } });

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      description: 'New text',
    });
  });

  it('limits the length of text to maxLength', () => {
    render(<DescriptionField {...defaultProps} />);

    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, {
      target: { value: 'Text longer than allowed' },
    });

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      description: 'Text longe',
    });
  });

  it('displays correct character count when description is empty', () => {
    const propsWithEmptyDescription = {
      ...defaultProps,
      description: null,
    };

    render(<DescriptionField {...propsWithEmptyDescription} />);

    expect(screen.getByText('10 characters remaining')).toBeInTheDocument();
  });

  it('displays character remaining text', () => {
    render(<DescriptionField {...defaultProps} />);

    expect(screen.getByText('6 characters remaining')).toBeInTheDocument();
  });

  it('displays correct character count for different description lengths', () => {
    const propsWithLongerText = {
      ...defaultProps,
      description: 'testtext',
    };

    render(<DescriptionField {...propsWithLongerText} />);

    expect(screen.getByText('2 characters remaining')).toBeInTheDocument();
  });

  it('displays correct character count when at maximum length', () => {
    const propsWithMaxText = {
      ...defaultProps,
      description: '1234567890', // 10 characters, matching maxLength
    };

    render(<DescriptionField {...propsWithMaxText} />);

    expect(screen.getByText('0 characters remaining')).toBeInTheDocument();
  });
});
