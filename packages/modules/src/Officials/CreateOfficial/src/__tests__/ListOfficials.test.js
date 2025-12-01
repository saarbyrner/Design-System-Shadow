import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import CreateOfficialApp from '../App';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const props = {
  t: i18nextTranslateStub(),
};

describe('<CreateOfficialAppApp/>', () => {
  it('renders', () => {
    renderWithProviders(<CreateOfficialApp {...props} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Create Official/i
    );
  });
});
