// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';

import {
  AppStatus,
  TextButton,
  DelayedLoadingFeedback,
} from '@kitman/components';
import { useGetTrainingVariablesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { ScaleColoursFormTranslated as ScaleColoursForm } from './ScaleColoursForm';
import { ScaleColourPaletteTranslated as ScaleColourPalette } from './ScaleColourPalette';

type Props = {};

const ScaleColours = (props: I18nProps<Props>) => {
  const [showNewScaleColoursForm, setShowNewScaleColoursForm] = useState(false);
  const [scaleColours, setScaleColours] = useState([]);
  const [coloursRequestStatus, setColoursRequestStatus] = useState('LOADING');

  const {
    data: { training_variables: trainingVariables } = {
      training_variables: [],
    },
    isLoading: isTrainingVariablesLoading,
    isError: hasTrainingVariablesErrored,
  } = useGetTrainingVariablesQuery({ platformId: 4 });

  useEffect(() => {
    // Fetch colour schemes
    $.ajax({
      url: '/colour_schemes',
      method: 'GET',
    })
      .done((data) => {
        setScaleColours(data.colour_schemes);
        setColoursRequestStatus(null);
      })
      .fail(() => {
        setColoursRequestStatus('ERROR');
      });
  }, []);

  if (coloursRequestStatus === 'LOADING' || isTrainingVariablesLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (coloursRequestStatus === 'ERROR' || hasTrainingVariablesErrored) {
    return <AppStatus status="error" isEmbed />;
  }

  const trainingVariablesAlreadySelected = scaleColours.reduce(
    (accumulator, colourPalette) => {
      return accumulator.concat(
        colourPalette.metrics.map(({ record }) => record.id)
      );
    },
    []
  );

  return (
    <div className="scaleColours">
      <div className="scaleColours__introText">
        {props.t('Set colour preferences for metric scales.')}
      </div>

      {scaleColours.map((scaleColourPalette) => (
        <ScaleColourPalette
          scaleColourPalette={scaleColourPalette}
          trainingVariables={trainingVariables}
          trainingVariablesAlreadySelected={trainingVariablesAlreadySelected}
          onEditSuccess={(colourPalette) => {
            setScaleColours((prevScaleColours) =>
              prevScaleColours.map((prevColourPalette) =>
                prevColourPalette.id === colourPalette.id
                  ? colourPalette
                  : prevColourPalette
              )
            );
          }}
          onDeleteSuccess={() => {
            setScaleColours((prevScaleColours) =>
              prevScaleColours.filter(
                (prevColourPalette) =>
                  prevColourPalette.id !== scaleColourPalette.id
              )
            );
          }}
          key={scaleColourPalette.id}
        />
      ))}

      {showNewScaleColoursForm && (
        <ScaleColoursForm
          // The scale colour form should contain only the training variables that
          // are not already selected in the existing palettes
          trainingVariables={trainingVariables.filter(
            (trainingVariable) =>
              !trainingVariablesAlreadySelected.includes(trainingVariable.id)
          )}
          onClickCancel={() => setShowNewScaleColoursForm(false)}
          onSaveSuccess={(colourPalette) => {
            setScaleColours((prevScaleColours) => [
              ...prevScaleColours,
              colourPalette,
            ]);
            setShowNewScaleColoursForm(false);
          }}
        />
      )}

      <div className="scaleColours__addPaletteBtn">
        <TextButton
          text={props.t('Add palette')}
          isDisabled={showNewScaleColoursForm}
          onClick={() => setShowNewScaleColoursForm(true)}
        />
      </div>
    </div>
  );
};

export const ScaleColoursTranslated = withNamespaces()(ScaleColours);
export default ScaleColours;
