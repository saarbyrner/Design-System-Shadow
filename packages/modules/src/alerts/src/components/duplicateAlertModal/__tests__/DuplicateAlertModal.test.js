import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import DuplicateAlertModal from '../index';

describe('<DuplicateAlertModal />', () => {
  let baseProps;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      t: i18nextTranslateStub(),
      isOpen: true,
      onClose: jest.fn(),
      onSave: jest.fn(),
      fetchSquads: jest.fn(),
      squads: [
        { id: 1, name: 'First Team' },
        { id: 2, name: 'U-23s' },
      ],
      activeSquad: { id: 1, name: 'First Team' },
    };
  });

  it('renders and displays the correct title', () => {
    render(<DuplicateAlertModal {...baseProps} />);

    expect(screen.getByText('Duplicate Alert')).toBeInTheDocument();
  });

  it('renders the primary action button', () => {
    render(<DuplicateAlertModal {...baseProps} />);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls the onClose callback when the close button is clicked', async () => {
    render(<DuplicateAlertModal {...baseProps} />);

    const closeButton = screen.getByText('Cancel');

    await user.click(closeButton);

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
