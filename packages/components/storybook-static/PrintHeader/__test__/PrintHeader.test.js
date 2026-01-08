import { render, screen } from '@testing-library/react';
import PrintHeader from '..';

describe('<PrintHeader />', () => {
  const props = {
    logoPath: '',
    logoAlt: 'org logo',
    titleContent: (
      <div>
        <strong>Additional Title</strong>
        <div>Additional Subtitle</div>
      </div>
    ),
    items: [
      {
        title: 'Organisation',
        value: 'Sample Organisation',
      },
      {
        title: 'Squad',
        value: 'Custom Squad Name',
      },
      {
        title: 'Report by',
        value: 'Jon Doe',
      },
      {
        title: 'Report date',
        value: '20 Jul 2017 11:04 Am',
      },
    ],
  };

  it('renders the component', () => {
    render(<PrintHeader {...props} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('renders the correct number of items', () => {
    render(<PrintHeader {...props} />);
    expect(
      screen.getByRole('heading').querySelector('.printHeader__item')
    ).toBeInTheDocument();
  });

  it('when titleContent is provided it renders the correct header title', () => {
    render(<PrintHeader {...props} />);
    expect(
      screen.getByRole('heading').querySelector('.printHeader__container')
    ).toHaveTextContent('Additional Title');
  });

  it('when titleContent is provided it renders the correct subtitle', () => {
    render(<PrintHeader {...props} />);
    expect(
      screen.getByRole('heading').querySelector('.printHeader__container')
    ).toHaveTextContent('Additional Subtitle');
  });
});
