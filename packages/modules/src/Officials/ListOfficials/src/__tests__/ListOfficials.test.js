import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import ListOfficialsApp from '../App';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const props = {
  t: i18nextTranslateStub(),
};

describe('<ListOfficialsAppApp/>', () => {
  it('renders', () => {
    renderWithProviders(<ListOfficialsApp {...props} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Manage Officials/i
    );
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Inactive' })).toBeInTheDocument();
  });
});
