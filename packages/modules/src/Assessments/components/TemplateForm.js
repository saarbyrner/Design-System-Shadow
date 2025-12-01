// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  FormValidator,
  InputText,
  LegacyModal as Modal,
  TextButton,
  Checkbox,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Assessment, ViewType } from '../types';

type Props = {
  assessment: Assessment,
  viewType: ViewType,
  onClickSubmit: Function,
  onClickClose: Function,
};

const TemplateForm = (props: I18nProps<Props>) => {
  const [name, setName] = useState('');
  const [includeUsers, setIncludeUsers] = useState(true);

  return (
    <Modal
      title={props.t('Template name')}
      close={props.onClickClose}
      style={{ overflow: 'visible' }}
      width={450}
      isOpen
    >
      <FormValidator
        successAction={() => {
          props.onClickSubmit({
            ...(window.featureFlags['assessments-multiple-athletes']
              ? {
                  assessment_group_id: props.assessment.id,
                }
              : {
                  assessment_id: props.assessment.id,
                }),
            name,
            include_users: props.viewType === 'LIST' ? includeUsers : false,
          });
        }}
        inputNamesToIgnore={['includeUsers']}
      >
        <div className="assessmentsTemplateForm">
          <section className="assessmentsTemplateForm__name">
            <InputText
              value={name}
              onValidation={({ value }) => setName(value)}
              label={props.t('Name')}
              maxLength={50}
            />
          </section>

          <section className="assessmentsTemplateForm__includedInTemplate">
            <h5>{props.t('Included in template')}</h5>
            <div className="assessmentsTemplateForm__itemWithoutCheckbox">
              {props.t('Metrics (excluding scores and notes)')}
            </div>
            {props.viewType === 'LIST' && (
              <div className="assessmentsTemplateForm__checkbox">
                <Checkbox
                  id="includeUsers"
                  name="includeUsers"
                  isChecked={includeUsers}
                  toggle={(checkbox) => setIncludeUsers(checkbox.checked)}
                  label={props.t('Staff Members')}
                />
              </div>
            )}
          </section>

          <footer className="assessmentsTemplateForm__footer">
            <TextButton
              text={props.t('Save')}
              type="primary"
              isSubmit
              kitmanDesignSystem
            />
          </footer>
        </div>
      </FormValidator>
    </Modal>
  );
};

export default TemplateForm;
export const TemplateFormTranslated = withNamespaces()(TemplateForm);
