import { screen, render } from '@testing-library/react';

import OrganisationSelectOption from '..';

const props = {
  organisation: null,
};

describe('<OrganisationSelectOption/>', () => {
  it('does not render when org is null', () => {
    render(<OrganisationSelectOption {...props} />);
    const orgElement = screen.queryByText('org name');
    expect(orgElement).not.toBeInTheDocument();
  });

  it('renders', () => {
    render(
      <OrganisationSelectOption
        organisation={{
          id: 1,
          name: 'org name',
          logo_full_path: 'logo_full_path',
        }}
      />
    );
    expect(screen.getByText(/org name/i)).toBeInTheDocument();
  });
});
