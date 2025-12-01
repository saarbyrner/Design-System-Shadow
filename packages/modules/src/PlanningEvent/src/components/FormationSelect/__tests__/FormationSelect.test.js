import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import FormationSelect from '..';

describe('FormationSelect', () => {
  it('should render the select component with the correct options', async () => {
    const formationsGroupedByGameFormat = {
      11: [
        { id: 1, name: '5-3-2' },
        { id: 2, name: '5-2-3' },
      ],
    };

    const selectedGameFormat = {
      id: 1,
      number_of_players: 11,
    };
    const selectedFormation =
      formationsGroupedByGameFormat[selectedGameFormat.number_of_players][0];
    const setPendingFormation = jest.fn();

    const props = {
      formationsGroupedByGameFormat,
      selectedGameFormat,
      selectedFormation,
      setPendingFormation,
      t: i18nextTranslateStub(),
    };

    render(
      <I18nextProvider i18n={i18n}>
        <FormationSelect {...props} />
      </I18nextProvider>
    );

    expect(screen.getByLabelText('Formation')).toBeInTheDocument();

    const option1 = screen.getByText('5-3-2');
    expect(option1).toBeInTheDocument();

    const wrapper = screen.getByTestId('FormationSelect');

    selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));

    const option2 = screen.getByText('5-2-3');
    expect(option2).toBeInTheDocument();

    await selectEvent.select(
      wrapper.querySelector('.kitmanReactSelect'),
      formationsGroupedByGameFormat[selectedGameFormat.number_of_players][1]
        .name
    );

    expect(setPendingFormation).toHaveBeenCalledWith(
      formationsGroupedByGameFormat[selectedGameFormat.number_of_players][1]
    );
  });

  it('should not render if there is no selectedGameFormat', () => {
    const formationsGroupedByGameFormat = {};

    const selectedGameFormat = undefined;
    const selectedFormation = null;
    const setPendingFormation = jest.fn();

    const props = {
      formationsGroupedByGameFormat,
      selectedGameFormat,
      selectedFormation,
      setPendingFormation,
      t: (key) => key,
    };

    render(
      <I18nextProvider i18n={i18n}>
        <FormationSelect {...props} />
      </I18nextProvider>
    );

    expect(screen.queryByLabelText('Formation')).not.toBeInTheDocument();
  });
});
