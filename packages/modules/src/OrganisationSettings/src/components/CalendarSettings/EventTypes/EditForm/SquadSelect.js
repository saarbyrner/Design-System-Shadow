// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Select } from '@kitman/components';
import {
  type Option,
  fullWidthMenuCustomStyles,
} from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OnChangingSquads } from './utils/types';

type Props = {
  allSquadsOptions: Array<Option>,
  currentlySelectedSquadIds: Array<number>,
  onChangingSquads: OnChangingSquads,
  eventIndex: number | null,
  shouldShowLabel: boolean,
};

export type TranslatedProps = I18nProps<Props>;
const SquadSelect = ({
  t,
  allSquadsOptions,
  currentlySelectedSquadIds,
  onChangingSquads,
  eventIndex,
  shouldShowLabel,
}: TranslatedProps) => {
  return (
    <Select
      label={shouldShowLabel ? t('Squad') : null}
      options={allSquadsOptions}
      customSelectStyles={fullWidthMenuCustomStyles}
      value={currentlySelectedSquadIds}
      onChange={(newSquadIds) => onChangingSquads({ eventIndex, newSquadIds })}
      isMulti
      placeholder={t('No squads selected.')}
      allowSelectAll
      allowClearAll
    />
  );
};

export const SquadSelectTranslated: ComponentType<Props> =
  withNamespaces()(SquadSelect);
export default SquadSelect;
