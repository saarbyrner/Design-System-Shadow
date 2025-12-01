import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Athletes from '..';

describe('<Athletes />', () => {
  const props = {
    athletes: [
      {
        id: 1,
        firstname: 'Joe',
        lastname: 'Bloggs',
        position: 'Forward',
        participation_level: 'partial',
      },
      {
        id: 2,
        firstname: 'Dave',
        lastname: 'Rave',
        position: 'Centre',
        participation_level: 'partial',
      },
      {
        id: 3,
        firstname: 'Penny',
        lastname: 'Lane',
        position: 'Defender',
        participation_level: 'modified',
      },
    ],
    t: i18nextTranslateStub(),
  };

  it('shows correctly formatted name and position', () => {
    render(<Athletes {...props} />);

    expect(screen.getByText('J. Bloggs - F')).toBeInTheDocument();
  });

  it('shows correct icon/class for partial participation level', () => {
    render(<Athletes {...props} />);

    expect(
      screen
        .getByText('D. Rave - C')
        .parentNode.querySelector('.athletesTemplate__iconArrowUp')
    ).toBeInTheDocument();
  });

  it('shows correct icon/class for modified participation level', () => {
    render(<Athletes {...props} />);

    expect(
      screen
        .getByText('P. Lane - D')
        .parentNode.querySelector('.athletesTemplate__iconCircle')
    ).toBeInTheDocument();
  });

  it('shows correct number of athletes', () => {
    render(<Athletes {...props} />);

    expect(
      screen
        .getByText('J. Bloggs - F')
        .parentNode.parentNode.querySelectorAll('.athletesTemplate__athlete')
    ).toHaveLength(3);
  });
});
