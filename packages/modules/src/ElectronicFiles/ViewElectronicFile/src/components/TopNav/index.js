// @flow
import type { ComponentType } from 'react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { selectSelectedMenuItem } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  selectStateFilters,
  updateStateFilter,
  updatePersistedFilter,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import {
  TAGS,
  electronicFilesApi,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import type {
  ElectronicFile,
  NavMeta,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  clearAnyExistingElectronicFileToast,
  generateRouteUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  ACTION_KEY,
  archiveSuccessToast,
  unarchiveSuccessToast,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { Box, IconButton, Tooltip } from '@kitman/playbook/components';

type Props = {
  electronicFile: ?ElectronicFile,
  meta: NavMeta,
};

const TopNav = ({ electronicFile, meta, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const stateFilters = useSelector(selectStateFilters);
  const filters = stateFilters[selectedMenuItem];
  const [updateViewed] = useUpdateViewedMutation();
  const [updateArchived] = useUpdateArchivedMutation();

  const leftActions = [
    {
      id: ACTION_KEY.BACK,
      title: t('Back'),
      icon: KITMAN_ICON_NAMES.ArrowBack,
      onClick: () => locationAssign(generateRouteUrl({ selectedMenuItem })),
      hidden: false,
    },
    {
      id: ACTION_KEY.MARK_AS_UNREAD,
      title: t('Mark as unread'),
      icon: KITMAN_ICON_NAMES.MarkEmailUnreadOutlined,
      onClick: () => {
        updateViewed({
          viewed: false,
          inboundElectronicFileIds: [electronicFile?.id],
        });
        // redirect to inbox after mark as unread action
        locationAssign(generateRouteUrl({ selectedMenuItem }));
      },
      hidden:
        /*
         * Mark as unread is hidden if:
         * electronicFile is null
         * electronicFile is not null but archived
         * electronicFile is outbound
         */
        !electronicFile ||
        electronicFile.archived ||
        typeof electronicFile?.viewed === 'undefined',
    },
    {
      id: ACTION_KEY.TOGGLE_ARCHIVED,
      title: electronicFile?.archived ? t('Unarchive') : t('Archive'),
      icon: electronicFile?.archived
        ? KITMAN_ICON_NAMES.UnarchiveOutlined
        : KITMAN_ICON_NAMES.ArchiveOutlined,
      onClick: () => {
        updateArchived({
          archived: !electronicFile?.archived,
          inboundElectronicFileIds: [electronicFile?.id],
        }).then(() => {
          /*
           * if we have filters, we need to update the filter to
           * match the archive action so that the file is found
           */
          if (filters) {
            dispatch(
              updateStateFilter({
                selectedMenuItem,
                partialFilter: {
                  archived: !electronicFile?.archived,
                },
              })
            );
            /*
             * if we do not have filters, we need to invalidate the cache
             * so that the GET request without filters is triggered
             */
          } else {
            dispatch(
              electronicFilesApi.util.invalidateTags([
                TAGS.INBOUND_ELECTRONIC_FILE,
              ])
            );
          }
        });
        clearAnyExistingElectronicFileToast(dispatch);
        dispatch(
          add(
            electronicFile?.archived
              ? unarchiveSuccessToast()
              : archiveSuccessToast()
          )
        );
        // update filters so we always redirect to inbox
        dispatch(
          updatePersistedFilter({
            selectedMenuItem,
            partialFilter: {
              archived: false,
            },
          })
        );

        // redirect to inbox after archive action
        locationAssign(generateRouteUrl({ selectedMenuItem }));
      },
      /*
       * Archive/Unarchive is hidden if:
       * electronicFile is null
       * electronicFile is outbound
       */
      hidden: !electronicFile || typeof electronicFile.viewed === 'undefined',
    },
  ];

  const rightActions = [
    {
      id: ACTION_KEY.PREV,
      title: t('Previous'),
      icon: KITMAN_ICON_NAMES.ArrowBackIos,
      onClick: () =>
        meta.prev_id &&
        locationAssign(
          generateRouteUrl({ selectedMenuItem, id: meta.prev_id })
        ),
      /*
       * Navigating to previous eFile is hidden if:
       * electronicFile is null
       * meta.prev_id is null
       */
      hidden: !electronicFile || !meta.prev_id,
    },
    {
      id: ACTION_KEY.NEXT,
      title: t('Next'),
      icon: KITMAN_ICON_NAMES.ArrowForwardIos,
      onClick: () =>
        meta.next_id &&
        locationAssign(
          generateRouteUrl({ selectedMenuItem, id: meta.next_id })
        ),
      /*
       * Navigating to next eFile is hidden if:
       * electronicFile is null
       * meta.next_id is null
       */
      hidden: !electronicFile || !meta.next_id,
    },
  ];

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        {leftActions
          .filter((action) => !action.hidden)
          .map((action) => (
            <Tooltip key={action.id} title={action.title}>
              <IconButton color="primary" onClick={action.onClick} size="small">
                <KitmanIcon name={action.icon} />
              </IconButton>
            </Tooltip>
          ))}
      </Box>
      <Box display="flex" alignItems="center">
        {rightActions
          .filter((action) => !action.hidden)
          .map((action) => (
            <Tooltip key={action.id} title={action.title}>
              <IconButton color="primary" onClick={action.onClick} size="small">
                <KitmanIcon name={action.icon} />
              </IconButton>
            </Tooltip>
          ))}
      </Box>
    </Box>
  );
};

export const TopNavTranslated: ComponentType<Props> = withNamespaces()(TopNav);
export default TopNav;
