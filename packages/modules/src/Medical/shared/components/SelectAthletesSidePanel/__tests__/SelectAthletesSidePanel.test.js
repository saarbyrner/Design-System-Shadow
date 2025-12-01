import { screen } from '@testing-library/react';

import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';

import SelectAthletesSidePanel from '../index';

describe('<SelectAthletesSidePanel />', () => {
  let props;

  beforeEach(() => {
    props = {
      initialDataRequestStatus: jest.fn(),
      isOpen: true,
      onClose: jest.fn(),
      onReview: jest.fn(),
      squadAthletes: [],
      t: i18nextTranslateStub(),
    };
  });

  test('renders the panel with the proper title', () => {
    renderWithUserEventSetup(<SelectAthletesSidePanel {...props} />);
    expect(screen.getByText('Select athletes')).toBeInTheDocument();
  });

  test('renders the correct content', () => {
    renderWithUserEventSetup(<SelectAthletesSidePanel {...props} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  test('calls the correct prop when Cancel is clicked', async () => {
    const { user } = renderWithUserEventSetup(
      <SelectAthletesSidePanel {...props} />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  test('disables the review button if nothing is selected', () => {
    renderWithUserEventSetup(<SelectAthletesSidePanel {...props} />);

    const reviewButton = screen.getByRole('button', { name: 'Review' });
    expect(reviewButton).toBeDisabled();
  });
});
