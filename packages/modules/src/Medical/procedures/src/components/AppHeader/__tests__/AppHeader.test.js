import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockedProcedureContextValue } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext/utils/mocks';
import AppHeader from '@kitman/modules/src/Medical/procedures/src/components/AppHeader';

const props = {
  t: i18nextTranslateStub(),
  athleteData: {
    ...mockedProcedureContextValue.procedure.athlete,
  },
  procedureType: mockedProcedureContextValue.procedure.procedure_type.name,
};

describe('<AppHeader/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-procedure'] = true;
    render(<AppHeader {...props} />);
  });

  afterEach(() => {
    window.featureFlags['medical-procedure'] = false;
  });

  it('renders header with athlete & procedure type', async () => {
    const proceduresHeader = screen.getByTestId('Procedures|Header');
    expect(proceduresHeader).toBeInTheDocument();

    expect(
      await screen.findByText('Alpha Alpha - My Type1')
    ).toBeInTheDocument();
  });
});
