// @flow
import { useState } from 'react';
import classNames from 'classnames';
import i18n from '@kitman/common/src/utils/i18n';
import { TrackEvent, isColourDark } from '@kitman/common/src/utils';
import { AppStatus, ErrorBoundary, TooltipMenu } from '@kitman/components';
import {
  PREVIEW_FIELD_NUMBERS,
  getProfileWidgetDropdownItemTitleById,
  profileWidgetDropdownItems,
  backgroundColorValueMap,
} from '../utils';
import type { ProfileWidgetInfoField } from '../../types';

type Props = {
  athleteId: string,
  availabilityStatus?: string,
  canManageDashboard: boolean,
  fieldInformation: Array<ProfileWidgetInfoField>,
  imageUrl?: string,
  isPreview?: boolean,
  onDelete: Function,
  onDuplicate: Function,
  onEdit: Function,
  selectedInfoFields: Array<Object>,
  showAvailabilityIndicator: boolean,
  showError?: boolean,
  showSquadNumber: boolean,
  widgetId?: number,
  backgroundColour: string,
};

function ProfileWidget(props: Props) {
  const [feedbackModalStatus, setFeebackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeebackModalMessage] = useState(null);

  const hasDarkBackground = isColourDark(props.backgroundColour || '');
  const isTransparent =
    props.backgroundColour === backgroundColorValueMap.transparent;
  const showBlackFont = !hasDarkBackground || isTransparent;

  const isDashboardUIUpgrade = window.getFlag('rep-dashboard-ui-upgrade');
  const classVersionSuffix = isDashboardUIUpgrade ? 'V2' : '';
  const blackFontClass = showBlackFont
    ? `profileWidget__infoContainer${classVersionSuffix}--blackFont`
    : '';
  const classes = {
    widget: `profileWidget${classVersionSuffix}`,
    widgetMenu: `profileWidget__widgetMenu${classVersionSuffix}`,
    image: `profileWidget__image${classVersionSuffix}`,
    imageContainer: `profileWidget__imageContainer${classVersionSuffix}`,
    infoContainer: `profileWidget__infoContainer${classVersionSuffix}`,
    infoField: `profileWidget__infoField${classVersionSuffix}`,
    contents: `profileWidget__contents${classVersionSuffix}`,
    blackFont: blackFontClass,
  };

  const getWidgetMenu = () => {
    const editWidget = {
      description: i18n.t('Edit Widget'),
      icon: 'icon-edit',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Edit widget profile');
        props.onEdit(
          props.widgetId,
          props.athleteId,
          props.showAvailabilityIndicator,
          props.showSquadNumber,
          props.selectedInfoFields,
          props.backgroundColour
        );
      },
    };

    const duplicateWidget = {
      description: i18n.t('Duplicate Widget'),
      icon: 'icon-duplicate',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Duplicate widget profile');
        props.onDuplicate();
      },
    };

    const deleteWidget = {
      description: i18n.t('Delete'),
      icon: 'icon-bin',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Delete widget profile');
        setFeebackModalStatus('confirm');
        setFeebackModalMessage(
          i18n.t('#sport_specific__Delete_Athlete_Profile_widget?')
        );
      },
    };

    return (
      <TooltipMenu
        placement="bottom-end"
        offset={[10, 10]}
        menuItems={[editWidget, duplicateWidget, deleteWidget]}
        onVisibleChange={(isVisible) => {
          if (isVisible) {
            TrackEvent(
              'Meat ball menu profile widget',
              'Click',
              'Open profile widget menu'
            );
          } else {
            TrackEvent(
              'Meat ball menu profile widget',
              'Click',
              'Close profile widget menu'
            );
          }
        }}
        tooltipTriggerElement={
          <button type="button" className={classes.widgetMenu}>
            <i
              className={
                isDashboardUIUpgrade
                  ? `icon-hamburger-circled-dots ${blackFontClass}`
                  : 'icon-more'
              }
            />
          </button>
        }
        kitmanDesignSystem
      />
    );
  };

  const availabilityIndicatorClasses = classNames(
    `profileWidget__availabilityIndicator${classVersionSuffix}`,
    {
      'profileWidget__availabilityIndicator--injured':
        props.availabilityStatus === 'injured',
      'profileWidget__availabilityIndicator--returning':
        props.availabilityStatus === 'returning',
    }
  );

  const showAvailabilityIndicator =
    props.showAvailabilityIndicator &&
    props.availabilityStatus !== 'available' &&
    props.availabilityStatus !== null;

  const showWidgetMenu = !props.isPreview && props.canManageDashboard;

  const showPreviewNumberFields =
    !props.fieldInformation.length && props.selectedInfoFields.length;

  const profileWidgetItems = profileWidgetDropdownItems({
    isKeyValuePair: true,
  });

  const renderInfoField = (field) => {
    if (isDashboardUIUpgrade) {
      return (
        <p className={classes.infoField}>
          <span>{profileWidgetItems[field.name]}</span>
          <br />
          <span>{field.value}</span>
        </p>
      );
    }
    return <span className={classes.infoField}>{field.value}</span>;
  };

  // Following template will only be rendered if there are is no athlete selected.
  const renderPreviewNumberFields = () =>
    PREVIEW_FIELD_NUMBERS.map((_, index) => (
      <span className={classes.infoField}>
        {getProfileWidgetDropdownItemTitleById(
          props.selectedInfoFields[index].name
        )}
      </span>
    ));

  const renderErrorMessage = () => (
    <div className="profileWidget__errorOverlay">
      <span className="profileWidget__errorMessage">
        {i18n.t('#sport_specific__Select_a_single_athlete_to_view_this_widget')}
      </span>
    </div>
  );

  const backgroundColourStyles = { background: props.backgroundColour };

  return (
    <ErrorBoundary>
      <div
        className={classes.widget}
        style={isDashboardUIUpgrade ? backgroundColourStyles : {}}
      >
        {props.showError && renderErrorMessage()}
        {showWidgetMenu && getWidgetMenu()}
        <div className={classes.contents}>
          <div className={classes.imageContainer}>
            {showAvailabilityIndicator && (
              <div
                className={`${classes.widget}__availabilityIndicatorContainer`}
              >
                <span className={availabilityIndicatorClasses} />
              </div>
            )}
            <img
              className={classes.image}
              src={props.imageUrl === null ? '/img/avatar.jpg' : props.imageUrl}
              alt=""
            />
          </div>
          <div className={`${classes.infoContainer} ${classes.blackFont}`}>
            {!!props.fieldInformation.length &&
              props.fieldInformation.map((field) => renderInfoField(field))}

            {showPreviewNumberFields && renderPreviewNumberFields()}
          </div>
        </div>
      </div>
      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        confirmButtonText={i18n.t('Delete')}
        hideConfirmation={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        close={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        confirmAction={() => {
          props.onDelete();
        }}
      />
    </ErrorBoundary>
  );
}

ProfileWidget.defaultProps = {
  imageUrl: '/img/avatar.jpg',
  fieldInformation: [],
  isPreview: false,
  showError: false,
};

export default ProfileWidget;
