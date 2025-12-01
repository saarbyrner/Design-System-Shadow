// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import { AppStatus, TooltipMenu } from '@kitman/components';
import type { MultiSelectDropdownItems } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ScaleColoursFormTranslated as ScaleColoursForm } from './ScaleColoursForm';
import type { ScaleColours } from './types';

type Props = {
  scaleColourPalette: ScaleColours,
  trainingVariables: MultiSelectDropdownItems,
  trainingVariablesAlreadySelected: Array<number>,
  onEditSuccess: Function,
  onDeleteSuccess: Function,
};

const ScaleColourPalette = (props: I18nProps<Props>) => {
  const [showMetricList, setShowMetricList] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [appStatus, setAppStatus] = useState(null);

  const deleteColourPalette = () => {
    setAppStatus('loading');

    $.ajax({
      url: `/colour_schemes/${props.scaleColourPalette.id}`,
      contentType: 'application/json',
      method: 'DELETE',
    })
      .done(() => {
        props.onDeleteSuccess();
      })
      .fail(() => {
        setAppStatus('error');
      });
  };

  if (showEditForm) {
    const colourPaletteTrainingVariables = props.scaleColourPalette.metrics.map(
      ({ record }) => record.id
    );

    // The scale colour form should contain only the training variables that
    // are not already selected in other colour palettes
    const formTrainingVariables = props.trainingVariables.filter(
      (trainingVariable) =>
        colourPaletteTrainingVariables.includes(trainingVariable.id) ||
        !props.trainingVariablesAlreadySelected.includes(trainingVariable.id)
    );

    return (
      <ScaleColoursForm
        scaleColourPalette={props.scaleColourPalette}
        trainingVariables={formTrainingVariables}
        onClickCancel={() => setShowEditForm(false)}
        onSaveSuccess={(colourPalette) => {
          props.onEditSuccess(colourPalette);
          setShowEditForm(false);
        }}
      />
    );
  }

  return (
    <div className="scaleColourPalette">
      <TooltipMenu
        placement="bottom-end"
        menuItems={[
          {
            description: props.t('Edit'),
            icon: 'icon-edit',
            onClick: () => setShowEditForm(true),
          },
          {
            description: props.t('Delete'),
            icon: 'icon-bin',
            onClick: () => setShowConfirmDeletion(true),
            isDestructive: true,
          },
        ]}
        tooltipTriggerElement={
          <button type="button" className="scaleColourPalette__dropdownMenuBtn">
            <i className="icon-more" />
          </button>
        }
      />
      <div className="scaleColourPalette__label">{props.t('Palette')}</div>
      <div className="scaleColourPalette__palette">
        {props.scaleColourPalette.conditions.map((condition) => (
          <div
            className="scaleColourPalette__colour"
            style={{
              backgroundColor: `${condition.colour}`,
            }}
            key={condition.id}
          />
        ))}
      </div>
      <div className="scaleColourPalette__label scaleColourPalette__label--noMargin">
        {props.t('{{count}} Metric', {
          count: props.scaleColourPalette.metrics.length,
        })}
      </div>
      {!showMetricList && (
        <button
          className="scaleColourPalette__expandBtn"
          onClick={() => setShowMetricList(true)}
          type="button"
        >
          {props.t('More')}
        </button>
      )}

      {showMetricList && (
        <>
          <ul className="scaleColourPalette__metricList">
            {props.scaleColourPalette.metrics.map((metric, index) => (
              <li key={metric.id}>{`${index + 1}) ${metric.record.name}`}</li>
            ))}
          </ul>
          <button
            className="scaleColourPalette__expandBtn"
            onClick={() => setShowMetricList(false)}
            type="button"
          >
            {props.t('Less')}
          </button>
        </>
      )}

      {showConfirmDeletion && (
        <AppStatus
          status="warning"
          message={props.t('Delete palette?')}
          secondaryMessage={props.t('This action is irreversible.')}
          deleteAllButtonText={props.t('Delete')}
          hideConfirmation={() => {
            setShowConfirmDeletion(false);
          }}
          confirmAction={() => {
            setShowConfirmDeletion(false);
            deleteColourPalette();
          }}
        />
      )}

      {appStatus && <AppStatus status={appStatus} />}
    </div>
  );
};

export const ScaleColourPaletteTranslated =
  withNamespaces()(ScaleColourPalette);
export default ScaleColourPalette;
