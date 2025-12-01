// @flow
import { useState } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  AppStatus,
  CheckboxList,
  TextButton,
  TextLink,
  DelayedLoadingFeedback,
} from '@kitman/components';
import type {
  PrincipleCategories,
  PrinciplePhases,
  PrincipleTypes,
  Principles,
  PrincipleSelectItems,
} from '@kitman/common/src/types/Principles';
import type { EventActivity } from '@kitman/common/src/types/Event';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ActivityPrinciplesFiltersTranslated as ActivityPrinciplesFilters } from './ActivityPrinciplesFilters';
import type { RequestStatus } from '../../../types';

type Props = {
  requestStatus: RequestStatus,
  categories: PrincipleCategories,
  phases: PrinciplePhases,
  types: PrincipleTypes,
  principles: Principles,
  hasInitialPrinciples: boolean,
  hasPrincipleWithCategory: boolean,
  hasPrincipleWithPhase: boolean,
  eventSessionActivity: EventActivity,
  onFilterPrinciplesByItem: Function,
  onFilterPrinciplesBySearch: Function,
  searchPrinciplesFilterChars: string,
  onSave: Function,
  onClose: Function,
};

const getPrincipleSelectItems = (
  principles: Principles
): PrincipleSelectItems =>
  principles.map((principle) => ({
    value: principle.id,
    label: principle.name,
  }));

const ActivityPrinciplesMobilePanel = (props: I18nProps<Props>) => {
  const currentPrincipleIds = props.eventSessionActivity.principles.map(
    (principle) => principle.id
  );
  const [selectedPrincipleIds, setSelectedPrincipleIds] =
    useState<Array<number | string>>(currentPrincipleIds);
  const [isSavingAllowed, setIsSavingAllowed] = useState(false);

  const style = {
    wrapper: css`
      position: fixed;
      left: 0;
      top: 60px;
      background: ${colors.p06};
      padding: 24px;
      width: 100%;
      height: 100%;
      z-index: 1;
    `,

    heading: css`
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
    `,

    title: css`
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    `,

    closeButton: css`
      background-color: transparent;
      border: none;
      color: ${colors.p04};
      font-size: 22px;
      outline: none;
      padding: 0;
    `,

    content: css`
      background-color: ${colors.p06};
      color: ${colors.grey_300};
      height: calc(100vh - 302px);
      margin: 20px 0;
      overflow: auto;

      ul {
        padding: 0;
      }

      li {
        list-style: none;
      }
    `,

    actions: css`
      background-color: ${colors.p06};
      border-top: 1px solid ${colors.neutral_300};
      display: flex;
      justify-content: flex-end;
      padding-top: 18px;
    `,

    emptyMsg: css`
      display: flex;
      color: ${colors.grey_200};
      font-size: 14px;
      justify-content: center;
      margin-top: 10px;
      a {
        margin-left: 4px;
      }
    `,
  };

  const principlesContent =
    props.principles.length > 0 ? (
      <CheckboxList
        values={selectedPrincipleIds}
        items={getPrincipleSelectItems(props.principles)}
        onChange={(principleIds) => {
          setSelectedPrincipleIds(principleIds);
          setIsSavingAllowed(true);
        }}
        kitmanDesignSystem
      />
    ) : (
      <div
        css={style.emptyMsg}
        className="activityPrinciplesMobilePanel__noMatchedPrinciplesMsg"
      >
        <p>{props.t('No principles match the selected filters')}</p>
      </div>
    );

  const noInitialPrinciplesContent = (
    <div
      className="activityPrinciplesMobilePanel__noInitialPrinciplesMsg"
      css={style.emptyMsg}
    >
      <p>
        {props.t(
          'No principles have been created. Create new principles in the'
        )}
        <TextLink
          text={props.t('organisation settings page')}
          href="/settings/organisation/edit"
        />
      </p>
    </div>
  );

  const renderContent = () => {
    switch (props.requestStatus) {
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return props.hasInitialPrinciples
          ? principlesContent
          : noInitialPrinciplesContent;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  };

  return (
    <div className="activityPrinciplesMobilePanel" css={style.wrapper}>
      <div
        className="activityPrinciplesMobilePanel__heading"
        css={style.heading}
      >
        <h3 className="activityPrinciplesMobilePanel__title" css={style.title}>
          {props.t('Principles')}
        </h3>
        <button
          type="button"
          className="icon-close"
          css={style.closeButton}
          onClick={props.onClose}
        />
      </div>
      {props.hasInitialPrinciples && (
        <ActivityPrinciplesFilters
          categories={props.categories}
          phases={props.phases}
          types={props.types}
          hasPrincipleWithCategory={props.hasPrincipleWithCategory}
          hasPrincipleWithPhase={props.hasPrincipleWithPhase}
          onFilterByItem={props.onFilterPrinciplesByItem}
          onFilterBySearch={props.onFilterPrinciplesBySearch}
          searchFilterChars={props.searchPrinciplesFilterChars}
        />
      )}
      <div
        className="activityPrinciplesMobilePanel__content"
        css={style.content}
      >
        {renderContent()}
      </div>
      {props.hasInitialPrinciples && (
        <div
          className="activityPrinciplesMobilePanel__actions"
          css={style.actions}
        >
          <TextButton
            text={props.t('Save')}
            type="primary"
            onClick={() => {
              props.onSave(selectedPrincipleIds);
              props.onClose();
            }}
            isDisabled={!isSavingAllowed}
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );
};

export default ActivityPrinciplesMobilePanel;
export const ActivityPrinciplesMobilePanelTranslated = withNamespaces()(
  ActivityPrinciplesMobilePanel
);
