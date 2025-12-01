import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import DeleteGuardianModal from '../Components/DeleteGuardianModal';

const mockGuardianData = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

describe('<DeleteGuardianModal />', () => {
  let baseProps;
  const initialState = {
    athleteProfile: {
      guardiansTabSlice: {
        deleteGuardianModal: {
          form: {
            ...mockGuardianData,
          },
        },
      },
    },
  };

  beforeEach(() => {
    baseProps = {
      isOpen: true,
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders guardian modal with correct details', () => {
    renderWithRedux(<DeleteGuardianModal {...baseProps} />);

    expect(screen.getByText('Delete guardian')).toBeInTheDocument();
  });

  it('calls onClose when clicking on the cancel button', async () => {
    const user = userEvent.setup();
    renderWithRedux(<DeleteGuardianModal {...baseProps} />, {
      initialState,
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
