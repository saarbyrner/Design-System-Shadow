// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  saveQuestionnaire: () => void,
  clearAllVisibleVariables: () => void,
};

const Footer = (props: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  return (
    <div>
      <div className="float-left">
        <TextButton
          text={props.t('Clear All')}
          type="secondary"
          onClick={props.clearAllVisibleVariables}
        />
      </div>
      <div className="float-right">
        <TextButton
          text={props.t('Save')}
          type="primary"
          onClick={props.saveQuestionnaire}
        />
      </div>
      <div className="float-right" style={{ marginRight: 20 }}>
        <TextButton
          text={props.t('Cancel')}
          type="secondary"
          onClick={() => locationAssign('/settings/questionnaire_templates')}
        />
      </div>
    </div>
  );
};

export const FooterTranslated = withNamespaces()(Footer);
export default Footer;
