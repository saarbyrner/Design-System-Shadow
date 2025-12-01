import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  mockedMedicalFlagContextValue,
  MockedMedicalFlagContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext/utils/mocks';

import AdditionalDetails from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
};

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const renderWithContext = () => {
  return render(
    <MockedPermissionContextProvider
      permissionsContext={mockedPermissionsContextValue}
    >
      <MockedMedicalFlagContextProvider
        medicalFlagContext={{
          ...mockedMedicalFlagContextValue,
        }}
      >
        <AdditionalDetails {...props} />
      </MockedMedicalFlagContextProvider>
    </MockedPermissionContextProvider>
  );
};

describe('AdditionalDetails', () => {
  beforeEach(() => {
    renderWithContext();
  });

  it('should render additional details section', async () => {
    const sectionElement = screen.getByTestId('MedicalFlag|AdditionalDetails');
    expect(sectionElement).toBeInTheDocument();
  });

  it('should display additional details correctly', async () => {
    const addedOnLabel = screen.getByText('Added on:');
    const addedOnValue = screen.getByText('Jan 1, 2023');
    expect(addedOnLabel).toBeInTheDocument();
    expect(addedOnValue).toBeInTheDocument();

    const addedByLabel = screen.getByText('Added by:');
    const addedByValue = screen.getByText('John Doe');
    expect(addedByLabel).toBeInTheDocument();
    expect(addedByValue).toBeInTheDocument();
  });
});
