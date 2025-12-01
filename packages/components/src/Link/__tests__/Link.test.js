import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import Link from '..';

describe('<Link /> component', () => {
  describe('when the link is outside the router context', () => {
    it('renders a regular anchor tag', () => {
      render(
        <Link href="/link_href" className="MyClassName">
          My Link
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/link_href');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My Link');
    });

    it('renders a regular anchor tag that will open in new tab', () => {
      render(
        <Link openInNewTab href="/link_href" className="MyClassName">
          My Link
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('openInNewTab');
      expect(link).toHaveAttribute('href', '/link_href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My Link');
    });

    it('renders a regular anchor tag with an external link', () => {
      render(
        <Link
          openInNewTab
          href="https://www.test.com"
          className="MyClassName"
          isExternalLink
        >
          My Link
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('isExternalLink');
      expect(link).toHaveAttribute('href', 'https://www.test.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My Link');
    });
  });

  describe('when the link is inside the router context', () => {
    it('renders a regular anchor tag', () => {
      render(
        <Router>
          <Link href="/link_href" className="MyClassName">
            My Link
          </Link>
        </Router>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/link_href');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My Link');
    });

    it('renders the target and rel attributes when openInNewTab passed', () => {
      render(
        <Router>
          <Link href="/link_href" className="MyClassName" openInNewTab>
            My Link
          </Link>
        </Router>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('openInNewTab');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders the an anchor when withHashParam is true', () => {
      render(
        <Router>
          <Link href="#" className="MyClassName" withHashParam>
            My hash Link
          </Link>
        </Router>
      );

      // Renders a regular anchor tag
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '#');
      expect(link).not.toHaveAttribute('withHashParam');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My hash Link');
    });

    it('renders a regular anchor tag with an external link', () => {
      render(
        <Router>
          <Link
            href="https://www.test.com"
            className="MyClassName"
            isExternalLink
          >
            My Link
          </Link>
        </Router>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('isExternalLink');
      expect(link).toHaveAttribute('href', 'https://www.test.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveClass('MyClassName');
      expect(link).toHaveTextContent('My Link');
    });
  });
});
