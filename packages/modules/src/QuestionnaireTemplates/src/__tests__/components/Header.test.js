import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Header from '../../components/Header';

describe('Questionnaire Templates <Header /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      t: i18nextTranslateStub(),
      addTemplate: jest.fn(),
    };
    // Reset feature flag before each test
    window.featureFlags = {};
  });

  describe('when the "update-manage-forms" feature flag is OFF', () => {
    it('renders the PageHeader with an IconButton', () => {
      render(<Header {...baseProps} />);

      // It renders the old PageHeader style with an icon button
      expect(screen.getByRole('button')).toBeInTheDocument();
      // The text "Add Form" from the TextButton should not be present
      expect(screen.queryByText('Add Form')).not.toBeInTheDocument();
    });

    it('calls the addTemplate callback when the IconButton is clicked', async () => {
      render(<Header {...baseProps} />);

      const iconButton = screen.getByRole('button');

      await user.click(iconButton);

      expect(baseProps.addTemplate).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the "update-manage-forms" feature flag is ON', () => {
    beforeEach(() => {
      window.featureFlags['update-manage-forms'] = true;
    });

    it('renders the new Header with a TextButton', () => {
      render(<Header {...baseProps} />);

      // It renders the new style with a TextButton
      expect(
        screen.getByRole('button', { name: 'Add Form' })
      ).toBeInTheDocument();
      // The old IconButton should not be present
      expect(
        screen.queryByRole('button', { name: /add template/i })
      ).not.toBeInTheDocument();
    });

    it('calls the addTemplate callback when the TextButton is clicked', async () => {
      render(<Header {...baseProps} />);

      const textButton = screen.getByRole('button', { name: 'Add Form' });
      await user.click(textButton);

      expect(baseProps.addTemplate).toHaveBeenCalledTimes(1);
    });
  });
});
