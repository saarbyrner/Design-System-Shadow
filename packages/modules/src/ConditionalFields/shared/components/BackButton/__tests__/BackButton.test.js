import { act, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import BackButton from '..';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<BackButton />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('renders', async () => {
    await act(async () => {
      await renderWithProviders(<BackButton {...props} />);
    });

    await expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });
  it('render text content when passed into props', async () => {
    await act(async () => {
      await renderWithProviders(
        <BackButton {...props} text="My button text" />
      );
    });

    await expect(screen.getByText(/My button text/i)).toBeInTheDocument();
  });
});
