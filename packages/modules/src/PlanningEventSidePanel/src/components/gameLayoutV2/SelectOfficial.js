// @flow
import { useState, useEffect } from 'react';
import { startCase } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import type { GameSquad } from '@kitman/common/src/types/Event';

import getOfficialUsers from '@kitman/services/src/services/planning/getOfficialUsers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';

type Props = {
  isOpen: boolean,
  userIds: Array<number>,
  onUpdateUserIds: (Array<number>) => void,
  isDisabled?: boolean,
  customStyle?: ObjectStyle,
  squad?: GameSquad,
};

export const SelectOfficial = (props: I18nProps<Props>) => {
  const [official, setOfficial] = useState([]);

  useEffect(() => {
    const divisionId = props.squad?.division?.[0]?.id;
    if (props.isOpen)
      getOfficialUsers({ divisionId }).then((officialData) => {
        const updateOfficialData = officialData.map(({ id, fullname }) => ({
          label: startCase(fullname),
          value: id,
        }));
        setOfficial(updateOfficialData);
      });
  }, [props.isOpen]);

  return (
    <div
      style={props.customStyle}
      css={style.staffRow}
      data-testid="SelectOfficial"
    >
      <Select
        label={props.t('Official')}
        onChange={props.onUpdateUserIds}
        value={props.userIds || []}
        options={official}
        data-testid="GameFields|Staff"
        // isValid={props.eventValidity.user_ids?.isInvalid}
        isValid
        minMenuHeight={300}
        inlineShownSelection
        inlineShownSelectionMaxWidth={80}
        isMulti
        allowSelectAll
        allowClearAll
        isDisabled={props.isDisabled}
      />
    </div>
  );
};

export const SelectOfficialTranslated = withNamespaces()(SelectOfficial);
export default SelectOfficial;
