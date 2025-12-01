import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { fireEvent, screen, within } from '@testing-library/react';
import SettingsForm from '../SettingsForm';
import { renderWithContext } from './testUtils';

describe('<SettingsForm />', () => {
  const i18nT = i18nextTranslateStub();
  const defaultProps = {
    t: i18nT,
  };
  it('renders with correct fields', () => {
    renderWithContext(<SettingsForm {...defaultProps} />);

    expect(screen.queryByLabelText('Orientation')).toBeInTheDocument();
    expect(screen.queryByLabelText('Page Size')).toBeInTheDocument();
  });

  describe('for the orientation field', () => {
    it('has portrait selected by default', () => {
      renderWithContext(<SettingsForm {...defaultProps} />);

      const orientationField = screen.queryByLabelText('Orientation');

      // Portrait selected by default
      expect(orientationField).toHaveTextContent('Portrait');
    });

    it('can select landscape', async () => {
      renderWithContext(<SettingsForm {...defaultProps} />);

      const orientationField = screen.queryByLabelText('Orientation');

      fireEvent.mouseDown(orientationField);

      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/landscape/i));

      // Portrait selected by default
      expect(orientationField).toHaveTextContent('Landscape');
    });
  });

  describe('for the page size field', () => {
    it('has a4 selected by default', () => {
      renderWithContext(<SettingsForm {...defaultProps} />);

      const pagesField = screen.queryByLabelText('Page Size');

      // Portrait selected by default
      expect(pagesField).toHaveTextContent('A4');
    });

    it('can select us letter', async () => {
      renderWithContext(<SettingsForm {...defaultProps} />);

      const pageField = screen.queryByLabelText('Page Size');

      fireEvent.mouseDown(pageField);

      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/us letter/i));

      // Portrait selected by default
      expect(pageField).toHaveTextContent('US Letter');
    });
  });
});
