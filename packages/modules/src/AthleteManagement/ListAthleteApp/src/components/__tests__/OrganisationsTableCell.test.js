import { screen, render } from '@testing-library/react';
import OrganisationsTableCell from '../OrganisationsTableCell';

const DUMMY_MULTI_TEAM = [
  {
    id: 1,
    logo_full_path:
      'https://kitman.imgix.net/klgalaxy/Los_Angeles_Galaxy_logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    name: "L'OM",
  },
  {
    id: 2,
    logo_full_path:
      'https://kitman.imgix.net/klsclub/klsclub.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    name: 'Bamford FC',
  },
  {
    id: 3,
    logo_full_path:
      'https://kitman.imgix.net/klgalaxy/Los_Angeles_Galaxy_logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    name: 'Spurs FC',
  },
  {
    id: 4,
    logo_full_path:
      'https://kitman.imgix.net/kltoronto/Toronto_FC_Logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    name: 'Kitman FC',
  },
  {
    id: 4,
    logo_full_path:
      'https://kitman.imgix.net/kltoronto/Toronto_FC_Logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    name: 'New York FC',
  },
];

describe('<OrganisationsTableCell>', () => {
  it('renders', () => {
    render(<OrganisationsTableCell organisations={DUMMY_MULTI_TEAM} />);

    expect(screen.getByTestId('AssignedTo|Avatars')).toBeInTheDocument();
    expect(screen.getByLabelText('Kitman FC')).toBeInTheDocument();
    expect(screen.getByLabelText('Spurs FC')).toBeInTheDocument();
    expect(screen.getByLabelText('Bamford FC')).toBeInTheDocument();
    expect(screen.getByLabelText("L'OM")).toBeInTheDocument();
  });

  it('renders + N, when the number of orgs exceeds 5', () => {
    const additionalData = [
      {
        id: 5,
        logo_full_path:
          'https://kitman.imgix.net/klgalaxy/Los_Angeles_Galaxy_logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
        name: 'Manchester United',
      },

      {
        id: 7,
        logo_full_path:
          'https://kitman.imgix.net/klgalaxy/Los_Angeles_Galaxy_logo.svg.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
        name: 'Madrid',
      },
    ];
    render(
      <OrganisationsTableCell
        organisations={[...DUMMY_MULTI_TEAM, ...additionalData]}
      />
    );

    expect(screen.getByLabelText("L'OM")).toBeInTheDocument();
    expect(screen.getByLabelText('Bamford FC')).toBeInTheDocument();
    expect(screen.getByLabelText('Spurs FC')).toBeInTheDocument();
    expect(screen.getByLabelText('Kitman FC')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('renders nothing, when there are no oganisations', () => {
    render(<OrganisationsTableCell organisations={[]} />);
    expect(screen.queryByTestId('AssignedTo|Avatars')).not.toBeInTheDocument();
  });
});
