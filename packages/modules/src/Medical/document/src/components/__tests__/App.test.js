import { screen, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import getAthleteData from '@kitman/services/src/services/getAthleteData';
import getMedicalDocument from '@kitman/services/src/services/medical/getMedicalDocument';
import searchMedicalEntityAttachments from '@kitman/services/src/services/medical/searchMedicalEntityAttachments';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { entityAttachmentSearchResponse } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import { data as athleteDataResponse } from '@kitman/services/src/mocks/handlers/getAthleteData';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import App from '../App';

jest.mock('@kitman/services/src/services/getAthleteData');
jest.mock('@kitman/services/src/services/medical/getMedicalDocument');
jest.mock(
  '@kitman/services/src/services/medical/searchMedicalEntityAttachments'
);
jest.mock('@kitman/common/src/hooks/useLocationSearch');

describe('<App />', () => {
  const defaultProps = {
    documentId: 123,
    t: i18nextTranslateStub(),
  };

  const mockStore = storeFake({
    medicalDocument: {
      requestDocumentData: false,
    },
  });

  beforeEach(() => {
    searchMedicalEntityAttachments.mockReturnValue(
      entityAttachmentSearchResponse
    );
    getMedicalDocument.mockReturnValue({ document: documentData });
    getAthleteData.mockReturnValue(athleteDataResponse);
  });

  const renderComponent = (permissions = DEFAULT_CONTEXT_VALUE.permissions) => {
    render(
      <Provider store={mockStore}>
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              ...permissions,
            },
          }}
        >
          <App {...defaultProps} />
        </MockedPermissionContextProvider>
      </Provider>
    );
  };

  it('should render correct default content', async () => {
    renderComponent({
      medical: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical,
        documents: {
          ...DEFAULT_CONTEXT_VALUE.permissions.medical.documents,
          canView: true,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('AppHeader')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('tab', { name: 'Document Overview' })
    ).toBeInTheDocument();
  });

  it('should render PrintView', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('DocumentEntity|Header')).toBeInTheDocument();
    });
  });

  describe('Should use correct service', () => {
    beforeEach(() => {
      searchMedicalEntityAttachments.mockReturnValue(
        entityAttachmentSearchResponse
      );
      getMedicalDocument.mockReturnValue({ document: documentData });
      getAthleteData.mockReturnValue(athleteDataResponse);
    });

    it('should call searchMedicalEntityAttachments if not V2 Document', async () => {
      useLocationSearch.mockReturnValue(
        new URLSearchParams({ isV2Document: 'false' })
      );

      renderComponent();

      await waitFor(() => {
        expect(searchMedicalEntityAttachments).toHaveBeenCalled();
      });
    });

    it('should call getMedicalDocument if V2 Document', async () => {
      useLocationSearch.mockReturnValue(
        new URLSearchParams({ isV2Document: 'true' })
      );

      renderComponent();

      await waitFor(() => {
        expect(getMedicalDocument).toHaveBeenCalled();
      });
    });
  });
});
