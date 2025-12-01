// @flow

import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { BaseAnswerTranslated as BaseAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/BaseAnswer';
import { AvatarAnswerTranslated as AvatarAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/AvatarAnswer';
import { AttachmentAnswerTranslated as AttachmentAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/AttachmentAnswer';
import { ATTACHMENT_TYPES } from '@kitman/modules/src/HumanInput/types/forms';
import SignatureAnswer from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/SignatureAnswer';
import SelectAnswer from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/SelectAnswer';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  element: HumanInputFormElement,
  value: string,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

const FormAnswer = (props: I18nProps<Props>) => {
  const { element, value, t, repeatableGroupInfo } = props;
  const { config } = element;

  /**
   * TODO: This is a temporary solution and will be changed when we implement repeatable groups
   */
  if (Array.isArray(value) && value.length === 0) {
    return <BaseAnswer text={element.config.text} />;
  }

  switch (element.element_type) {
    case INPUT_ELEMENTS.Text:
      return (
        <BaseAnswer text={element.config.text} value={value || undefined} />
      );
    case INPUT_ELEMENTS.DateTime:
      // eslint-disable-next-line no-case-declarations
      let formatedValue;

      if (config?.type === 'date' || config?.type === 'time') {
        let parsedDate = moment(value, DateFormatter.dateTransferFormat);
        if (!parsedDate.isValid()) {
          parsedDate = moment(value);
        }
        if (parsedDate.isValid()) {
          formatedValue =
            config?.type === 'time'
              ? DateFormatter.formatJustTime(parsedDate)
              : DateFormatter.formatStandard({
                  date: parsedDate,
                  showTime: false,
                  displayLongDate: false,
                });
        }
      }
      return (
        <BaseAnswer
          text={element.config.text}
          value={formatedValue || value?.toString()}
        />
      );
    case INPUT_ELEMENTS.Number:
      if (value || typeof value === 'number') {
        return (
          <BaseAnswer
            text={element.config.text}
            value={
              config.custom_params?.unit
                ? // $FlowIgnore[incompatible-type] - can only be string in this scenario
                  `${value} ${config.custom_params?.unit}`
                : value.toString()
            }
          />
        );
      }
      return <BaseAnswer text={element.config.text} />;

    case INPUT_ELEMENTS.Boolean:
      return (
        <BaseAnswer
          text={element.config.text}
          value={value === true ? t('Yes') : t('No')}
        />
      );

    case INPUT_ELEMENTS.SingleChoice:
    case INPUT_ELEMENTS.MultipleChoice:
      return <SelectAnswer element={element} value={value} />;

    case INPUT_ELEMENTS.Attachment:
      switch (element.config.custom_params?.type) {
        case ATTACHMENT_TYPES.AVATAR: {
          return (
            <AvatarAnswer
              text={element.config.text}
              elementId={element.id}
              repeatableGroupInfo={repeatableGroupInfo}
            />
          );
        }
        case ATTACHMENT_TYPES.SIGNATURE: {
          return (
            <SignatureAnswer
              text={element.config.text}
              elementId={element.id}
              repeatableGroupInfo={repeatableGroupInfo}
            />
          );
        }
        default: {
          return (
            <AttachmentAnswer
              text={element.config.text}
              elementId={element.id}
              repeatableGroupInfo={repeatableGroupInfo}
            />
          );
        }
      }

    default:
      return <BaseAnswer text={element.config.text} value={value} />;
  }
};

export const FormAnswerTranslated = withNamespaces()(FormAnswer);
export default FormAnswer;
