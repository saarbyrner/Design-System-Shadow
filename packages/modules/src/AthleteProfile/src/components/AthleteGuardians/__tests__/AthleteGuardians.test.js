import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import GuardiansTab from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians';

describe('<AthleteGuardians />', () => {
  it('renders the header component', () => {
    renderWithRedux(<GuardiansTab />);

    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders the list of guardians table', () => {
    renderWithRedux(<GuardiansTab />);

    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
