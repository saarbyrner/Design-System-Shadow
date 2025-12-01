import { render, screen } from '@testing-library/react';

import DetailCardLayout from '../index';

describe('<DetailCardLayout/>', () => {
  it('renders the <DetailCardLayout/> component and children correctly', () => {
    render(
      <DetailCardLayout>
        <div>DetailCardLayout</div>
        <DetailCardLayout.Title>
          <div>DetailCardLayout.Title</div>
        </DetailCardLayout.Title>
        <DetailCardLayout.Item label="my label" value="my value" />
      </DetailCardLayout>
    );

    expect(screen.getByText('DetailCardLayout')).toBeInTheDocument();
    expect(screen.getByText('DetailCardLayout.Title')).toBeInTheDocument();
    expect(screen.getByText('my label:')).toBeInTheDocument();
    expect(screen.getByText('my value')).toBeInTheDocument();
  });
});
