// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import {
  IconButton,
  InputText,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import { breakPoints } from '@kitman/common/src/variables';

import type {
  PrincipleCategoryId,
  PrincipleCategories,
} from '@kitman/common/src/types/Principles';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  categories: PrincipleCategories,
  isValidationCheckAllowed: boolean,
  isSavingAllowed: boolean,
  onClose: Function,
  onAdd: Function,
  onEdit: (categoryId: PrincipleCategoryId, name: string) => void,
  onDelete: (categoryId: PrincipleCategoryId) => void,
  onSave: Function,
};

const styles = {
  wrapper: css`
    .slidingPanelContent {
      &__button {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 30px;
        padding-right: 30px;
      }
      &__categories {
        height: calc(100vh - 222px);
        padding: 0 12px 20px 30px;
        overflow: auto;
        @media only screen and (max-width: ${breakPoints.desktop}) {
          height: calc(100vh - 282px);
        }
      }
      &__category {
        align-items: center;
        display: flex;
        justify-content: flex-end;
      }
    }
    .slidingPanelActions {
      display: flex;
      justify-content: space-between;
    }
  `,
};

const CategoriesSidePanel = (props: I18nProps<Props>) => {
  const onAdd = () => {
    TrackEvent('Org Settings Planning', 'Create', 'Category');
    props.onAdd();
  };

  const onDelete = (categoryId: PrincipleCategoryId) => {
    TrackEvent('Org Settings Planning', 'Delete', 'Category');
    props.onDelete(categoryId);
  };

  return (
    <div
      css={styles.wrapper}
      className="organisationPlanningSettings__categoriesSidePanel"
    >
      <SlidingPanel
        isOpen={props.isOpen}
        title={props.t('Category')}
        togglePanel={props.onClose}
      >
        <div className="slidingPanelContent">
          <div className="slidingPanelContent__button">
            <TextButton
              onClick={onAdd}
              type="primary"
              text={props.t('Add categories')}
              kitmanDesignSystem
            />
          </div>
          <ul className="slidingPanelContent__categories">
            {props.categories.length > 0 &&
              props.categories.map((category) => {
                const { id: categoryId, name: categoryName } = category;

                return (
                  <li
                    className="slidingPanelContent__category"
                    key={categoryId}
                  >
                    <InputText
                      value={categoryName}
                      onValidation={({ value = '' }) => {
                        if (value === categoryName) {
                          return;
                        }

                        props.onEdit(categoryId, value);
                      }}
                      invalid={props.isValidationCheckAllowed && !categoryName}
                      kitmanDesignSystem
                    />
                    <IconButton
                      icon="icon-bin"
                      theme="destruct"
                      isBorderless
                      isSmall
                      onClick={() => onDelete(categoryId)}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="slidingPanelActions">
          <TextButton
            onClick={props.onClose}
            type="secondary"
            text={props.t('Cancel')}
            kitmanDesignSystem
          />
          <TextButton
            onClick={props.onSave}
            type="primary"
            text={props.t('Save')}
            isDisabled={!props.isSavingAllowed}
            kitmanDesignSystem
          />
        </div>
      </SlidingPanel>
    </div>
  );
};

export default CategoriesSidePanel;
export const CategoriesSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(CategoriesSidePanel);
