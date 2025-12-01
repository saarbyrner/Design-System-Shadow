import { render, screen } from '@testing-library/react';

import Athlete from '../Athlete';

describe('<Athlete/>', () => {
  const props = {
    avatarUrl: 'avatar_url',
    fullname: 'fullname',
    annotationableId: 1,
  };

  test('renders successfully', () => {
    render(<Athlete {...props} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'avatar_url');
    expect(screen.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/medical/athletes/1'
    );
  });
});
