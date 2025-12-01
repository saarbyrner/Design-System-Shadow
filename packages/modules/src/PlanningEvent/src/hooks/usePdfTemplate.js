// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';

import { getMatchDayTemplateData } from '@kitman/services';

import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { getMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';

type ReturnType = {
  getTemplateData: (eventId: ?number) => Promise<void>,
  matchDayView: string,
  templateData: any,
  isTemplateDataLoading: boolean,
};

const usePdfTemplate = (): ReturnType => {
  const dispatch = useDispatch();
  const [isTemplateDataLoading, setIsTemplateDataLoading] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const matchDayView = useSelector(getMatchDayView());

  // Cleanup the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getTemplateData = async (eventId = null) => {
    setIsTemplateDataLoading(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    getMatchDayTemplateData({
      eventId: Number(eventId),
      kind: matchDayView.toLowerCase(),
    })
      .then((data) => {
        setTemplateData(data);
        // Timeout needed to allow images to load for preview.
        const newTimeoutId = setTimeout(() => {
          setIsTemplateDataLoading(false);
          // little hack to change the pdf title
          const originalTitle = document.title;
          document.title = `${originalTitle} - ${new Date().toISOString()}`;
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
    matchDayView,
    templateData,
    isTemplateDataLoading,
  };
};
export default usePdfTemplate;
