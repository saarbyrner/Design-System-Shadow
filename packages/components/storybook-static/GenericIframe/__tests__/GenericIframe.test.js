import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GenericIframe from '..';

describe('GenericIframe', () => {
  it('should render iframe', () => {
    render(<GenericIframe t={i18nextTranslateStub()} src="test/src" />);

    expect(screen.getByTitle('Iframe component')).toBeInTheDocument();
  });

  it('should render loading app status when iframe hasnt loaded and hide iframe', () => {
    render(<GenericIframe t={i18nextTranslateStub()} src="test/src" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTitle('Iframe component')).toHaveStyle({
      display: 'none',
    });
  });

  it('should not render loading app status when iframe has loaded and should show iframe', () => {
    render(<GenericIframe t={i18nextTranslateStub()} src="test/src" />);

    fireEvent.load(screen.getByTitle('Iframe component'));

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByTitle('Iframe component')).toHaveStyle({
      display: 'initial',
    });
  });

  it('should hide iframe if hide prop is passed', () => {
    render(<GenericIframe t={i18nextTranslateStub()} src="test/src" hide />);

    fireEvent.load(screen.getByTitle('Iframe component'));

    expect(screen.getByTitle('Iframe component')).toHaveStyle({
      display: 'none',
    });
  });

  it('should render AppStatus error type if props.hasErrored is true', async () => {
    render(
      <GenericIframe t={i18nextTranslateStub()} src="test/src" hasErrored />
    );

    fireEvent.load(screen.getByTitle('Iframe component'));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
