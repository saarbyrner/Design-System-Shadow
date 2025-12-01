import { render, screen } from '@testing-library/react';
import SectionHeading from '../common/SectionHeading';

describe('<SectionHeading />', () => {
  const baseProps = { text: 'Heading' };

  it('renders the component', () => {
    render(<SectionHeading {...baseProps} />);
    expect(screen.getByText('Heading')).toBeInTheDocument();
  });

  it('renders the heading with the correct class names', () => {
    const { container } = render(<SectionHeading {...baseProps} />);

    const section = container.querySelector('[class$="-sectionHeading"]');
    expect(section).toBeInTheDocument();

    const headingText = container.querySelector('[class$="-headingText"]');
    expect(headingText).toBeInTheDocument();
    expect(headingText?.textContent).toBe('Heading');

    const secondary = container.querySelector(
      '[class$="-headingSecondaryText"]'
    );
    expect(secondary).not.toBeInTheDocument();
  });

  it('renders secondary text when provided', () => {
    const { container } = render(
      <SectionHeading {...baseProps} secondaryText="Secondary" />
    );

    const secondary = container.querySelector(
      '[class$="-headingSecondaryText"]'
    );
    expect(secondary).toBeInTheDocument();
    expect(secondary?.textContent).toBe('Secondary');
  });
});
