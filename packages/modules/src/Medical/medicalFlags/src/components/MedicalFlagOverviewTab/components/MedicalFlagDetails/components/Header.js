// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useMedicalFlag } from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/styles';

type Props = {};

const Header = (props: I18nProps<Props>) => {
  const { medicalFlag } = useMedicalFlag();
  const medicalFlagType = medicalFlag.allergen ? 'Allergy' : 'Medical Alert';

  return (
    <header css={style.header}>
      <div css={style.main}>
        <h2>
          {props.t('{{heading}}', {
            heading: `${medicalFlagType} details`,
            interpolation: { escapeValue: false },
          })}
        </h2>
      </div>
    </header>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
