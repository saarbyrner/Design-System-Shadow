import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { data as mockedDisciplineReasons } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_reasons';
import fetchDisciplineReasons from '@kitman/modules/src/LeagueOperations/shared/services/fetchDisciplineReasons';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DisciplineReasonsDropdown from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/services/fetchDisciplineReasons'
);

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const props = {
  t: i18nT,
  id: 'discipline-test',
  label: 'Discipline Test Dropdown',
  selectedDisciplinaryReasons: [],
  onChange: () => {},
};

describe('<DisciplineReasonsDropdown />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchDisciplineReasons.mockResolvedValueOnce({
      data: mockedDisciplineReasons,
    });
  });

  it('renders successfully', () => {
    render(<DisciplineReasonsDropdown {...props} />);
    expect(
      screen.getByLabelText('Discipline Test Dropdown')
    ).toBeInTheDocument();
  });

  it('fetches and displays disciplinary reasons', async () => {
    render(<DisciplineReasonsDropdown {...props} />);
    const dropdown = screen.getByLabelText('Discipline Test Dropdown');
    await waitFor(() => expect(fetchDisciplineReasons).toHaveBeenCalled());
    // Clicking the dropdown shows options in DOM
    fireEvent.mouseDown(dropdown);
    expect(await screen.findByText('Violent conduct')).toBeInTheDocument();
  });

  it('calls onChange when a reason is selected', async () => {
    const mockOnChange = jest.fn();
    render(<DisciplineReasonsDropdown {...props} onChange={mockOnChange} />);
    const dropdown = screen.getByLabelText('Discipline Test Dropdown');
    await waitFor(() => expect(fetchDisciplineReasons).toHaveBeenCalled());
    fireEvent.mouseDown(dropdown);
    fireEvent.click(await screen.findByText('Violent conduct'));
    expect(mockOnChange).toHaveBeenCalled();
  });
});
