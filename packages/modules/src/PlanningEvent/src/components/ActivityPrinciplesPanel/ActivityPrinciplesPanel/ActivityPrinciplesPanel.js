// @flow
import { useRef, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SortableElement,
  SortableContainer,
  SortableHandle,
} from 'react-sortable-hoc';
import { css } from '@emotion/react';
import { colors, shadows } from '@kitman/common/src/variables';
import {
  AppStatus,
  SlidingPanel,
  TextLink,
  DelayedLoadingFeedback,
} from '@kitman/components';
import type {
  PrincipleCategories,
  PrinciplePhases,
  PrincipleTypes,
  Principle,
  Principles,
} from '@kitman/common/src/types/Principles';
import { TrackEvent } from '@kitman/common/src/utils';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ActivityPrinciplesFiltersTranslated as ActivityPrinciplesFilters } from '../ActivityPrinciplesFilters';
import type { RequestStatus } from '../../../../types';

import styles from './style';

type Props = {
  isOpen: boolean,
  requestStatus: RequestStatus,
  categories: PrincipleCategories,
  phases: PrinciplePhases,
  types: PrincipleTypes,
  principles: Principles,
  hasInitialPrinciples: boolean,
  hasPrincipleWithCategory: boolean,
  hasPrincipleWithPhase: boolean,
  withMetaInformation: boolean,
  isAddButtonEnabled: boolean,
  cssTop: number,
  onClose: Function,
  onFilterPrinciplesByItem: Function,
  onFilterPrinciplesBySearch: Function,
  searchPrinciplesFilterChars: string,
  onDragPrinciple: Function,
  onDropPrinciple: Function,
  // Required if isAddButtonEnabled === true.
  onAddPrinciple?: (number | string) => void,
};

const DragHandle = SortableHandle(() => <span className="icon-drag-handle" />);

const DraggableItem = SortableElement(
  (props: {
    item: Principle,
    isDragging: boolean,
    isAddButtonEnabled: boolean,
    // Required if isAddButtonEnabled === true.
    onAddPrinciple?: (number | string) => void,
  }) => (
    <li css={styles.draggableItem}>
      <DragHandle />
      {props.isAddButtonEnabled && !props.isDragging && (
        <span
          className="icon-add"
          onClick={() => props.onAddPrinciple?.(props.item.id)}
        />
      )}
      {getPrincipleNameWithItems(props.item)}
    </li>
  )
);

const DraggableList = SortableContainer(
  (props: {
    withFilters: boolean,
    isDragging: boolean,
    isAddButtonEnabled: boolean,
    principles: Principles,
    // Required if isAddButtonEnabled === true.
    onAddPrinciple?: (number | string) => void,
  }) => (
    <ul
      css={css`
        li {
          color: ${colors.grey_100};
          backgroundcolor: ${colors.white};
          transform: none !important;

          &:hover {
            background-color: ${!props.isDragging && colors.neutral_300};
            box-shadow: ${!props.isDragging && shadows.section};
          }

          span:hover {
            cursor: ${props.isDragging ? 'grabbing' : 'grab'};
          }
        }
      `}
    >
      {props.principles.map((principle, index) => (
        <DraggableItem
          item={principle}
          index={index}
          key={principle.id}
          isAddButtonEnabled={props.isAddButtonEnabled}
          onAddPrinciple={props.onAddPrinciple}
        />
      ))}
    </ul>
  )
);

const ActivityPrinciplesPanel = (props: I18nProps<Props>) => {
  const principlesPanelContentRef = useRef<HTMLDivElement | null>(null);
  const [principleIdDragged, setPrincipleIdDragged] = useState<
    number | string | null
  >(null);

  const withFilters = [props.categories, props.types, props.phases].some(
    (filter) => filter.length > 0
  );

  const style = {
    content: css`
      margin: 10px 24px 0;
      position: relative;

      ul {
        padding: 0 0 60px 0;
        position: absolute;
        width: 100%;
      }

      li {
        border-radius: 3px;
        display: flex;
        list-style: none;
        padding: 10px 4px;
        line-height: 20px;

        span {
          font-size: 20px;
          font-weight: 600;
          margin-right: 8px;
        }
      }

      .activityPrinciplesPanel__draggedItem {
        z-index: 4;
        background-color: ${colors.neutral_300};
        box-shadow: ${shadows.section};
        color: ${colors.grey_100};
      }
    `,

    filters: css`
      position: relative;
      width: 100%;
      z-index: 3;
    `,

    principlesListWrapper: css`
      position: relative;
      margin-top: 1rem;
      height: 100vh;
      overflow: auto;
      width: 100%;
    `,

    ghostList: css`
      li {
        color: ${colors.neutral_200};
      }
    `,

    emptyMsg: css`
      color: $colour-grey-300;
      display: flex;
      justify-content: center;
      position: absolute;
      top: ${props.hasInitialPrinciples && withFilters ? '84px' : '14px'};
      width: 100%;
      z-index: 2;

      a {
        margin-left: 4px;
      }
    `,
  };

  const renderContent = () => {
    switch (props.requestStatus) {
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return props.hasInitialPrinciples ? (
          <>
            <div
              className="activityPrinciplesPanel__filters"
              css={style.filters}
            >
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
            </div>
            {props.principles.length > 0 ? (
              <div
                className="activityPrinciplesPanel__principlesListWrapper"
                css={style.principlesListWrapper}
              >
                <ul
                  className="activityPrinciplesPanel__ghostList"
                  css={style.ghostList}
                >
                  {props.principles.map((principle) => (
                    <li
                      key={principle.id}
                      className="activityPrinciplesPanel__ghostItem"
                      css={css`
                        background-color: ${principle.id ===
                          principleIdDragged && colors.neutral_200};
                        box-shadow: ${principle.id === principleIdDragged &&
                        shadows.section};
                      `}
                    >
                      <span className="icon-drag-handle" />
                      {getPrincipleNameWithItems(principle)}
                    </li>
                  ))}
                </ul>
                <DraggableList
                  {...props}
                  useDragHandle
                  withFilters={withFilters}
                  isDragging={!!principleIdDragged}
                  isAddButtonEnabled={props.isAddButtonEnabled}
                  helperClass="activityPrinciplesPanel__draggedItem"
                  helperContainer={principlesPanelContentRef.current}
                  onSortStart={({ index }) => {
                    setPrincipleIdDragged(props.principles[index].id);
                    TrackEvent('Session Planning', 'Drag', 'Principle');
                    props.onDragPrinciple(props.principles[index]);
                  }}
                  onSortEnd={() => {
                    setPrincipleIdDragged(null);
                    props.onDropPrinciple();
                  }}
                  onAddPrinciple={props.onAddPrinciple}
                />
              </div>
            ) : (
              <div
                className="activityPrinciplesPanel__noMatchedPrinciplesMsg"
                css={style.emptyMsg}
              >
                <p>{props.t('No principles match the selected filters')}</p>
              </div>
            )}
          </>
        ) : (
          <div
            className="activityPrinciplesPanel__noInitialPrinciplesMsg"
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
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  };

  return (
    <div className="activityPrinciplesPanel">
      <SlidingPanel
        align="right"
        cssTop={props.cssTop ?? (props.withMetaInformation ? 250 : 222)}
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Principles')}
        togglePanel={props.onClose}
        width={454}
      >
        <div css={style.content} ref={principlesPanelContentRef}>
          {renderContent()}
        </div>
      </SlidingPanel>
    </div>
  );
};

export default ActivityPrinciplesPanel;
export const ActivityPrinciplesPanelTranslated = withNamespaces()(
  ActivityPrinciplesPanel
);
