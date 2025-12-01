import { render, fireEvent } from '@testing-library/react';
import useReadOnlyForm from '../useReadOnlyForm';

describe('useReadOnlyForm', () => {
  it('should disable and prevent clicks on form elements when enabled is true', () => {
    const TestComponent = () => {
      useReadOnlyForm({
        enabled: true,
        containerId: 'container',
      });

      return (
        <form id="container">
          <input type="text" />
          <button type="button">Click me</button>
        </form>
      );
    };

    const { getByRole } = render(<TestComponent />);

    const input = getByRole('textbox');
    const button = getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it('should not disable form elements when enabled is false', () => {
    const TestComponent = () => {
      useReadOnlyForm({
        enabled: false,
        containerId: 'container',
      });

      return (
        <form id="container">
          <input type="text" />
          <button type="button">Click me</button>
        </form>
      );
    };

    const { getByRole } = render(<TestComponent />);

    const input = getByRole('textbox');
    const button = getByRole('button');

    expect(input).toBeEnabled();
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(button).toBeEnabled();
  });

  it('should exclude specific elements from being disabled', () => {
    const TestComponent = () => {
      useReadOnlyForm({
        enabled: true,
        containerId: 'container',
        excludeSelectors: ['button'],
      });

      return (
        <form id="container">
          <input type="text" />
          <button type="button">Click me</button>
        </form>
      );
    };

    const { getByRole } = render(<TestComponent />);

    const input = getByRole('textbox');
    const button = getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(button).toBeEnabled();
  });
});
