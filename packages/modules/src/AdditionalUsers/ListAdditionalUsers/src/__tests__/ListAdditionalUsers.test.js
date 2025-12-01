import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import ListAdditionalUsersApp from '../App';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const props = {
  t: i18nextTranslateStub(),
};

describe('<ListAdditionalUsersApp/>', () => {
  it('renders', () => {
    renderWithProviders(<ListAdditionalUsersApp {...props} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      /Manage Additional Users/i
    );
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Inactive' })).toBeInTheDocument();
  });
});
