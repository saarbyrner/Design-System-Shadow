// @flow
import { withNamespaces } from 'react-i18next';
import { TermsOfUsePolicySettingsTranslated as TermsOfUsePolicySettings } from '../termsOfUsePolicySettings';
import type { TermsOfUseActionState } from '../termsOfUsePolicySettings';

type Props = {
  termsOfUsePolicyText: ?string,
  termsOfUsePolicyIsActive: ?boolean,
  termsOfUsePolicyActionState: TermsOfUseActionState,
  fetchTermsOfUsePolicy: Function,
  fetchTermsOfUsePolicyIsActive: Function,
  onConfirmUpdateTermsOfUsePolicy: Function,
  onEditingPolicy: Function,
  saveTermsOfUsePolicyIsActive: Function,
};

const TermsOfUseSettings = (props: Props) => {
  return (
    <div className="termsOfUseSettings">
      <TermsOfUsePolicySettings
        actionState={props.termsOfUsePolicyActionState}
        onEditingPolicy={props.onEditingPolicy}
        policyText={props.termsOfUsePolicyText}
        policyIsActive={props.termsOfUsePolicyIsActive}
        fetchTermsOfUsePolicy={props.fetchTermsOfUsePolicy}
        fetchTermsOfUsePolicyIsActive={props.fetchTermsOfUsePolicyIsActive}
        onChangePolicy={(policyText: string) => {
          props.onConfirmUpdateTermsOfUsePolicy(policyText);
        }}
        saveTermsOfUsePolicyIsActive={props.saveTermsOfUsePolicyIsActive}
      />
    </div>
  );
};

export const TermsOfUsePolicySettingsTranslated = withNamespaces()(
  TermsOfUsePolicySettings
);

export default TermsOfUseSettings;
