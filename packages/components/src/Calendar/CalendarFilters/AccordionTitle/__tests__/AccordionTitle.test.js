import { render, screen } from '@testing-library/react';
import AccordionTitle from '../index';
import { numberOfActiveFiltersTestId } from '../utils/consts';

describe('AccordionTitle', () => {
  const translatedTitle = 'Title';
  const numberOfActiveFilters = 2;
  const props = {
    translatedTitle,
    numberOfActiveFilters,
  };
  it('should render the component properly', () => {
    render(<AccordionTitle {...props} />);

    const title = screen.getByText(translatedTitle);
    expect(title).toBeInTheDocument();
    expect(title).toHaveStyle({ fontWeight: 600 });
    expect(screen.getByTestId(numberOfActiveFiltersTestId)).toHaveTextContent(
      numberOfActiveFilters
    );
  });

  it('should not mark the title in bold because there are no active filters', () => {
    render(<AccordionTitle {...props} numberOfActiveFilters={0} />);

    const title = screen.getByText(translatedTitle);
    expect(title).toBeInTheDocument();
    expect(title).not.toHaveStyle({ fontWeight: 600 });
    expect(screen.getByTestId(numberOfActiveFiltersTestId)).toHaveTextContent(
      0
    );
  });
});
