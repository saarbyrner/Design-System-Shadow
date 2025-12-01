import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  mockedProcedureContextValue,
  MockedProcedureContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext/utils/mocks';
import Reason from '..';

const props = {
  t: i18nextTranslateStub(),
};

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      procedures: {
        canCreate: true,
        canView: true,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const renderWithContext = () => {
  return render(
    <MockedPermissionContextProvider
      permissionsContext={mockedPermissionsContextValue}
    >
      <MockedProcedureContextProvider
        procedureContext={{
          ...mockedProcedureContextValue,
          procedure: mockedProcedureContextValue.procedure,
        }}
      >
        <Reason {...props} />
      </MockedProcedureContextProvider>
    </MockedPermissionContextProvider>
  );
};

describe('<Reason/>', () => {
  beforeEach(() => {
    renderWithContext();
  });

  it('renders correct content', async () => {
    const reasonContainer = await screen.findByTestId(
      'ProcedureOverviewTab|Reason'
    );

    expect(reasonContainer).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Reason');
    expect(await screen.findByText('Procedure Reason 2')).toBeInTheDocument();
  });
});
