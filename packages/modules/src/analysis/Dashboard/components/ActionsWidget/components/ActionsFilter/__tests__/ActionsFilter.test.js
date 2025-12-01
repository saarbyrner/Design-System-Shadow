import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import ActionsFilter from '../index';

describe('<ActionsFilter />', () => {
  const props = {
    filteredPopulation: emptySquadAthletes,
    filteredCompletion: 'completed',
    filteredAnnotationTypes: [1],
    annotationTypes: [],
    squadAthletes: emptySquadAthletes,
    squads: [],
    onFilteredPopulationChange: jest.fn(),
    onFilteredCompletionChange: jest.fn(),
    onFilteredAnnotationTypesChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onFilteredCompletionChange with the expected value on Not Complete', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsFilter {...props} />);

    const notCompleteOption = screen.getByText('Not complete');
    await user.click(notCompleteOption);

    expect(props.onFilteredCompletionChange).toHaveBeenCalledWith(
      'uncompleted'
    );
  });

  it('calls onFilteredCompletionChange with the expected value on Complete', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsFilter {...props} />);

    const notCompleteOption = screen.getAllByText('Complete');
    await user.click(notCompleteOption[1]);

    expect(props.onFilteredCompletionChange).toHaveBeenCalledWith('completed');
  });

  it('shows only evaluation notes in the note type dropdown', async () => {
    const user = userEvent.setup();
    const testProps = {
      ...props,
      annotationTypes: [
        {
          id: 548,
          name: 'Evaluation note',
          type: 'OrganisationAnnotationTypes::Evaluation',
        },
        {
          id: 81,
          name: 'General note',
          type: 'OrganisationAnnotationTypes::General',
        },
      ],
    };

    renderWithStore(<ActionsFilter {...testProps} />);

    const dropdownWrapper = screen
      .getByText('Note type')
      .closest('[data-testid="DropdownWrapper"]');
    const dropdownHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await user.click(dropdownHeader);

    expect(screen.getByText('Evaluation note')).toBeInTheDocument();
    expect(screen.queryByText('General note')).not.toBeInTheDocument();
  });

  it('calls onFilteredAnnotationTypesChange when changing the annotation filter', async () => {
    const user = userEvent.setup();
    const testProps = {
      ...props,
      annotationTypes: [
        {
          id: 548,
          name: 'Evaluation note',
          type: 'OrganisationAnnotationTypes::Evaluation',
        },
      ],
    };

    renderWithStore(<ActionsFilter {...testProps} />);

    const dropdownWrapper = screen
      .getByText('Note type')
      .closest('[data-testid="DropdownWrapper"]');
    const dropdownHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await user.click(dropdownHeader);

    await user.click(screen.getByText('Evaluation note'));
    expect(testProps.onFilteredAnnotationTypesChange).toHaveBeenCalledTimes(1);
  });
});
