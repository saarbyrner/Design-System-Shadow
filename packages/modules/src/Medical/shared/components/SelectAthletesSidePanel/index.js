// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AthleteProvider,
  AthletesBySquadSelector,
} from '@kitman/components/src/Athletes/components';
import {
  AppStatus,
  InputTextField,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import type { SquadAthletes } from '@kitman/components/src/Athletes/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '../../types';
import style from './styles';

type Props = {
  initialDataRequestStatus: RequestStatus,
  isOpen: boolean,
  onClose: Function,
  onReview: Function,
  squadAthletes: SquadAthletes,
};

const SelectAthletesSidePanel = (props: I18nProps<Props>) => {
  const [searchValue, setSearchValue] = useState('');
  const [value, setValue] = useState([]);
  const [selectedSquadId, setSelectedSquadId] = useState();

  const onCancel = () => {
    setValue([]);
    setSelectedSquadId(null);
    props.onClose();
  };

  const onReview = () => {
    const athletesToReview = value[0]?.athletes;
    props.onReview(athletesToReview);
    setValue([]);
    setSelectedSquadId(null);
    props.onClose();
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('Select athletes')}
        onClose={() => {
          setValue([]);
          setSelectedSquadId(null);
          props.onClose();
        }}
        width={460}
      >
        <div css={style.content}>
          <InputTextField
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            inputType="text"
            searchIcon
            placeholder={props.t('Search')}
            kitmanDesignSystem
          />
          <div css={style.athleteSelector}>
            <AthleteProvider
              squadAthletes={props.squadAthletes}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              isMulti
            >
              <AthletesBySquadSelector
                searchValue={searchValue}
                selectedSquadId={selectedSquadId}
                onSquadClick={setSelectedSquadId}
                hiddenTypes={['squads', 'positions', 'position_groups']}
              />
            </AthleteProvider>
          </div>
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={onCancel}
            text={props.t('Cancel')}
            type="textOnly"
            kitmanDesignSystem
          />
          <TextButton
            onClick={onReview}
            text={props.t('Review')}
            type="primary"
            isDisabled={value.length === 0}
            kitmanDesignSystem
          />
        </div>
        {props.initialDataRequestStatus === 'FAILURE' && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const SelectAthletesSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(SelectAthletesSidePanel);
export default SelectAthletesSidePanel;
