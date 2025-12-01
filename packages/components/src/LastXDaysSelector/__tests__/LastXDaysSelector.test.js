import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LastXDaysSelector from '../index';

describe('LastXDaysSelector component', () => {
  const onClick = jest.fn();
  let props;

  beforeEach(() => {
    props = {
      onChange: onClick,
      t: (key) => key, // i18n stub
      kitmanDesignSystem: false,
    };
  });

  it('fires the correct callback onClick', async () => {
    render(<LastXDaysSelector {...props} />);
    await userEvent.click(screen.getByText('Weeks'));
    expect(onClick).toHaveBeenCalledWith('');
  });

  it('adds a custom class if provided', () => {
    const testclass = 'testClass';
    props.customClass = testclass;
    const { container } = render(<LastXDaysSelector {...props} />);
    expect(container.getElementsByClassName(testclass)).toHaveLength(1);
  });

  it('prepopulates custom time period field if value provided', () => {
    render(<LastXDaysSelector {...props} periodLength={5} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(5);
  });

  describe('When "weeks" is selected', () => {
    it('displays the correct value in the input', async () => {
      render(<LastXDaysSelector {...props} periodLength={21} />);
      await userEvent.click(screen.getByText('Weeks'));
      expect(screen.getByRole('spinbutton')).toHaveValue(21);
    });
  });

  describe('when it is invalid', () => {
    it('returns the correct classes if it has a custom class too', () => {
      const { container } = render(
        <LastXDaysSelector {...props} customClass="customClass" invalid />
      );
      expect(container.getElementsByClassName('customClass')).toHaveLength(1);
      expect(
        container.getElementsByClassName('lastXDaysSelector--invalid')
      ).toHaveLength(1);
    });

    it('returns the correct --invalid class', () => {
      const { container } = render(<LastXDaysSelector {...props} invalid />);
      expect(
        container.getElementsByClassName('lastXDaysSelector--invalid')
      ).toHaveLength(1);
    });
  });

  describe('when props.kitmanDesignSystem is true', () => {
    it('displays an InputTextField with the correct label', () => {
      render(<LastXDaysSelector {...props} kitmanDesignSystem />);
      expect(screen.getByLabelText('Last')).toBeInTheDocument();
    });

    it('has the correct class for the radio button options', () => {
      const { container } = render(
        <LastXDaysSelector {...props} kitmanDesignSystem />
      );
      expect(
        container.getElementsByClassName(
          'lastXDaysSelector__options--kitmanDesignSystem'
        )
      ).toHaveLength(1);
    });
  });
});
