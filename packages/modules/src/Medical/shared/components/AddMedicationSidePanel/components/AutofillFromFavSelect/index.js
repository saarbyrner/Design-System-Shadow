// @flow
import { Select } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { deleteMedicationFavorite } from '@kitman/services/src/services/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../styles';

type Props = {
  medConfigFavorites: Array<any>,
  setMedConfigFavorites: Function,
  onChange: Function,
  selectedMedConfig: Object,
  isDisabled: boolean,
  onStart: Function,
  onSuccess: Function,
  onFailure: Function,
};

const AutofillFromFavSelect = (props: I18nProps<Props>) => {
  return (
    <>
      <Select
        label={props.t('Autofill from favorites')}
        options={props.medConfigFavorites}
        onChange={props.onChange}
        value={props.selectedMedConfig?.value}
        isDisabled={props.isDisabled}
        includeIconConfig={{
          iconName: 'icon-bin',
          onClick: (value) => {
            props.onStart();
            deleteMedicationFavorite(value)
              .then(() => {
                const newFavorites = props.medConfigFavorites.filter(
                  (favorite) => {
                    return favorite.value !== value;
                  }
                );
                props.setMedConfigFavorites(newFavorites);
                props.onSuccess();
              })
              .catch(() => {
                props.onFailure();
              });
          },
        }}
        returnObject
      />
      {props.isDisabled ? (
        <div css={style.errorMessage}>
          {props.t('Please select a dispense date.')}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export const AutofillFromFavSelectTranslated: ComponentType<Props> =
  withNamespaces()(AutofillFromFavSelect);
export default AutofillFromFavSelect;
