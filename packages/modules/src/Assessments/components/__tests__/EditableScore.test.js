import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableScore from '../EditableScore';

describe('EditableScore component', () => {
  const baseProps = {
    trainingVariableId: 1,
    organisationTrainingVariables: [
      {
        id: 53,
        training_variable: {
          id: 1,
          name: 'Mood',
          min: -2,
          max: 2,
        },
        scale_increment: '1',
      },
    ],
    score: 1,
    onChangeScore: jest.fn(),
  };

  beforeEach(() => {
    baseProps.onChangeScore.mockClear();
  });

  it('renders and displays the correct score value', () => {
    render(<EditableScore {...baseProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('populates the dropdown with the expected values after being opened', async () => {
    const user = userEvent.setup();
    render(<EditableScore {...baseProps} />);

    await user.click(screen.getByText('1'));

    expect(await screen.findByText('-2')).toBeInTheDocument();
    expect(await screen.findByText('0')).toBeInTheDocument();
    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  describe('When changing a score', () => {
    it('calls props.onChangeScore with the new value', async () => {
      const user = userEvent.setup();
      render(<EditableScore {...baseProps} />);

      await user.click(screen.getByText('1'));
      await user.click(await screen.findByText('-2'));

      expect(baseProps.onChangeScore).toHaveBeenCalledTimes(1);
      expect(baseProps.onChangeScore).toHaveBeenCalledWith(-2);
    });
  });

  describe('When clearing a score', () => {
    it('calls props.onChangeScore with null', async () => {
      const user = userEvent.setup();
      const { container } = render(<EditableScore {...baseProps} />);

      const clearIndicator = container.querySelector(
        '.kitmanReactSelect__clear-indicator'
      );
      await user.click(clearIndicator);

      expect(baseProps.onChangeScore).toHaveBeenCalledTimes(1);
      expect(baseProps.onChangeScore).toHaveBeenCalledWith(null);
    });
  });
});
