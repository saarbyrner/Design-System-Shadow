import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  mockedMedicalFlagContextValue,
  MockedMedicalFlagContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext/utils/mocks';

import MedicalFlagDetails from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  medicalFlag: mockedMedicalFlagContextValue.medicalFlag,
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
        <MedicalFlagDetails {...props} />
      </MockedMedicalFlagContextProvider>
    </MockedPermissionContextProvider>
  );
};

describe('MedicalFlagDetails', () => {
  beforeEach(() => {
    renderWithContext();
  });

  it('renders MedicalFlagDetails section', async () => {
    const sectionElement = screen.getByTestId('MedicalFlag|MedicalFlagDetails');
    expect(sectionElement).toBeInTheDocument();
  });

  it('renders the Header component', async () => {
    const headerElement = screen.getByRole('heading');
    const headingText = screen.getByText('Medical Alert details');
    expect(headerElement).toBeInTheDocument();
    expect(headingText).toBeInTheDocument();
  });

  it('should render the correct Medical Alert information', async () => {
    const medicalFlagTitle = screen.getByText('Alert title:');
    const medicalFlagTitleValue = screen.getByText('Asthma Title');
    expect(medicalFlagTitle).toBeInTheDocument();
    expect(medicalFlagTitleValue).toBeInTheDocument();

    const medicalFlagSeverity = screen.getByText('Severity:');
    const medicalFlagSeverityValue = screen.getByText('severe');
    expect(medicalFlagSeverity).toBeInTheDocument();
    expect(medicalFlagSeverityValue).toBeInTheDocument();

    const visibilityRestricted = screen.getByText('Visibility:');
    const visibilityRestrictedValue = screen.getByText('Default');
    expect(visibilityRestricted).toBeInTheDocument();
    expect(visibilityRestrictedValue).toBeInTheDocument();
  });
});
