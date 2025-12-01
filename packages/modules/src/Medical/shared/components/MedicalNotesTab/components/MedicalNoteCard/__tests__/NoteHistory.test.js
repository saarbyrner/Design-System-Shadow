import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockMedicalVersions } from '../mocks';

import NoteHistory from '../NoteHistory';

describe('<NoteHistory/>', () => {
  const props = {
    history: [MockMedicalVersions[0]],
    t: i18nextTranslateStub(),
  };

  it('renders the default content', () => {
    render(<NoteHistory {...props} />);
    expect(screen.getByTestId('NoteHistory|root')).toBeInTheDocument();
    expect(screen.getByTestId('NoteHistory|title')).toBeInTheDocument();
    expect(screen.getByTestId('NoteHistory|title')).toHaveTextContent(
      '1 edit since creation'
    );
  });

  it('updates the title when expanded', async () => {
    render(<NoteHistory {...props} />);
    const accordionTitle = screen.getByTestId('NoteHistory|title');
    await userEvent.click(accordionTitle);
    expect(accordionTitle).toHaveTextContent('Hide edits');
  });
});
