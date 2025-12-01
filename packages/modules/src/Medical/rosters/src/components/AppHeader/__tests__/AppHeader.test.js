import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AppHeader from '../index'; // Adjust the import path as needed

describe('<AppHeader />', () => {
  it('renders the main heading', () => {
    const props = {
      t: i18nextTranslateStub(),
    };

    // 1. Render the component
    render(<AppHeader {...props} />);

    // 2. Find the header by its accessible role and name (the text it displays).
    const heading = screen.getByRole('heading', { name: /medical/i });

    // 3. Assert that the heading is present in the document.
    expect(heading).toBeInTheDocument();
  });
});
