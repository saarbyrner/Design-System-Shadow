// @flow
import { useState } from 'react';
import { getFormResults, getFormDataSourceItems } from '@kitman/services';
import type { DataSourceEntry } from '@kitman/services/src/services/getFormDataSourceItems';
import type { IndividualFormResult } from '@kitman/modules/src/HumanInput/types/forms';
import type {
  FormInfo,
  InjuryIllnessSummary,
} from '@kitman/modules/src/Medical/shared/types/medical/QuestionTypes';
import formResultsDataSourceExtractor from '@kitman/modules/src/Medical/shared/utils/formProcessors/formResultsDataSourceExtractor';
import defaultProcessor from '@kitman/modules/src/Medical/shared/utils/formProcessors/formResultsDefaultProcessor';
import kingDevickAndNpcProcessor from '@kitman/modules/src/Medical/shared/utils/formProcessors/kingDevickAndNpcProcessor';
import concussionAssessmentProcessor from '@kitman/modules/src/Medical/shared/utils/formProcessors/concussionAssessmentProcessor';

export type DataSources = {
  [string]: Array<DataSourceEntry>,
  injuries?: ?Array<InjuryIllnessSummary>,
};

const useFormResultsData = () => {
  const [formResults, setFormResults] = useState([]);
  const [formInfo, setFormInfo] = useState<?FormInfo>(null);

  const fetchDataSources = async (
    requiredDataSources,
    dataSourceKeys
  ): DataSources => {
    return Promise.all(requiredDataSources).then((results) => {
      const dataSources: DataSources = dataSourceKeys.reduce(
        (acc, curr, index) => ({ ...acc, [curr]: results[index] }),
        {}
      );
      return dataSources;
    });
  };

  const constructDataSources = async (
    data: IndividualFormResult
  ): DataSources => {
    // Injuries only get added bellow if is a concussion_injury, getFormDataSourceItems won't work with injuries param
    const dataSourceKeys = formResultsDataSourceExtractor(data).filter(
      (key) => key !== 'injuries'
    );
    const requiredDataSources = dataSourceKeys.map((key) =>
      getFormDataSourceItems(key)
    );

    const dataSources: DataSources = await fetchDataSources(
      requiredDataSources,
      dataSourceKeys
    );
    if (data.concussion_injury) {
      const linkedInjuriesAndIllnesses = [
        {
          ...data.concussion_injury.injury,
          type: 'injury',
          occurrence_id: data.concussion_injury.injury_occurrence.id,
          occurrence_date:
            data.concussion_injury.injury_occurrence.occurrence_date,
        },
      ];
      // $FlowIgnore[incompatible-type] Osics issue
      dataSources.injuries = linkedInjuriesAndIllnesses;
    }

    return dataSources;
  };

  const fetchFormResultsData = async (formId: number) => {
    const data = await getFormResults(formId); // Caller catches any errors
    const dataSources: DataSources = await constructDataSources(data);

    let formProcessor;
    switch (data.form.group) {
      case 'king_devick':
      case 'npc': {
        formProcessor = kingDevickAndNpcProcessor;
        break;
      }
      case 'scat5':
      case 'scat5_historic': {
        formProcessor = concussionAssessmentProcessor;
        break;
      }
      default: {
        formProcessor = defaultProcessor;
      }
    }

    const { formattedFormResults, formInfoResult } = formProcessor(
      data,
      dataSources
    );
    setFormResults(formattedFormResults);
    setFormInfo(formInfoResult);
  };

  const resetFormData = () => setFormResults([]);

  return {
    fetchFormResultsData,
    formResults,
    formInfo,
    resetFormData,
  };
};

export default useFormResultsData;
