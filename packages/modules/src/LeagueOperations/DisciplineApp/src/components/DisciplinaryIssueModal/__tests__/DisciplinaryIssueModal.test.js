import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { axios } from '@kitman/common/src/utils/services';
import {
  getIsCreateModalOpen,
  getIsUpdateModalOpen,
  getCurrentDisciplinaryIssue,
  getDisciplineProfile,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { issue as mockedIssue } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';
import createDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/services/createDisciplinaryIssue';
import updateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/services/updateDisciplinaryIssue';
import {
  REDUCER_KEY as DISCIPLINARY_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  UPDATE_DISCIPLINARY_ISSUE,
  CREATE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import DisciplinaryIssueModal from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getIsCreateModalOpen: jest.fn(),
    getIsUpdateModalOpen: jest.fn(),
    getDisciplineProfile: jest.fn(),
    getCurrentDisciplinaryIssue: jest.fn(),
    getDisciplinaryIssueMode: jest.fn(),
  })
);

const props = {
  t: i18nT,
};

const mockSelectors = ({
  isCreateOpen = false,
  isUpdateOpen = false,
  profile = null,
  issue = null,
  mode = CREATE_DISCIPLINARY_ISSUE,
}) => {
  getIsCreateModalOpen.mockReturnValue(isCreateOpen);
  getIsUpdateModalOpen.mockReturnValue(isUpdateOpen);
  getDisciplineProfile.mockReturnValue(profile);
  getCurrentDisciplinaryIssue.mockReturnValue(issue);
  getDisciplinaryIssueMode.mockReturnValue(mode);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [DISCIPLINARY_SLICE]: initialState,
};

const expectedText =
  'Morten Gamst Pedersen will be suspended for 32 days from October 19, 2024 to November 19, 2024 and unable to play in games. The suspension is inclusive of the start and end dates.';

const createResponse = { message: 'Discipline created' };
const updateResponse = { message: 'Discipline updated' };

describe('<DisciplinaryIssueModal/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({
        isCreateOpen: false,
        isUpdateOpen: false,
        profile: { id: 1, name: 'Test User' },
        issue: mockedIssue,
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <DisciplinaryIssueModal {...props} />
        </Provider>
      );
    });
    it('does not render', () => {
      expect(() => screen.getByText('Suspend user?')).toThrow();
    });
  });

  describe('IS OPEN', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders the create modal', () => {
      mockSelectors({
        isCreateOpen: true,
        issue: mockedIssue,
        profile: {
          id: 1,
          name: 'Morten Gamst Pedersen',
        },
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <DisciplinaryIssueModal {...props} />
        </Provider>
      );
      expect(screen.getByText('Suspend user?')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Suspend')).toBeInTheDocument();
    });

    it('renders the update modal', () => {
      mockSelectors({
        isUpdateOpen: true,
        issue: mockedIssue,
        profile: { id: 1, name: 'Morten Gamst Pedersen' },
        mode: UPDATE_DISCIPLINARY_ISSUE,
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <DisciplinaryIssueModal {...props} />
        </Provider>
      );
      expect(screen.getByText('Suspension edits')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Suspend')).toBeInTheDocument();
    });
    it('renders modal text correctly', () => {
      mockSelectors({
        isUpdateOpen: true,
        issue: mockedIssue,
        profile: { id: 1, name: 'Morten Gamst Pedersen' },
        mode: UPDATE_DISCIPLINARY_ISSUE,
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <DisciplinaryIssueModal {...props} />
        </Provider>
      );
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
    describe('form was completed correctly', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });
      it('should call the create disciplinary issue endpoint with the correct payload', async () => {
        mockSelectors({
          isCreateOpen: true,
          issue: mockedIssue,
          profile: {
            id: 1,
            name: 'Morten Gamst Pedersen',
          },
        });

        const createDisciplinaryIssueRequest = jest
          .spyOn(axios, 'post')
          .mockImplementation(() => Promise.resolve({ data: createResponse }));
        const issue = getCurrentDisciplinaryIssue();
        const result = await createDisciplinaryIssue(issue);
        expect(createDisciplinaryIssueRequest).toHaveBeenCalledWith(
          `/discipline/create`,
          mockedIssue
        );
        expect(result).toEqual(createResponse);
      });

      it('should call the update disciplinary issue endpoint with the correct payload', async () => {
        mockSelectors({
          isUpdateOpen: true,
          issue: mockedIssue,
          profile: {
            id: 1,
            name: 'Morten Gamst Pedersen',
          },
          mode: UPDATE_DISCIPLINARY_ISSUE,
        });

        const updateDisciplinaryIssueRequest = jest
          .spyOn(axios, 'put')
          .mockImplementation(() => Promise.resolve({ data: updateResponse }));
        const issue = getCurrentDisciplinaryIssue();
        const result = await updateDisciplinaryIssue(issue);

        expect(updateDisciplinaryIssueRequest).toHaveBeenCalledWith(
          `/discipline/update`,
          mockedIssue
        );
        expect(result).toEqual(updateResponse);
      });
    });
  });
});
