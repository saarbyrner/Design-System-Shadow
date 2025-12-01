import { render, screen } from '@testing-library/react';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import Club from '..';

describe('Club', () => {
  const renderComponent = (props = {}) => {
    return render(
      <LocalizationProvider>
        <Club {...props} />
      </LocalizationProvider>
    );
  };
  it('renders correctly', () => {
    renderComponent({ imageSrc: 'image_url', name: 'Manchester' });
    expect(screen.getByText('Manchester')).toBeInTheDocument();
    expect(screen.getByAltText('Manchester flag')).toBeInTheDocument();
  });

  it('fallbacks to the crest image when imageSrc is empty', () => {
    renderComponent({ name: 'Manchester' });
    expect(screen.getByText('Manchester')).toBeInTheDocument();
    expect(screen.queryByAltText('Manchester flag')).not.toBeInTheDocument();
    expect(screen.getByTestId('crest')).toBeInTheDocument();
  });
});
