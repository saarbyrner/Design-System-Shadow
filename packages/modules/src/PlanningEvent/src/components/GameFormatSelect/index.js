// @flow
import { Select } from '@kitman/components';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  selectedGameFormat: OrganisationFormat,
  setPendingGameFormat: (gameFormat: OrganisationFormat) => void,
  gameFormats: Array<OrganisationFormat>,
};

const GameFormatSelect = (props: I18nProps<Props>) => {
  const handleGameFormatChange = (gameFormat: OrganisationFormat) => {
    if (
      gameFormat.number_of_players ===
      props.selectedGameFormat?.number_of_players
    ) {
      return;
    }
    props.setPendingGameFormat(gameFormat);
  };

  const options =
    props.gameFormats?.map((gameFormat) => {
      return {
        value: gameFormat,
        label: `${gameFormat.number_of_players}v${gameFormat.number_of_players}`,
      };
    }) || [];

  return (
    <div data-testid="GameFormatSelect">
      <Select
        label={props.t('Format')}
        value={props.selectedGameFormat}
        onChange={handleGameFormatChange}
        options={options}
        css={css`
          width: 120px;
          margin-right: 12px;
        `}
        isDisabled={
          window.featureFlags['hide-game-events-header-and-events-list']
        }
      />
    </div>
  );
};

export const GameFormatSelectTranslated = withNamespaces()(GameFormatSelect);
export default GameFormatSelect;
