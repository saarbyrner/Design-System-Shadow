// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  RichTextDisplay,
  RichTextEditor,
  SettingWidget,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type TermsOfUseActionState = 'LOADING' | 'LOADED' | 'EDITING' | 'ERROR';

type Props = {
  policyIsActive: ?boolean,
  policyText: ?string,
  actionState: TermsOfUseActionState,
  fetchTermsOfUsePolicy: Function,
  fetchTermsOfUsePolicyIsActive: Function,
  onEditingPolicy: Function,
  onChangePolicy: Function,
  saveTermsOfUsePolicyIsActive: Function,
};

const TermsOfUsePolicySettings = (props: I18nProps<Props>) => {
  const [haveEditedPolicyText, setHaveEditedPolicyText] = useState(false);
  const [termsOfUsePolicy, setTermsOfUsePolicy] = useState(props.policyText);
  useEffect(() => {
    props.fetchTermsOfUsePolicyIsActive();
    props.fetchTermsOfUsePolicy();
  }, []);

  useEffect(() => setTermsOfUsePolicy(props.policyText), [props.policyText]);

  const emptyHTMLeditorContent = '<p><br></p>';

  const isEmptyPolicy = (policyText: string) =>
    !policyText || policyText === '' || policyText === emptyHTMLeditorContent;

  const onChangeTermsOfUsePolicyText = (text: string) => {
    if (text === termsOfUsePolicy) {
      return;
    }
    if (isEmptyPolicy(text)) {
      setHaveEditedPolicyText(false);
      return;
    }
    setTermsOfUsePolicy(text);
    setHaveEditedPolicyText(true);
  };

  const resetPolicy = () => {
    setTermsOfUsePolicy(props.policyText);
    setHaveEditedPolicyText(false);
    props.onEditingPolicy(false);
  };

  return (
    <div className="termsOfUsePolicy" data-testid="termsOfUsePolicy">
      <SettingWidget title={props.t('Terms of Use policy')} kitmanDesignSystem>
        <table className="table km-table">
          <tbody>
            <tr key="termsOfUsePolicy">
              <td>{props.t('Use custom Terms of Use policy')}</td>
              <td className="text-right">
                <ToggleSwitch
                  isSwitchedOn={props.policyIsActive || false}
                  toggle={() =>
                    props.saveTermsOfUsePolicyIsActive(!props.policyIsActive)
                  }
                  isDisabled={
                    props.policyIsActive === undefined ||
                    props.actionState === 'LOADING' ||
                    !props.policyText
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="termsOfUsePolicy__subHeading">
          {props.t('Policy text')}
        </span>
        {props.actionState === 'LOADING' && (
          <div className="termsOfUsePolicy__loading">
            {props.t('Loading...')}
          </div>
        )}
        {props.actionState === 'EDITING' && (
          <div className="termsOfUsePolicy__editor">
            <RichTextEditor
              onChange={(content) => {
                onChangeTermsOfUsePolicyText(content);
              }}
              value={termsOfUsePolicy || ''}
              kitmanDesignSystem
            />
            <footer className="termsOfUsePolicy__footer">
              <TextButton
                text={props.t('Cancel')}
                type="secondary"
                onClick={() => resetPolicy()}
                kitmanDesignSystem
              />
              <TextButton
                text={props.t('Save')}
                type="primary"
                onClick={() => props.onChangePolicy(termsOfUsePolicy)}
                isDisabled={!haveEditedPolicyText}
                kitmanDesignSystem
              />
            </footer>
          </div>
        )}
        {props.actionState === 'LOADED' && (
          <>
            <span className="termsOfUsePolicy__edit">
              <TextButton
                onClick={() => props.onEditingPolicy(true)}
                type="link"
                text={props.t('Edit')}
                kitmanDesignSystem
              />
            </span>
            {termsOfUsePolicy && (
              <div className="termsOfUsePolicy__content">
                <RichTextDisplay
                  value={termsOfUsePolicy}
                  isAbbreviated={false}
                />
              </div>
            )}
            {!termsOfUsePolicy && (
              <div className="termsOfUsePolicy__empty">
                {props.t('No policy set')}
              </div>
            )}
          </>
        )}
      </SettingWidget>
    </div>
  );
};

export const TermsOfUsePolicySettingsTranslated = withNamespaces()(
  TermsOfUsePolicySettings
);
export default TermsOfUsePolicySettings;
