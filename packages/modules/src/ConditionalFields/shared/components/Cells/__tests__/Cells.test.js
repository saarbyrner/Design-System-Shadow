import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  DefaultHeaderCell,
  CheckboxHeaderCell,
  TextCell,
  StatusCell,
  AvatarCell,
} from '../index';

describe('Cells', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('<DefaultHeaderCell>', () => {
    it('renders', () => {
      render(<DefaultHeaderCell title="Default header title" />);
      expect(screen.getByText(/Default header title/i)).toBeInTheDocument();
    });
  });

  describe('<TextCell>', () => {
    it('renders', () => {
      render(<TextCell text="Some text rendered" />);
      expect(screen.getByText(/Some text rendered/i)).toBeInTheDocument();
    });
  });

  describe('<CheckboxHeaderCell>', () => {
    const onChange = jest.fn();
    const props = {
      title: '',
      editMode: false,
      checked: false,
      indeterminate: false,
      onChange,
    };
    it('renders correctly', () => {
      render(<CheckboxHeaderCell {...props} title="Assigned" />);
      expect(screen.getByText('Assigned')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeDisabled();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders an enabled checkbox when editMode = true', () => {
      render(<CheckboxHeaderCell {...props} editMode />);
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    it('renders a checked checkbox when checked = true', () => {
      render(<CheckboxHeaderCell {...props} checked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders an indeterminate checkbox when indeterminate = true', () => {
      render(<CheckboxHeaderCell {...props} indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-indeterminate',
        'true'
      );
    });

    it('calls on change when checkbox is checked', async () => {
      const { rerender } = render(<CheckboxHeaderCell {...props} editMode />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);

      rerender(<CheckboxHeaderCell {...props} editMode checked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('<StatusCell>', () => {
    it('renders Draft status', () => {
      render(<StatusCell status="draft" statusText="Draft" />);
      expect(screen.getByText(/Draft/i)).toBeInTheDocument();
    });
    it('renders Active status', () => {
      render(<StatusCell status="active" statusText="Active" />);
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });
    it('renders Inactive status', () => {
      render(<StatusCell status="inactive" statusText="Inactive" />);
      expect(screen.getByText(/Inactive/i)).toBeInTheDocument();
    });
  });

  describe('<AvatarCell>', () => {
    it('renders', async () => {
      render(
        <AvatarCell
          avatar_url="kitman_logo_full_bleed.png"
          text="KL Galaxy"
          id={1}
        />
      );
      await waitFor(() => {
        expect(screen.getByText(/KL Galaxy/i)).toBeInTheDocument();
      });
    });
  });
});
