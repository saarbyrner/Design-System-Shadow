import { render, screen } from '@testing-library/react';
import ResultGroupHeader from '../../components/ResultGroupHeader';

describe('<ResultGroupHeader />', () => {
  it('renders title and subtitle when both present', () => {
    render(
      <table>
        <tbody>
          <ResultGroupHeader title="Title" subtitle="Subtitle" />
        </tbody>
      </table>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText(/Subtitle$/)).toBeInTheDocument();
  });

  it("doesn't render subtitle when it's undefined", () => {
    render(
      <table>
        <tbody>
          <ResultGroupHeader title="Title" />
        </tbody>
      </table>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    const subtitle = screen.queryByText(/Subtitle$/);
    expect(subtitle).not.toBeInTheDocument();
  });
});
