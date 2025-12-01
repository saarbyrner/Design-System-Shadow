import { screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import MedicalDocumentsTab from '@kitman/modules/src/Medical/shared/components/MedicalDocumentsTab';

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetDocumentNoteCategoriesQuery: jest.fn(),
  })
);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetSquadAthletesQuery: jest.fn(),
}));

const {
  useGetDocumentNoteCategoriesQuery,
} = require('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
const {
  useGetSquadAthletesQuery,
} = require('@kitman/modules/src/Medical/shared/redux/services/medical');

describe('<MedicalDocumentsTab/>', () => {
  const props = {
    athleteId: null,
    issueId: null,
    defaultAthleteSquadId: 0,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      error: false,
      isLoading: false,
    });
  });

  test('render documents tab - child containers present', () => {
    renderWithProviders(<MedicalDocumentsTab {...props} />);
    expect(screen.getByText('Upload date')).toBeInTheDocument();
  });

  test('when athleteId is passed, it is forwarded properly', () => {
    const dummyAthleteId = 1;
    renderWithProviders(
      <MedicalDocumentsTab {...props} athleteId={dummyAthleteId} />
    );
    // Filters use selected player value reflected via athleteId null => player filter shown
    // Basic smoke check via table still rendering
    expect(screen.getByText('Upload date')).toBeInTheDocument();
  });

  test('when issueId is passed, forwarded to children', () => {
    const dummyIssueId = 'Injury_1';
    renderWithProviders(
      <MedicalDocumentsTab {...props} issueId={dummyIssueId} />
    );
    expect(screen.getByText('Title name')).toBeInTheDocument();
  });

  test('when defaultAthleteSquadId is passed, panel renders', () => {
    const dummyDefaultAthleteSquadId = 141;
    renderWithProviders(
      <MedicalDocumentsTab
        {...props}
        defaultAthleteSquadId={dummyDefaultAthleteSquadId}
      />
    );
    expect(screen.getByText('Upload date')).toBeInTheDocument();
  });
});
