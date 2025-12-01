// @flow
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import getSquadAthletes from '@kitman/services/src/services/settings/squads/[squad_id]/get';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

type ReturnType = {
  getTemplateData: () => Promise<void>,
  templateData: any,
  isTemplateDataLoading: boolean,
};

const useAllAthletesPdfTemplate = (): ReturnType => {
  const dispatch = useDispatch();
  const [isTemplateDataLoading, setIsTemplateDataLoading] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const activeSquad = useSelector(getActiveSquad());

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getTemplateData = async () => {
    setIsTemplateDataLoading(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    getSquadAthletes(activeSquad.id)
      .then((data) => {
        setTemplateData(data);
        const newTimeoutId = setTimeout(() => {
          setIsTemplateDataLoading(false);
          // little hack to change the pdf title
          const originalTitle = document.title;
          document.title = `All Squad - ${new Date().toISOString()}`;
          window.print();
          document.title = originalTitle;
        }, 2000);
        setTimeoutId(newTimeoutId);
      })
      .catch(() => {
        setIsTemplateDataLoading(false);
        setTemplateData(null);
        dispatch(
          add({
            status: toastStatusEnumLike.Error,
            title: i18n.t('Failed to generate template'),
          })
        );
      });
  };

  return {
    getTemplateData,
    templateData,
    isTemplateDataLoading,
  };
};
export default useAllAthletesPdfTemplate;
