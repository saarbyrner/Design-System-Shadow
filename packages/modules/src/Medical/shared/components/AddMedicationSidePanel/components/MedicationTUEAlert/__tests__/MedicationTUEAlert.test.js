import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import MedicationTUEAlert from '../index';

const props = {
  isUnlistedMed: false,
  localDrugId: 31533,
  t: i18nextTranslateStub(),
};

describe('MedicationTUEAlert', () => {
  it('renders the correct text when isUnlistedMed is false', () => {
    render(<MedicationTUEAlert {...props} />);
    expect(
      screen.getByText(
        'This medication may contain banned substance(s) and may require a (TUE).'
      )
    ).toBeInTheDocument();
  });

  it('renders the correct text when isUnlistedMed is true', () => {
    render(<MedicationTUEAlert {...props} isUnlistedMed />);
    expect(
      screen.getByText(
        'Unlisted medications may contain banned substance(s) and may require a (TUE).'
      )
    ).toBeInTheDocument();
  });

  it('does not render when needsTUE is false', () => {
    render(<MedicationTUEAlert {...props} localDrugId={1} />);
    expect(
      screen.queryByText(
        'Unlisted medications may contain banned substance(s) and may require a (TUE).'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'This medication may contain banned substance(s) and may require a (TUE).'
      )
    ).not.toBeInTheDocument();
  });

  it('does render when drugName includes is Testosterone', () => {
    render(
      <MedicationTUEAlert
        {...props}
        localDrugId={1} // Not an id that would match drug list.
        drugName="something Testosterone" // But key word present
      />
    );
    expect(
      screen.queryByText(
        'Unlisted medications may contain banned substance(s) and may require a (TUE).'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'This medication may contain banned substance(s) and may require a (TUE).'
      )
    ).toBeInTheDocument();
  });
});
