/* eslint-disable no-shadow */
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../index';
import {
  uncheckedCheckmark,
  indeterminateCheckmark,
  checkedCheckmark,
  focusedCheckmark,
  disabledCheckmark,
  invalidCheckmark,
} from '../style';

describe('<Checkbox />', () => {
  const requiredProps = {
    id: '1',
    onClick: jest.fn(),
  };

  describe('when only required props are passed', () => {
    const renderDescribe = () => render(<Checkbox {...requiredProps} />);

    it('shows an unchecked checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(uncheckedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused unchecked checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused unchecked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} invalid />);

      it('shows an invalid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(invalidCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} disabled />);

      it('shows a disabled checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `name` is passed', () => {
    const name = 'checkbox';
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} name={name} />);

    it('shows a checkbox with `name` attribute equal to prop `name`', async () => {
      renderDescribe();

      expect(screen.getByRole('checkbox').name).toBe(name);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
    });
  });

  describe('when prop `checked` is truthy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} checked />);

    it('shows a checked checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeChecked();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(checkedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused checked checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...checkedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} checked invalid />);

      it('shows an invalid checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();
        expect(checkbox).toBeChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...checkedCheckmark,
          ...invalidCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} checked disabled />);

      it('shows a disabled checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toBeChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...checkedCheckmark,
          ...disabledCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `checked` is falsy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} checked={false} />);

    it('shows an unchecked checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(uncheckedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused unchecked checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused unchecked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} checked={false} invalid />);

      it('shows an invalid unchecked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...invalidCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} checked={false} disabled />);

      it('shows a disabled unchecked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `indeterminate` is truthy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} indeterminate />);

    it('shows a partially checked checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBePartiallyChecked();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(indeterminateCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused partially checked checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBePartiallyChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...indeterminateCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused partially checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBePartiallyChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} indeterminate invalid />);

      it('shows an invalid partially checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();
        expect(checkbox).toBePartiallyChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...indeterminateCheckmark,
          ...invalidCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} indeterminate disabled />);

      it('shows a disabled partially checked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toBePartiallyChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...indeterminateCheckmark,
          ...disabledCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `indeterminate` is falsy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} indeterminate={false} />);

    it('shows an unchecked checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(uncheckedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeEnabled();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with `prop id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused unchecked checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused unchecked checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).not.toBeChecked();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} indeterminate={false} invalid />);

      it('shows an invalid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();
        expect(checkbox).not.toBePartiallyChecked();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(invalidCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} indeterminate={false} disabled />);

      it('shows a disabled checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `disabled` is truthy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} disabled />);

    it('shows a disabled checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeDisabled();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(disabledCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('doesn’t call prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).not.toHaveBeenCalled();
      });

      it('shows an unfocused disabled checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).not.toHaveFocus();
        expect(checkbox).toBeDisabled();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('when a user tries to focus the component', () => {
      it('shows an unfocused disabled checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toHaveFocus();
        expect(checkbox).toBeDisabled();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} disabled invalid />);

      it('shows a disabled checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `disabled` is falsy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} disabled={false} />);

    it('shows an enabled checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeEnabled();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(uncheckedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox).toBeValid();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused enabled checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeEnabled();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle({
          ...uncheckedCheckmark,
          ...focusedCheckmark,
        });
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused enabled checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeEnabled();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeValid();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `invalid` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} disabled={false} invalid />);

      it('shows an invalid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeInvalid();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(invalidCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox).toBeEnabled();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `invalid` is truthy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} invalid />);

    it('shows an invalid checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeInvalid();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(invalidCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeEnabled();
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeInvalid();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).toBeEnabled();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeInvalid();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toBeEnabled();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} invalid disabled />);

      it('shows a disabled valid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toBeValid();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });

  describe('when prop `invalid` is falsy', () => {
    const renderDescribe = () =>
      render(<Checkbox {...requiredProps} invalid={false} />);

    it('shows a valid checkbox', async () => {
      renderDescribe();
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeValid();

      const checkmark = checkbox.parentNode.querySelector('span');
      expect(checkmark).toHaveStyle(uncheckedCheckmark);
    });

    it('doesn’t have an unexpected state', async () => {
      renderDescribe();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBePartiallyChecked();
      expect(checkbox.id).toBe(requiredProps.id);
      expect(checkbox.name).toBe(requiredProps.id);
    });

    describe('and when a user clicks the component', () => {
      it('calls prop `onClick` with prop `id`', async () => {
        const user = userEvent.setup();
        renderDescribe();

        await user.click(screen.getByRole('checkbox'));

        const onClick = requiredProps.onClick;
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(requiredProps.id);
      });

      it('shows a focused valid checkbox', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await user.click(checkboxWrapper);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeValid();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        const user = userEvent.setup();
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox.parentNode);

        expect(checkbox).toBeEnabled();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when a user focuses the component', () => {
      it('shows a focused valid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');
        const checkboxWrapper = checkbox.parentNode;

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toHaveFocus();
        expect(checkbox).toBeValid();

        const checkmark = checkboxWrapper.querySelector('span');
        expect(checkmark).toHaveStyle(focusedCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        await fireEvent.focus(checkbox.parentNode);

        expect(checkbox).toBeEnabled();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });

    describe('and when prop `disabled` is truthy', () => {
      const renderDescribe = () =>
        render(<Checkbox {...requiredProps} invalid={false} disabled />);

      it('shows a disabled valid checkbox', async () => {
        renderDescribe();
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toBeValid();

        const checkmark = checkbox.parentNode.querySelector('span');
        expect(checkmark).toHaveStyle(disabledCheckmark);
      });

      it('doesn’t have an unexpected state', async () => {
        renderDescribe();

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toHaveFocus();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBePartiallyChecked();
        expect(checkbox.id).toBe(requiredProps.id);
        expect(checkbox.name).toBe(requiredProps.id);
      });
    });
  });
});
