// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import { DummySelect } from '@kitman/playbook/components';
import { RadioSliderTranslated as RadioSlider } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/components/RadioSlider';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  BIO_BAND_RANGE,
  DEFAULT_BIO_BAND_RANGE,
  ADULT_HEIGHT_TRANSLATION_CONTEXT,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import { getHasDefaultBioBandRange } from '@kitman/modules/src/analysis/BenchmarkReport/utils';

type Props = {
  widthCalc: number,
};

const BioBand = (props: I18nProps<Props>) => {
  const { filter, setFilter } = useFilter(BIO_BAND_RANGE);

  const option =
    filter.length > 0
      ? {
          value: filter,
          label: getHasDefaultBioBandRange(filter)
            ? props.t('Any')
            : props.t('{{filterValueOne}}%–{{filterValueTwo}}% of AH', {
                filterValueOne: filter[0],
                filterValueTwo: filter[1],
                context: ADULT_HEIGHT_TRANSLATION_CONTEXT,
              }),
        }
      : {
          value: DEFAULT_BIO_BAND_RANGE,
          label: props.t('Any'),
        };

  return (
    <span css={getFilterStyles(props.widthCalc)}>
      <DummySelect
        label={props.t('Bio-band')}
        title={getHasDefaultBioBandRange(filter) ? '' : props.t('Adult height')}
        option={option}
        onChange={(selected) => {
          setFilter(selected.value);
        }}
      >
        {/*
          $FlowIgnore[prop-missing] the props are passed via the wrapping
          DummySelect component.
         */}
        <RadioSlider />
      </DummySelect>
    </span>
  );
};

export const BioBandTranslated: ComponentType<Props> =
  withNamespaces()(BioBand);
export default BioBand;
