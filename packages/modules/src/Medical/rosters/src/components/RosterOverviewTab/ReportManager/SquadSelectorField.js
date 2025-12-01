// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import { AthleteSelect } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetSquadAthletesQuery } from '../../../../../shared/redux/services/medical';
import ExportSettings from '../../../../../shared/components/ExportSettings';

type Props = {
  isCached?: boolean,
  defaultValue: SquadAthletesSelection[],
};

function SquadSelectorField(props: I18nProps<Props>) {
  const { data, isFetching } = useGetSquadAthletesQuery({ athleteList: false });

  return (
    <ExportSettings.Field
      fieldKey="population"
      defaultValue={props.defaultValue || []}
      isCached={props.isCached}
    >
      {({ value, onChange }) => (
        <AthleteSelect
          label={props.t('Squads')}
          value={value}
          onChange={onChange}
          squadAthletes={data?.squads || []}
          placeholder={props.t('Select squads or athletes')}
          isLoading={isFetching}
          isMulti
          includeContextSquad
        />
      )}
    </ExportSettings.Field>
  );
}

export const SquadSelectorFieldTranslated: ComponentType<Props> =
  withNamespaces()(SquadSelectorField);

SquadSelectorField.defaultProps = {
  isCached: true,
};

export default SquadSelectorField;
