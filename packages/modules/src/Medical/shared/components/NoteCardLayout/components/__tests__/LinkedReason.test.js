import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LinkedReason from '../LinkedReason';

describe('<LinkedReason/>', () => {
  const props = {
    reason: {
      id: 2,
      name: 'Concussion',
    },
    t: i18nextTranslateStub(),
  };

  it('renders successfully', () => {
    render(<LinkedReason {...props} />);
    expect(screen.getByRole('heading')).toHaveTextContent(/Reason/);
    expect(screen.getByTestId('LinkedReason|LinkedReason')).toHaveTextContent(
      'Concussion'
    );
  });
});
