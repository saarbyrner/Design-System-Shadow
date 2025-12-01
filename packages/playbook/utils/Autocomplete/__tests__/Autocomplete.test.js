import { render, screen } from '@testing-library/react';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';

describe('Autocomplete utils', () => {
  describe('renderInput', () => {
    const label = 'Athletes';
    const helperText = 'Select an athlete';

    it('renders correctly', () => {
      render(
        renderInput({
          params: { InputProps: { endAdornment: null } },
          label,
        })
      );
      expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
    });

    it('renders correctly with helperText', () => {
      render(
        renderInput({
          params: { InputProps: { endAdornment: null } },
          label,
          helperText,
        })
      );
      expect(screen.getByText('Select an athlete')).toBeInTheDocument();
    });
  });

  describe('renderCheckboxes', () => {
    it('renders unselected state correctly', () => {
      render(
        renderCheckboxes(
          {},
          { id: 'some id', label: 'some label' },
          { selected: false }
        )
      );

      expect(screen.getByText('some label')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders selected state correctly', () => {
      render(
        renderCheckboxes(
          {},
          { id: 'some id', label: 'some label' },
          { selected: true }
        )
      );

      expect(screen.getByText('some label')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });
});
