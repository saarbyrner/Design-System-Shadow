// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import {
  AppStatus,
  ColourPalette,
  MultiSelectDropdown,
  TextButton,
} from '@kitman/components';
import type { MultiSelectDropdownItems } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ScaleColours } from './types';

type Props = {
  scaleColourPalette?: ScaleColours,
  trainingVariables: MultiSelectDropdownItems,
  onClickCancel: Function,
  onSaveSuccess: Function,
};

const saveScaleColours = async (scaleColourPaletteId, palette, metrics) => {
  const url = scaleColourPaletteId
    ? `/colour_schemes/${scaleColourPaletteId}`
    : '/colour_schemes';

  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      contentType: 'application/json',
      method: scaleColourPaletteId ? 'PUT' : 'POST',
      data: JSON.stringify({
        name: 'Palette',
        conditions: palette.map((colour, index) => ({
          condition: 'equals',
          value1: index,
          colour,
        })),
        metrics: metrics.map((metricId) => ({
          record_type: 'TrainingVariable',
          record_id: parseInt(metricId, 10),
        })),
      }),
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });
};

const ScaleColoursForm = (props: I18nProps<Props>) => {
  const DEFAULT_COLOUR = '#DEDEDE';
  const [palette, setPalette] = useState(
    props.scaleColourPalette
      ? props.scaleColourPalette.conditions.map((condition) => condition.colour)
      : [DEFAULT_COLOUR]
  );
  const [metrics, setMetrics] = useState(
    props.scaleColourPalette
      ? props.scaleColourPalette.metrics.map((metric) =>
          metric.record.id.toString()
        )
      : []
  );
  const [isMetricsFieldValid, setIsMetricsFieldValid] = useState(
    metrics.length > 0
  );
  const [revealFormErrors, setRevealFormErrors] = useState(false);
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    setIsMetricsFieldValid(metrics.length > 0);
  }, [metrics]);

  const onClickSave = () => {
    if (!isMetricsFieldValid) {
      setRevealFormErrors(true);
      return;
    }

    setAppStatus('loading');
    saveScaleColours(props.scaleColourPalette?.id, palette, metrics).then(
      (res) => {
        setAppStatus(null);
        props.onSaveSuccess(res.colour_scheme);
      },
      () => {
        setAppStatus('error');
      }
    );
  };

  return (
    <div className="scaleColoursForm">
      <div className="scaleColoursForm__mainContent">
        <div className="scaleColoursForm__palette">
          <div className="scaleColoursForm__paletteLabel">
            {props.t('Palette')}
          </div>
          <ColourPalette
            onUpdateColours={(newPalette) => setPalette(newPalette)}
            palette={palette}
            defaultColour={DEFAULT_COLOUR}
            min={1}
          />
        </div>
        <div className="scaleColoursForm__metricsDropdown">
          <MultiSelectDropdown
            label={props.t('Metrics')}
            listItems={props.trainingVariables.map(({ id, name }) => ({
              id,
              name,
            }))}
            selectedItems={metrics}
            onItemSelect={(checkbox) => {
              if (checkbox.checked) {
                setMetrics((prevMetrics) => [...prevMetrics, checkbox.id]);
              } else {
                setMetrics((prevMetrics) =>
                  prevMetrics.filter((metricId) => metricId !== checkbox.id)
                );
              }
            }}
            onSelectAll={(allMetrics) => {
              let metricsSelection = [];

              if (metrics.length === 0) {
                // all items unchecked, check all
                metricsSelection = allMetrics.map(({ id }) => id.toString());
              } else {
                // all items checked OR some items checked, uncheck all
                metricsSelection = [];
              }
              setMetrics(metricsSelection);
            }}
            invalid={revealFormErrors && !isMetricsFieldValid}
            hasSelectAll
            hasSearch
          />
        </div>
      </div>

      <div className="scaleColoursForm__footer">
        <TextButton
          text={props.t('Cancel')}
          type="secondary"
          onClick={() => props.onClickCancel()}
        />
        <TextButton
          type="primary"
          text={props.t('Save')}
          onClick={() => onClickSave()}
        />
      </div>
      {appStatus && <AppStatus status={appStatus} />}
    </div>
  );
};

export const ScaleColoursFormTranslated = withNamespaces()(ScaleColoursForm);
export default ScaleColoursForm;
