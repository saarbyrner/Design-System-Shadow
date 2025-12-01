import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import { data as mockedDisciplineCompetitions } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_competitions';
import {
  getCurrentDisciplinaryIssue,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { useFetchDisciplineCompetitionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { issue as mockedIssue } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/discipline_issue.mock';
import {
  UPDATE_DISCIPLINARY_ISSUE,
  CREATE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import DisciplineCompetitionDropdown from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getCurrentDisciplinaryIssue: jest.fn(),
    getDisciplinaryIssueMode: jest.fn(),
  })
);
const i18nT = i18nextTranslateStub();

setI18n(i18n);
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});
const defaultStore = {};
const props = {
  t: i18nT,
  id: 'discipline-competition-test',
  label: 'Competition Dropdown',
  selectedDisciplineCompetitions: [],
  onChange: () => {},
};

const mockSelectors = ({ issue = null, mode = CREATE_DISCIPLINARY_ISSUE }) => {
  getCurrentDisciplinaryIssue.mockReturnValue(issue);
  getDisciplinaryIssueMode.mockReturnValue(mode);
};

describe('<DisciplineCompetitionDropdown />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFetchDisciplineCompetitionsQuery.mockReturnValue({
      data: mockedDisciplineCompetitions,
      isFetching: false,
    });
    mockSelectors({ issue: mockedIssue });
  });

  it('renders successfully', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <DisciplineCompetitionDropdown {...props} />
      </Provider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('fetches and displays disciplinary competitions', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={storeFake(defaultStore)}>
        <DisciplineCompetitionDropdown {...props} />{' '}
      </Provider>
    );
    const dropdown = screen.getByRole('button');
    await waitFor(() =>
      expect(useFetchDisciplineCompetitionsQuery).toHaveBeenCalled()
    );
    // Clicking the dropdown shows options in DOM
    user.click(dropdown);
    expect(await screen.findByText('GA Cup')).toBeInTheDocument();
  });

  it('calls onChange when a competition is selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(
      <Provider store={storeFake(defaultStore)}>
        <DisciplineCompetitionDropdown {...props} onChange={mockOnChange} />
      </Provider>
    );
    const dropdown = screen.getByRole('button');
    await waitFor(() =>
      expect(useFetchDisciplineCompetitionsQuery).toHaveBeenCalled()
    );
    await user.click(dropdown);
    await user.click(await screen.findByText('GA Cup'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('selects all competitions by default in update mode if none are selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    mockSelectors({
      issue: { ...mockedIssue, competition_ids: [] },
      mode: UPDATE_DISCIPLINARY_ISSUE,
    });
    render(
      <Provider store={storeFake(defaultStore)}>
        <DisciplineCompetitionDropdown {...props} onChange={mockOnChange} />
      </Provider>
    );
    await waitFor(() =>
      expect(useFetchDisciplineCompetitionsQuery).toHaveBeenCalled()
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      mockedDisciplineCompetitions.map((competition) => competition.id)
    );

    // Open dropdown and click "Select All" to deselect all
    const dropdown = screen.getByRole('button');
    await user.click(dropdown);
    const selectAllCheckbox = screen.getByText('Select all');
    await user.click(selectAllCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith([1, 2]);

    // Click "Select All" again to reselect all
    await user.click(selectAllCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith(
      mockedDisciplineCompetitions.map((competition) => competition.id)
    );
  });
});
