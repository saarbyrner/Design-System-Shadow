import { render, screen } from '@testing-library/react';
import { colors } from '@kitman/common/src/variables';
import SegmentedControl from '..';

describe('<SegmentedControl />', () => {
  const buttons = [
    {
      name: 'One',
      value: 'ONE',
      color: '#000001',
    },
    {
      name: 'Two',
      value: 'TWO',
      color: '#000002',
    },
    {
      name: 'Three',
      value: 'THREE',
      color: '#000003',
    },
  ];

  const props = {
    buttons,
    label: 'Segmented Control',
    maxWidth: 300,
    onClickButton: jest.fn(),
    selectedButton: '',
  };

  it('renders the component', () => {
    render(<SegmentedControl {...props} />);
    expect(screen.getByTestId('SegmentedControl|Label')).toBeInTheDocument();
    expect(screen.getByTestId('SegmentedControl|Group')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('does not show a label if none exists', () => {
    render(<SegmentedControl {...props} label={null} />);

    expect(
      screen.queryByTestId('SegmentedControl|Label')
    ).not.toBeInTheDocument();
  });

  it('shows the correct button names', () => {
    render(<SegmentedControl {...props} label={null} />);

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('disables all buttons if props.isDisabled', () => {
    render(<SegmentedControl {...props} isDisabled />);

    expect(screen.getByText('One')).toBeDisabled();
    expect(screen.getByText('Two')).toBeDisabled();
    expect(screen.getByText('Three')).toBeDisabled();
  });

  describe('when the first button is selected', () => {
    it('applies correct styles', () => {
      const button = buttons[0];

      render(<SegmentedControl {...props} selectedButton={button.value} />);

      expect(screen.getByText('One')).toHaveStyle({ color: button.color });
      expect(screen.getByText('Two')).toHaveStyle({ color: colors.grey_200 });
      expect(screen.getByText('Three')).toHaveStyle({ color: colors.grey_200 });
    });
  });

  describe('when the second button is selected', () => {
    it('applies correct styles', () => {
      const button = buttons[1];

      render(<SegmentedControl {...props} selectedButton={button.value} />);

      expect(screen.getByText('One')).toHaveStyle({ color: colors.grey_200 });
      expect(screen.getByText('Two')).toHaveStyle({ color: button.color });
      expect(screen.getByText('Three')).toHaveStyle({ color: colors.grey_200 });
    });
  });

  describe('when prop `isDisabled` is truthy', () => {
    it('applies correct styles', () => {
      render(<SegmentedControl {...props} isDisabled />);

      expect(screen.getByText('One')).toHaveStyle({
        color: colors.grey_100_50,
      });
      expect(screen.getByText('Two')).toHaveStyle({
        color: colors.grey_100_50,
      });
      expect(screen.getByText('Three')).toHaveStyle({
        color: colors.grey_100_50,
      });
    });
  });

  describe('when the third button is selected and prop `isDisabled` is truthy', () => {
    it('applies correct styles', () => {
      const button = buttons[2];

      render(
        <SegmentedControl {...props} selectedButton={button.value} isDisabled />
      );

      expect(screen.getByText('One')).toHaveStyle({
        color: colors.grey_100_50,
      });
      expect(screen.getByText('Two')).toHaveStyle({
        color: colors.grey_100_50,
      });
      expect(screen.getByText('Three')).toHaveStyle({ color: button.color });
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<SegmentedControl {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<SegmentedControl {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
