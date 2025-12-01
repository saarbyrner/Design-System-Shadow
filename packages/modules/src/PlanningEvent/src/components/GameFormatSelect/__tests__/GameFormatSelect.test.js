import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import selectEvent from 'react-select-event';
import { GameFormatSelectTranslated as GameFormatSelect } from '..';

describe('GameFormatSelect', () => {
  const selectedGameFormat = {
    id: 1,
    name: '5v5',
    number_of_players: 5,
  };
  const setPendingGameFormat = jest.fn();
  const gameFormats = [
    {
      id: 1,
      name: '5v5',
      number_of_players: 5,
    },
    {
      id: 2,
      name: '7v7',
      number_of_players: 7,
    },
    {
      id: 3,
      name: '11v11',
      number_of_players: 11,
    },
  ];

  const props = {
    selectedGameFormat,
    setPendingGameFormat,
    gameFormats,
    t: i18nextTranslateStub(),
  };

  it('should render the select component with the correct options', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <GameFormatSelect {...props} />
      </I18nextProvider>
    );

    expect(screen.getByText(/Format/)).toBeInTheDocument();

    const option1 = screen.getByText('5v5');
    expect(option1).toBeInTheDocument();

    const wrapper = screen.getByTestId('GameFormatSelect');

    selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));

    const option2 = screen.getByText('7v7');
    expect(option2).toBeInTheDocument();

    await selectEvent.select(
      wrapper.querySelector('.kitmanReactSelect'),
      '7v7'
    );

    expect(setPendingGameFormat).toHaveBeenCalledWith({
      id: 2,
      name: '7v7',
      number_of_players: 7,
    });
  });

  describe('when hide-game-events-header-and-events-list is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'hide-game-events-header-and-events-list': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {
        'hide-game-events-header-and-events-list': false,
      };
    });

    it('disables the format dropdown', () => {
      const { container } = render(
        <I18nextProvider i18n={i18n}>
          <GameFormatSelect {...props} />
        </I18nextProvider>
      );

      const formatSelect = container.querySelectorAll(
        '.kitmanReactSelect__control'
      )[0];
      expect(formatSelect).toHaveClass(
        'kitmanReactSelect__control--is-disabled'
      );
    });
  });
});
