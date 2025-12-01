// @flow
import {
  Modal,
  TextButton,
  ActivityDrillPanelTranslated,
} from '@kitman/components';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import type {
  PlanningSidePanelStates,
  LibraryDrillToUpdate,
} from '@kitman/modules/src/PlanningEvent/types';
import { PLANNING_SIDE_PANEL_STATES } from '@kitman/modules/src/PlanningEvent/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';

type Props = {
  libraryDrillToUpdate: LibraryDrillToUpdate,
  isOpen: boolean,
  onComposeActivityDrill: (LibraryDrillToUpdate) => Promise<?Error>,
  setActivityPanelMode: (PlanningSidePanelStates) => void,
  setLibraryDrillToUpdate: (LibraryDrillToUpdate) => void,
  setSelectedDrill: (EventActivityDrillV2) => void,
};

const UpdateDrillLibraryItemModal = (props: I18nProps<Props>) => {
  const EMPTY_DRILL_LIBRARY_ITEM = {
    drill: null,
    diagram: null,
    attachments: null,
  };

  const onUpdate = async (
    { library }: { library?: boolean } = { library: false }
  ): Promise<void | null> => {
    if (props.libraryDrillToUpdate.drill) {
      const error = await props.onComposeActivityDrill({
        drill: {
          ...props.libraryDrillToUpdate.drill,
          library,
        },
        diagram: props.libraryDrillToUpdate.diagram,
        attachments: props.libraryDrillToUpdate.attachments,
      });

      if (error) return props.setLibraryDrillToUpdate(EMPTY_DRILL_LIBRARY_ITEM);
    }
    props.setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
    props.setLibraryDrillToUpdate(EMPTY_DRILL_LIBRARY_ITEM);
    props.setSelectedDrill(
      ActivityDrillPanelTranslated.INITIAL_DRILL_ATTRIBUTES
    );
    return null;
  };

  return (
    <Modal
      isOpen={props.isOpen}
      outsideClickCloses
      overlapSidePanel
      width="medium"
      onPressEscape={() =>
        props.setLibraryDrillToUpdate(EMPTY_DRILL_LIBRARY_ITEM)
      }
      close={() => props.setLibraryDrillToUpdate(EMPTY_DRILL_LIBRARY_ITEM)}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Drill update options')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div css={style.updateActivityOptions}>
          {!window.getFlag('hide-update-drill-button') && (
            <>
              <b css={style.optionsHeader}>
                {props.t('Update in the library')}
              </b>
              <p>
                {props.t(
                  'This update will change the drill in the library for everyone. (A legacy version of this drill will still appear in all old session plans.)'
                )}
              </p>
              <p>{props.t('Or')}</p>
            </>
          )}
          <b css={style.optionsHeader}>
            {props.t('Update in the session only')}
          </b>
          <p>
            {props.t(
              'Update in this session only This will not effect any drills in your library. It only applies changes to this session.'
            )}
          </p>
        </div>
      </Modal.Content>
      <div css={style.deleteActivityConfirmationButtons}>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={() =>
              props.setLibraryDrillToUpdate(EMPTY_DRILL_LIBRARY_ITEM)
            }
            type="textOnly"
            kitmanDesignSystem
          />

          <div css={style.updateActivityActionButton}>
            <TextButton
              text={props.t('Update in the session only')}
              onClick={onUpdate}
              kitmanDesignSystem
            />
            {!window.getFlag('hide-update-drill-button') && (
              <TextButton
                text={props.t('Update in the library')}
                onClick={() => onUpdate({ library: true })}
                type="primary"
                kitmanDesignSystem
              />
            )}
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default UpdateDrillLibraryItemModal;
