// @flow
import { withNamespaces } from 'react-i18next';
import { useState } from 'react';
import uuid from 'uuid';
import type { ComponentType } from 'react';

import { InputTextField, TextButton, Select } from '@kitman/components';
import { validateURL, containsWhitespace } from '@kitman/common/src/utils';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import type { EventFormData } from '../../types';

type Props = {
  event: EventFormData | Object,
  categoryOptions: Array<Option>,
  setAllCategoryOptions: Function,
  onUpdateEventDetails: OnUpdateEventDetails,
};

const AddLinks = (props: I18nProps<Props>) => {
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentUri, setCurrentUri] = useState('');
  const [isLinkValidationCheckAllowed, setIsLinkValidationCheckAllowed] =
    useState(false);

  const updateLinkUri = (index, newUri) => {
    if (props.event.unUploadedLinks) {
      const currentLinks = [...props.event.unUploadedLinks];
      currentLinks[index] = { ...currentLinks[index], uri: newUri };
      props.onUpdateEventDetails({
        unUploadedLinks: currentLinks,
      });
    }
  };

  const updateLinkTitle = (index, newTitle) => {
    if (props.event.unUploadedLinks) {
      const currentLinks = [...props.event.unUploadedLinks];
      currentLinks[index] = { ...currentLinks[index], title: newTitle };
      props.onUpdateEventDetails({
        unUploadedLinks: currentLinks,
      });
    }
  };
  // change categories on one file
  const updateLinkCategories = (index, selectedCategories) => {
    if (props.event.unUploadedLinks) {
      const currentLinks = [...props.event.unUploadedLinks];
      currentLinks[index].event_attachment_category_ids = selectedCategories;
      props.onUpdateEventDetails({
        unUploadedLinks: currentLinks,
      });
    }
  };

  return (
    <div key={props.event.id}>
      <div css={style.addLinkArea}>
        <div css={style.linkTitle}>
          <InputTextField
            label={props.t('Title')}
            value={currentTitle || ''}
            onChange={(e) => {
              setCurrentTitle(e.target.value);
            }}
            invalid={isLinkValidationCheckAllowed && currentTitle.length === 0}
            kitmanDesignSystem
          />
        </div>
        <div css={style.linkUri}>
          <InputTextField
            label={props.t('Link')}
            value={currentUri || ''}
            onChange={(e) => {
              setCurrentUri(e.target.value);
            }}
            invalid={
              isLinkValidationCheckAllowed &&
              (!validateURL(currentUri) || containsWhitespace(currentUri)) &&
              currentUri.length >= 0
            }
            kitmanDesignSystem
          />
        </div>

        <div css={style.linkAddButton}>
          <TextButton
            text={props.t('Add')}
            type="secondary"
            onClick={() => {
              setIsLinkValidationCheckAllowed(true);
              const requiredLinkFields = [
                currentTitle.length > 0,
                validateURL(currentUri) && !containsWhitespace(currentUri),
              ];
              const allRequiredLinkFieldsAreValid = requiredLinkFields.every(
                (item) => item
              );

              if (allRequiredLinkFieldsAreValid) {
                const updatedLinks = [
                  ...(props.event.unUploadedLinks || []),
                  {
                    title: currentTitle,
                    uri: currentUri,
                  },
                ];
                props.onUpdateEventDetails({
                  unUploadedLinks: updatedLinks.map((queuedLink, index) => {
                    return { ...queuedLink, id: index };
                  }),
                });

                setCurrentTitle('');
                setCurrentUri('');
                setIsLinkValidationCheckAllowed(false);
              }
            }}
            kitmanDesignSystem
          />
        </div>
      </div>
      {props.event.unUploadedLinks &&
        props.event.unUploadedLinks.map((eventLink, index) => (
          <div key={uuid.v4()} css={style.unUploadedFileArea}>
            <div css={style.unUploadedFileFields}>
              <div css={style.fileAlignment}>
                <InputTextField
                  value={
                    eventLink.uri.startsWith('//')
                      ? eventLink.uri.substring(2)
                      : eventLink.uri || ''
                  }
                  onChange={(e) => updateLinkUri(index, e.target.value)}
                  label={props.t('Link')}
                  invalid={
                    (!validateURL(eventLink.uri) ||
                      containsWhitespace(eventLink.uri)) &&
                    eventLink.uri.length >= 0
                  }
                  kitmanDesignSystem
                />
                <TextButton
                  onClick={() => {
                    const currentLinks = props.event.unUploadedLinks?.filter(
                      ({ id }) => id !== eventLink.id
                    );
                    props.onUpdateEventDetails({
                      unUploadedLinks: currentLinks,
                    });
                  }}
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                />
              </div>
              <InputTextField
                value={eventLink.title || ''}
                onChange={(e) => updateLinkTitle(index, e.target.value)}
                label={props.t('Title')}
                invalid={eventLink.title === ''}
                kitmanDesignSystem
              />
              <Select
                label={props.t('Categories')}
                options={props.categoryOptions}
                value={eventLink.event_attachment_category_ids}
                onChange={(selectedOptions) => {
                  props.setAllCategoryOptions([]);
                  updateLinkCategories(index, selectedOptions);
                }}
                isMulti
                invalid={!eventLink.event_attachment_category_ids?.length}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export const AddLinksTranslated: ComponentType<Props> =
  withNamespaces()(AddLinks);
export default AddLinks;
