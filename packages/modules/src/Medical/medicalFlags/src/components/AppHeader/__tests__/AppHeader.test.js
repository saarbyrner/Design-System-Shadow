import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockedMedicalFlagContextValue } from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext/utils/mocks';
import AppHeader from '@kitman/modules/src/Medical/medicalFlags/src/components/AppHeader';

const props = {
  t: i18nextTranslateStub(),
  athleteData: {
    ...mockedMedicalFlagContextValue.medicalFlag.athlete,
  },
  medicalFlag: mockedMedicalFlagContextValue.medicalFlag,
};

describe('<AppHeader/>', () => {
  it('renders header with athlete & medical flag display name', async () => {
    render(<AppHeader {...props} />);
    const medicalFlagHeader = screen.getByTestId('MedicalFlag|Header');

    expect(medicalFlagHeader).toBeInTheDocument();
    expect(await screen.findByText('John Doe: Asthma')).toBeInTheDocument();
  });
});
