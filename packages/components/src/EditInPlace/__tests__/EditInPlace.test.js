import { render, screen, fireEvent } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import EditInPlace from '../index';

const componentSelector = (key) => `EditInPlace|${key}`;

describe('<EditInPlace />', () => {
  it('renders the title', () => {
    const value = 'TEST';
    render(<EditInPlace value={value} />);
    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(value);
  });

  it('should not render edit icon with editOnTextOnly false', () => {
    const value = 'TEST';
    const { container } = render(<EditInPlace value={value} editOnTextOnly />);

    const iconElement = container.querySelector('.icon-edit-name');
    expect(iconElement).not.toBeInTheDocument();
  });

  describe('When clicking the title', () => {
    it('renders the Input instead of the title', async () => {
      const value = 'TEST';
      render(<EditInPlace value={value} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      expect(
        screen.queryByRole('heading', { level: 6 })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the title value into the input value', async () => {
      const value = 'TEST';
      render(<EditInPlace value={value} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      expect(screen.getByRole('textbox')).toHaveValue(value);
    });
  });

  describe('When editing the input value', () => {
    it('updates the input value when input type is text', async () => {
      const value = 'TEST';
      render(<EditInPlace value={value} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const newValue = 'NEW_TEST';
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), newValue);
      expect(screen.getByRole('textbox')).toHaveValue(newValue);
    });

    it('updates the input value when input type is number', async () => {
      const value = 12345;
      render(<EditInPlace value={value} inputType="number" />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const inputElem = screen
        .getByTestId('EditInPlace|CommitChanges')
        .parentNode.querySelector('input');

      expect(inputElem).toHaveValue(12345);

      fireEvent.change(inputElem, { target: { value: 123456 } });

      expect(inputElem).toHaveValue(123456);
    });

    it('does not accept the wrong input type', async () => {
      const value = 12345;
      render(<EditInPlace value={value} inputType="number" />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const inputElem = screen
        .getByTestId('EditInPlace|CommitChanges')
        .parentNode.querySelector('input');

      fireEvent.change(inputElem, { target: { value: 'hello there' } });

      expect(inputElem).toHaveValue(null);
    });

    it('can save the value to the title and trigger onchange callback by clicking success', async () => {
      const value = 'TEST';
      const onChange = jest.fn();
      render(<EditInPlace value={value} onChange={onChange} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const newValue = 'NEW_TEST';
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), newValue);

      await userEvent.click(
        screen.getByTestId(componentSelector('CommitChanges'))
      );

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        newValue
      );
      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('can cancel any changes by clicking cancel button', async () => {
      const originalValue = 'TEST';
      const newValue = 'NEW_TEST';
      const onChange = jest.fn();
      render(<EditInPlace value={originalValue} onChange={onChange} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      await userEvent.type(screen.getByRole('textbox'), newValue);

      await userEvent.click(
        screen.getByTestId(componentSelector('CancelChanges'))
      );

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        originalValue
      );
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      expect(screen.getByRole('textbox')).toHaveValue(originalValue);
    });

    it('can save the value to the title and trigger onchange callback by typing enter', async () => {
      const value = 'TEST';
      const onChange = jest.fn();
      render(<EditInPlace value={value} onChange={onChange} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const newValue = 'NEW_TEST';
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), `${newValue}{enter}`);

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        newValue
      );
      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('can cancel any changes by typing escape', async () => {
      const originalValue = 'TEST';
      const onChange = jest.fn();
      render(<EditInPlace value={originalValue} onChange={onChange} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const newValue = 'NEW_TEST';
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), `${newValue}{escape}`);

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        originalValue
      );
    });
  });

  describe('When using a custom title renderer', () => {
    it('renders the title based on the output of the custom renderer function', () => {
      const value = 'TEST';
      const customTitleRender = (title) => `${title} (1)`;
      render(<EditInPlace value={value} titleRenderer={customTitleRender} />);

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        customTitleRender(value)
      );
    });

    it('renders the value only in the input box', async () => {
      const value = 'TEST';
      const customTitleRender = (title) => `${title} (1)`;
      render(<EditInPlace value={value} titleRenderer={customTitleRender} />);

      await userEvent.click(screen.getByRole('heading', { level: 6 }));
      expect(screen.getByRole('textbox')).toHaveValue(value);
    });

    it('can edit the value and the custom title is rendered, with only the value supplied to callback', async () => {
      const value = 'TEST';
      const onChange = jest.fn();
      const customTitleRender = (title) => `${title} (1)`;
      render(
        <EditInPlace
          value={value}
          onChange={onChange}
          titleRenderer={customTitleRender}
        />
      );

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const newValue = 'NEW_TEST';
      await userEvent.clear(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), newValue);

      await userEvent.click(
        screen.getByTestId(componentSelector('CommitChanges'))
      );

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        customTitleRender(newValue)
      );
      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it('doesnt call customTitleRender when input value is blank', async () => {
      const value = 'TEST';
      const newValue = 'NEW_TEST';
      const onChange = jest.fn();
      const customTitleRender = (title) => `${title} (2)`;
      render(
        <EditInPlace
          value={value}
          onChange={onChange}
          titleRenderer={customTitleRender}
        />
      );

      await userEvent.click(screen.getByRole('heading', { level: 6 }));

      const inputElem = screen
        .getByTestId('EditInPlace|CommitChanges')
        .parentNode.querySelector('input');

      expect(inputElem).toHaveValue(value);

      await userEvent.clear(inputElem);

      await userEvent.click(screen.getByTestId('EditInPlace|CommitChanges'));
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.type(inputElem, newValue);
      await userEvent.click(screen.getByTestId('EditInPlace|CommitChanges'));

      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        newValue
      );
    });
  });

  describe('When is invalid', () => {
    it('shows the correct styles', () => {
      const value = 'TEST';
      const { container } = render(<EditInPlace value={value} invalid />);

      expect(
        container.querySelector('.edit-in-place--invalid')
      ).toBeInTheDocument();
    });
  });
});
