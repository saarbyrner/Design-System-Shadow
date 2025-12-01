// @flow
import { Select } from '@kitman/components';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Formation } from '@kitman/common/src/types/PitchView';

type Props = {
  formationsGroupedByGameFormat: { [key: number]: Formation[] },
  selectedGameFormat: OrganisationFormat,
  selectedFormation: Formation,
  setPendingFormation: (Formation) => void,
  isDisabled: boolean,
};

const FormationSelect = (props: I18nProps<Props>) => {
  const handleFormationChange = (formation) => {
    if (
      props.selectedFormation !== null &&
      formation.id === props.selectedFormation.id
    )
      return;
    props.setPendingFormation(formation);
  };

  const formationsForSelectedGameFormat =
    props.formationsGroupedByGameFormat?.[
      props.selectedGameFormat?.number_of_players
    ];

  const formationOptions =
    formationsForSelectedGameFormat?.map((formation) => ({
      value: formation,
      label: formation.name,
    })) || [];

  return (
    <div data-testid="FormationSelect">
      {formationsForSelectedGameFormat && (
        <Select
          label={props.t('Formation')}
          value={props.selectedFormation}
          onChange={handleFormationChange}
          options={formationOptions}
          css={css`
            width: 120px;
          `}
          isDisabled={props.isDisabled}
        />
      )}
    </div>
  );
};

export const FormationSelectTranslated = withNamespaces()(FormationSelect);
export default FormationSelect;
