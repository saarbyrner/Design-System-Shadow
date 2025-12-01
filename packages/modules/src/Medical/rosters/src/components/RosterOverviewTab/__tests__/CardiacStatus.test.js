import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { colors } from '@kitman/common/src/variables';
import CardiacStatus from '../CardiacStatus';

describe('<CardiacStatus />', () => {
  const i18nT = i18nextTranslateStub();

  const props = {
    cardiacStatus: {
      status: {
        value: 'complete',
        text: 'Complete',
      },
    },
    t: i18nT,
  };

  it('renders the component with correct status and text when status is Outstanding', () => {
    const { getByText, getByTestId } = render(
      <CardiacStatus
        {...props}
        cardiacStatus={{
          status: { value: 'outstanding', text: 'Outstanding' },
        }}
      />
    );

    // Test for the tag background color
    const textTag = getByTestId('TextTag');
    expect(textTag).toHaveStyle(`background-color: ${colors.red_100_20}`);

    // Test for the status icon
    const statusIcon = getByTestId('CardiacStatus|Icon');
    expect(statusIcon).toHaveClass('icon-warning-active');
    expect(statusIcon).toHaveStyle(`color: ${colors.red_200}`);

    // Test for the status text
    const statusText = getByText('Outstanding');
    expect(statusText).toBeInTheDocument();
  });

  it('renders the component with correct status and text when status is Expired', () => {
    const { getByText, getByTestId } = render(
      <CardiacStatus
        {...props}
        cardiacStatus={{
          status: { value: 'expired', text: 'Expired' },
          expiration_date: '2024-07-25',
        }}
      />
    );

    // Test for the tag background color
    const textTag = getByTestId('TextTag');
    expect(textTag).toHaveStyle(`background-color: ${colors.orange_100_20}`);

    // Test for the status icon
    const statusIcon = getByTestId('CardiacStatus|Icon');
    expect(statusIcon).toHaveClass('icon-warning-active');
    expect(statusIcon).toHaveStyle(`color: ${colors.orange_200}`);

    // Test for the status text
    const statusText = getByText('Expired - Jul 25, 2024');
    expect(statusText).toBeInTheDocument();
  });

  it('renders the component with correct status and text when status is Follow up required', () => {
    const { getByText, getByTestId } = render(
      <CardiacStatus
        {...props}
        cardiacStatus={{
          status: { value: 'follow_up_required', text: 'Follow up required' },
        }}
      />
    );

    // Test for the tag background color
    const textTag = getByTestId('TextTag');
    expect(textTag).toHaveStyle(`background-color: ${colors.orange_100_20}`);

    // Test for the status icon
    const statusIcon = getByTestId('CardiacStatus|Icon');
    expect(statusIcon).toHaveClass('icon-warning-active');
    expect(statusIcon).toHaveStyle(`color: ${colors.orange_200}`);

    // Test for the status text
    const statusText = getByText('Follow up required');
    expect(statusText).toBeInTheDocument();
  });

  it('renders the component with correct status and text when status is Expiring', () => {
    const { getByText, getByTestId } = render(
      <CardiacStatus
        {...props}
        cardiacStatus={{
          status: { value: 'expiring', text: 'Expiring' },
          expiration_date: '2024-07-25',
          expiration_days: 5,
        }}
      />
    );

    // Test for the tag background color
    const textTag = getByTestId('TextTag');
    expect(textTag).toHaveStyle(`background-color: ${colors.yellow_200}`);

    // Test for the status icon
    const statusIcon = getByTestId('CardiacStatus|Icon');
    expect(statusIcon).toHaveClass('icon-warning-active');
    expect(statusIcon).toHaveStyle(`color: ${colors.yellow_100}`);

    // Test for the status text
    const statusText = getByText('Expiring - 5 days');
    expect(statusText).toBeInTheDocument();
  });

  it('renders the component with correct status and text when status is Complete', () => {
    const { getByText, getByTestId } = render(
      <CardiacStatus
        {...props}
        cardiacStatus={{
          status: { value: 'complete', text: 'Complete' },
          completion_date: '2023-07-25',
        }}
      />
    );

    // Test for the tag background color
    const textTag = getByTestId('TextTag');
    expect(textTag).toHaveStyle(`background-color: ${colors.neutral_300}`);

    // Test for the status icon
    const statusIcon = getByTestId('CardiacStatus|Icon');
    expect(statusIcon).toHaveClass('icon-tick-active');

    // Test for the status text
    const statusText = getByText('Complete - Jul 25, 2023');
    expect(statusText).toBeInTheDocument();
  });
});
