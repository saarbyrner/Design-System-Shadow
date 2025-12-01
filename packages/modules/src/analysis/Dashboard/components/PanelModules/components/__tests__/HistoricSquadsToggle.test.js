import i18n from 'i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import HistoricSquadsToggle from '../HistoricSquadsToggle';

describe('HistoricSquadsToggle', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    isHistoricSquadActive: false,
    setHistoricSquadActive: jest.fn(),
    t: i18nT,
  };
  it('calls onSetPopulation with the proper values when switching the toggle to historic', async () => {
    render(<HistoricSquadsToggle {...props} />);
    await userEvent.click(screen.getByText('Historical squads'));
    expect(props.setHistoricSquadActive).toHaveBeenCalledWith(true);
  });

  it('calls onSetPopulation with the proper values when switching the toggle to current', async () => {
    render(<HistoricSquadsToggle {...props} isHistoricSquadActive />);
    await userEvent.click(screen.getByText('Current squads'));
    expect(props.setHistoricSquadActive).toHaveBeenCalledWith(false);
  });
});
