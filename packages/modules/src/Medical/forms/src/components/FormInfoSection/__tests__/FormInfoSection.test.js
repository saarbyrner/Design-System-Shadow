import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormInfoSection from '../index';
import formInfoMock from '../../../mocks/formInfoMock';

describe('<FormInfoSection />', () => {
  const props = {
    formInfo: formInfoMock,
    t: i18nextTranslateStub(),
  };

  it('renders the expected form details', () => {
    render(<FormInfoSection {...props} />);

    // Best practice: Find the list and then query within it.
    // This ensures the items we find are part of the correct section.
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    // `within` allows us to scope our queries to just this list element.
    const listItems = within(list).getAllByRole('listitem');

    // Assert that we have the correct number of list items
    expect(listItems).toHaveLength(2);

    // Assert the content of each list item.
    // Using a regex with /i makes the check case-insensitive and robust.
    expect(listItems[0]).toHaveTextContent(
      /Form completed:.*July 12, 2022 12:00 AM/i
    );
    expect(listItems[1]).toHaveTextContent('Completed by: Stefano Santomauro');
  });
});
