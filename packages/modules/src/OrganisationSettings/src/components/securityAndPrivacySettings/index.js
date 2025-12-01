// @flow
import { withNamespaces } from 'react-i18next';
import { PrivacyPolicySettingsTranslated as PrivacyPolicySettings } from '../privacyPolicySettings';
import type { ActionState } from '../privacyPolicySettings';

type Props = {
  privacyPolicyText: ?string,
  privacyPolicyIsActive: ?boolean,
  privacyPolicyActionState: ActionState,
  fetchPrivacyPolicy: Function,
  fetchPrivacyPolicyIsActive: Function,
  onConfirmUpdatePrivacyPolicy: Function,
  onEditingPolicy: Function,
  savePrivacyPolicyIsActive: Function,
};

const SecurityAndPrivacySettings = (props: Props) => {
  return (
    <div className="securityAndPrivacySettings">
      <PrivacyPolicySettings
        actionState={props.privacyPolicyActionState}
        onEditingPolicy={props.onEditingPolicy}
        policyText={props.privacyPolicyText}
        policyIsActive={props.privacyPolicyIsActive}
        fetchPrivacyPolicy={props.fetchPrivacyPolicy}
        fetchPrivacyPolicyIsActive={props.fetchPrivacyPolicyIsActive}
        onChangePolicy={(policyText: string) => {
          props.onConfirmUpdatePrivacyPolicy(policyText);
        }}
        savePrivacyPolicyIsActive={props.savePrivacyPolicyIsActive}
      />
    </div>
  );
};

export const SecurityAndPrivacySettingsTranslated = withNamespaces()(
  SecurityAndPrivacySettings
);
export default SecurityAndPrivacySettings;
