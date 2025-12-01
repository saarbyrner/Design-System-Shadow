import { render, screen } from '@testing-library/react';
import LoadingSpinner from '..';

describe('<LoadingSpinner />', () => {
  const props = {
    size: 16,
    strokeWidth: 2,
    color: 'red',
  };

  it('sets the correct size of the spinner when size is set', () => {
    render(<LoadingSpinner {...props} size={16} />);

    expect(screen.getByRole('progressbar').querySelector('svg')).toHaveStyle({
      width: '16px',
      height: '16px',
    });
  });

  it('sets the correct stroke colour when colour is set', () => {
    render(<LoadingSpinner {...props} color="#f1f2f3" />);

    expect(screen.getByRole('progressbar').querySelector('circle')).toHaveStyle(
      {
        stroke: '#f1f2f3',
      }
    );
  });

  it('sets the correct stroke width when strokeWidth is set', () => {
    render(<LoadingSpinner {...props} strokeWidth={9} />);

    expect(
      screen.getByRole('progressbar').querySelector('circle')
    ).toHaveAttribute('stroke-width', '9');
  });

  it('sets the custom styles on wrpapper when styles.loadingSpinner is set', () => {
    render(
      <LoadingSpinner
        {...props}
        styles={{ loadingSpinner: { border: '3px solid yellow' } }}
      />
    );

    expect(screen.getByRole('progressbar')).toHaveStyle({
      border: '3px solid yellow',
    });
  });

  it('sets the custom styles on svg when styles.svg is set', () => {
    render(
      <LoadingSpinner
        {...props}
        styles={{ svg: { border: '2px solid green' } }}
      />
    );

    expect(screen.getByRole('progressbar').querySelector('svg')).toHaveStyle({
      border: '2px solid green',
    });
  });
});
