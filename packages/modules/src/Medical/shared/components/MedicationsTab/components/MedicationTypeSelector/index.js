// @flow
import { SegmentedControl } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  medicationType: 'overview' | 'management' | 'internal',
  setMedicationType: Function,
};

const style = {
  segmentedControlWrapper: css`
    height: 100%;
  `,
};
const MedicationTypeSelector = (props: I18nProps<Props>) => {
  const isDrFirstIntegrationOn = window.featureFlags['dr-first-integration'];

  return (
    <div
      css={style.segmentedControlWrapper}
      data-testid="Medications|TypeSelector"
    >
      <SegmentedControl
        width="inline"
        buttons={[
          {
            name: props.t('Overview'),
            value: props.t('overview'),
          },
          ...(isDrFirstIntegrationOn
            ? [
                {
                  name: props.t('ePrescription'),
                  value: props.t('management'),
                },
              ]
            : []),
        ]}
        color={colors.grey_200}
        selectedButton={props.medicationType}
        onClickButton={(value) => props.setMedicationType(value)}
      />
    </div>
  );
};

export default MedicationTypeSelector;
