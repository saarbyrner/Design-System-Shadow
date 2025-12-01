// @flow
import type { ComponentType } from 'react';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import { withNamespaces } from 'react-i18next';
import { TextTag } from '@kitman/components';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';

type Props = {
  diagnosticType: string,
  athleteData: AthleteData,
};

const AppHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const historyGo = useHistoryGo();
  return (
    <header css={style.header}>
      <div css={style.actions}>
        <a css={style.backlink} href="#" onClick={() => historyGo(-1)}>
          <i className="icon-next-left" />
          {props.t('Back')}
        </a>
      </div>
      <section css={style.athleteSection}>
        <img
          css={style.athleteAvatar}
          src={props.athleteData.avatar_url}
          alt={props.athleteData.fullname}
        />
        <div css={style.athleteContent}>
          <div css={style.athleteNameWrapper}>
            <h2
              css={style.athleteName}
            >{`${props.athleteData.fullname} - ${props.diagnosticType}`}</h2>
            {permissions.medical.allergies.canView &&
              (props.athleteData.allergy_names?.length > 0 ||
                // $FlowIgnore[incompatible-use]
                // $FlowIgnore[invalid-compare]
                props.athleteData.allergies?.length > 0) && (
                <div css={style.athleteAllergies}>
                  {props.athleteData.allergies?.map((allergy) => (
                    <div key={allergy.id} css={style.athleteAllergy}>
                      <TextTag
                        content={allergy.display_name}
                        backgroundColor={severityLabelColour(allergy.severity)}
                        textColor={
                          allergy.severity === 'severe'
                            ? colors.white
                            : colors.grey_400
                        }
                        fontSize={12}
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>
    </header>
  );
};

export const AppHeaderTranslated: ComponentType<Props> =
  withNamespaces()(AppHeader);
export default AppHeader;
