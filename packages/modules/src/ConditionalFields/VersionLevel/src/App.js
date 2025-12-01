// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

import { AppStatus, TabBar } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';

import TabLayout from '@kitman/components/src/TabLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onResetFormState } from '../../shared/redux/slices/conditionBuildViewSlice';
import { useFetchVersionQuery } from '../../shared/services/conditionalFields';
import { VersionAppHeaderTranslated as VersionAppHeader } from '../../shared/components/VersionAppHeader';
import VersionBuildViewTab from './components/VersionBuildViewTab';

const style = {
  organisationApp: {
    backgroundColor: colors.white,
    minHeight: 'calc(100vh - 50px)',
  },
  tabCustomStyle: {
    '.rc-tabs-bar': {
      backgroundColor: colors.p06,
      padding: `0 ${convertPixelsToREM(24)}`,
    },
  },
};

type Props = {
  rulesetId: string,
  versionId: string,
};

const TAB_HASHES = {
  version: '#version',
  settings: '#settings',
};

const VersionApp = ({ rulesetId, versionId, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { data: permissions } = useGetPermissionsQuery();
  const [allFieldsAreValid, setAllFieldsAreValid] = useState(false);
  const activeCondition = useSelector(
    (state) => state.conditionBuildViewSlice.activeCondition
  );
  const [requiredFieldsAndValues, setRequiredFieldsAndValues] = useState({
    ruleName: null,
    question: null,
    questionName: null,
    questionType: null,
  });

  const canViewConditionalFields =
    window.featureFlags['conditional-fields-creation-in-ip'] &&
    (permissions.injurySurveillance?.canAdmin ||
      permissions.logicBuilder?.canAdmin);

  const {
    data: version,
    isLoading: isVersionLoading,
    isError: isVersionError,
  } = useFetchVersionQuery(
    { rulesetId, versionId },
    {
      skip: !canViewConditionalFields || !rulesetId || !versionId,
    }
  );
  // Set the initial value when value retrieved from redux
  useEffect(() => {
    if (activeCondition && activeCondition.id) {
      setAllFieldsAreValid(true);
    }
  }, [activeCondition]);

  // When all required fields are valid enable publish button
  useEffect(() => {
    const areAllFieldsTrue = Object.values(requiredFieldsAndValues).every(
      (value) => value === true
    );
    setAllFieldsAreValid(areAllFieldsTrue);
  }, [requiredFieldsAndValues]);

  const getInitialTabContent = useCallback(() => {
    dispatch(onResetFormState());
    if (isVersionError) {
      return <AppStatus status="error" />;
    }
    if (isVersionLoading) {
      return <TabLayout.Loading />;
    }
    if (version) {
      return (
        <VersionBuildViewTab
          version={version}
          allFieldsAreValid={allFieldsAreValid}
          setAllFieldsAreValid={setAllFieldsAreValid}
          requiredFieldsAndValues={requiredFieldsAndValues}
          setRequiredFieldsAndValues={setRequiredFieldsAndValues}
        />
      );
    }
    // if we got here and there is no version
    // something went wrong
    return <AppStatus status="error" />;
  }, [isVersionError, isVersionLoading, version]);

  const tabs = useMemo(
    () =>
      [
        {
          title: t('Build/view'),
          content: getInitialTabContent(),
          tabHash: TAB_HASHES.version,
          visible: canViewConditionalFields,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    // next line is giving out about t not being included in dep array
    [getInitialTabContent, canViewConditionalFields]
  );

  const defaultTab = useRef(
    tabs.find((tab) => tab.tabHash === window.location.hash)?.tabKey || '0'
  );

  const onClickTab = (tabKey) => {
    const tabHash = tabs.find((tabPane) => tabPane.tabKey === tabKey)?.tabHash;

    if (tabHash) {
      window.location.replace(tabHash);
    }
  };
  return (
    <div style={style.organisationApp}>
      <VersionAppHeader
        isPublished={!!version?.published_at}
        rulesetId={rulesetId}
        versionId={versionId}
        title={version?.name}
        allFieldsAreValid={allFieldsAreValid}
        setAllFieldsAreValid={setAllFieldsAreValid}
        requiredFieldsAndValues={requiredFieldsAndValues}
        setRequiredFieldsAndValues={setRequiredFieldsAndValues}
      />

      {tabs.length > 0 && (
        <TabBar
          customStyles={style.tabCustomStyle}
          tabPanes={tabs.map((tabPane) => ({
            title: tabPane.title,
            content: tabPane.content,
          }))}
          onClickTab={onClickTab}
          initialTab={defaultTab.current}
          destroyInactiveTabPane
          kitmanDesignSystem
        />
      )}
    </div>
  );
};

export const VersionAppTranslated: ComponentType<Props> =
  withNamespaces()(VersionApp);
export default VersionApp;
