// @flow
import { withNamespaces } from 'react-i18next';

import Checkbox from '@kitman/components/src/Checkbox';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ValidationTextTranslated as ValidationText } from '@kitman/components/src/ValidationText';
import {
  CLUB_RESULTS,
  NATIONAL_RESULTS,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import styles from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';

const Clubs = (
  props: I18nProps<{ isValid: boolean, errorMessage: string }>
) => {
  const { filter: nationalFilter, setFilter: setNationalFilter } =
    useFilter(NATIONAL_RESULTS);
  const { filter: clubFilter, setFilter: setClubFilter } =
    useFilter(CLUB_RESULTS);

  return (
    <>
      <div css={styles.row}>
        <div css={styles.orgRow}>
          <Checkbox.New
            id="national"
            name="national"
            onClick={() => setNationalFilter(!nationalFilter)}
            checked={nationalFilter}
            kitmanDesignSystem
            invalid={!props.isValid}
          />
          <p css={styles.orgText}> {props.t('National')} </p>
        </div>
        <div css={styles.orgRow}>
          <Checkbox.New
            id="my_club"
            name="my_club"
            onClick={() => setClubFilter(!clubFilter)}
            checked={clubFilter}
            kitmanDesignSystem
            invalid={!props.isValid}
          />
          <p css={styles.orgText}> {props.t('My club')}</p>
        </div>
      </div>

      {!props.isValid && (
        <ValidationText customValidationText={props.errorMessage} />
      )}
    </>
  );
};

export const ClubsTranslated = withNamespaces()(Clubs);
export default Clubs;
