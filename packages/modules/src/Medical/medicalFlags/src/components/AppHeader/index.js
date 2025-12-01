// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/AppHeader/styles';

type Props = {
  archiveMedicalFlag: Function,
  athleteData: AthleteData,
  medicalFlag: AllergyDataResponse | AthleteMedicalAlertDataResponse,
};

const AppHeader = ({
  archiveMedicalFlag,
  athleteData,
  medicalFlag,
  t,
}: I18nProps<Props>) => {
  const historyGo = useHistoryGo();
  const { permissions } = usePermissions();

  const renderActions = () => {
    const actions = [];
    if (
      (medicalFlag.allergen && permissions.medical.allergies.canArchive) ||
      (medicalFlag.medical_alert && permissions.medical.alerts.canArchive)
    ) {
      actions.push(
        <TextButton
          data-testid="MedicalFlagActions|Archive"
          text="Archive"
          type="secondary"
          onClick={() => archiveMedicalFlag()}
          kitmanDesignSystem
        />
      );
    }

    return actions.map((action) => action);
  };

  return (
    <header css={style.header} data-testid="MedicalFlag|Header">
      <div css={style.actions}>
        <a css={style.backlink} href="#" onClick={() => historyGo(-1)}>
          <i className="icon-next-left" />
          {t('Back')}
        </a>
        {renderActions()}
      </div>
      <section css={style.athleteSection}>
        <img
          css={style.athleteAvatar}
          src={athleteData.avatar_url}
          alt={athleteData.fullname}
        />
        <div css={style.athleteContent}>
          <div css={style.athleteNameWrapper}>
            <h2
              css={style.athleteName}
            >{`${athleteData.fullname}: ${medicalFlag?.display_name}`}</h2>
          </div>
        </div>
      </section>
    </header>
  );
};

export const AppHeaderTranslated: ComponentType<Props> =
  withNamespaces()(AppHeader);
export default AppHeader;
