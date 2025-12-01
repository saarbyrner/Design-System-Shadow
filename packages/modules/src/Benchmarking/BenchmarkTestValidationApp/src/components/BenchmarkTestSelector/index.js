// @flow
import { type ComponentType } from 'react';
import { Select, TextButton } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as BenchmarkTypes from '@kitman/modules/src/Benchmarking/shared/types';
import { resetApiState } from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationApi';
import {
  onSelection,
  resetSelections,
} from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationSlice';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';

type Props = {
  clubs: BenchmarkTypes.BenchmarkClubs,
  windows: BenchmarkTypes.BenchmarkWindows,
  seasons: BenchmarkTypes.BenchmarkSeasons,
  shouldDisable: boolean,
  fetchResults: Function,
};

const BenchmarkTestSelector = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { selections } = useSelector((state) => state.benchmarkTestValidation);

  return (
    <div css={styles.container} data-testid="BenchmarkTestSelector">
      <Select
        label={props.t('Club')}
        options={props.clubs}
        value={selections.club.value || ''}
        onChange={(selection) =>
          dispatch(onSelection({ type: 'club', value: selection }))
        }
      />
      <Select
        label={props.t('Season')}
        options={props.seasons}
        value={selections.season.value || ''}
        onChange={(selection) =>
          dispatch(onSelection({ type: 'season', value: selection }))
        }
      />
      <Select
        label={props.t('Window')}
        options={props.windows}
        value={selections.window.value || ''}
        onChange={(selection) =>
          dispatch(onSelection({ type: 'window', value: selection }))
        }
      />

      <div css={styles.actionContainer}>
        <p css={styles.label}>{props.t('All fields required')}</p>
        <div>
          <TextButton
            text={props.t('Reset')}
            kitmanDesignSystem
            type="secondary"
            onClick={() => {
              dispatch(resetSelections());
              dispatch(resetApiState());
            }}
          />
          <TextButton
            text={props.t('Next')}
            kitmanDesignSystem
            type="primary"
            isDisabled={props.shouldDisable}
            onClick={() =>
              props.fetchResults({
                org: selections.club.value,
                window: selections.window.value,
                season: selections.season.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const BenchmarkTestSelectorTranslated: ComponentType<Props> = withNamespaces()(
  BenchmarkTestSelector
);
export default BenchmarkTestSelectorTranslated;
