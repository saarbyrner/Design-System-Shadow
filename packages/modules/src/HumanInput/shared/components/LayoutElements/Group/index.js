// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type {
  HumanInputFormElement,
  Mode,
} from '@kitman/modules/src/HumanInput/types/forms';
import i18n from '@kitman/common/src/utils/i18n';
import {
  DEFAULT_COLUMNS,
  INPUT_ELEMENTS,
  MODES,
} from '@kitman/modules/src/HumanInput/shared/constants';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Button,
  IconButton,
  Typography,
} from '@kitman/playbook/components';
import { validationResult } from '@kitman/modules/src/HumanInput/shared/utils/validation';
import { onUpdateField } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { onDeleteAttachmentFromRepeatableGroup } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { getChildValidationValuesFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';
import { getChildValuesFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { parseFormInputElement } from '@kitman/modules/src/HumanInput/shared/utils';
import ConditionalRender from '@kitman/modules/src/HumanInput/shared/components/ContainerElements/ConditionalRender';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';

type Props = {
  element: HumanInputFormElement,
  mode: Mode,
};

const Group = ({ element, mode }: Props) => {
  const dispatch = useDispatch();
  const { form_elements: formElements, config } = element;
  const { custom_params: customParams, repeatable = false } = config;
  const elementChildIds = element.form_elements?.map(({ id }) => id) || [];
  const elementChildsValues = useSelector(
    getChildValuesFactory(elementChildIds)
  );
  const elementValidationValues = useSelector(
    getChildValidationValuesFactory(elementChildIds)
  );
  const [repeatedGroupElements, setRepeatedGroupElements] = useState([
    { formElements },
  ]);
  const isViewMode = mode === MODES.VIEW;
  const groupTitle = element.config?.title;
  const showTitle = !!element.config?.custom_params?.show_title;

  useEffect(() => {
    if (repeatable && elementChildsValues) {
      const numberOfRepeatedGroups = Object.values(elementChildsValues).reduce(
        (accumulator, childElementAnswer) => {
          if (
            Array.isArray(childElementAnswer) &&
            childElementAnswer.length > accumulator
          ) {
            return childElementAnswer.length;
          }
          return accumulator;
        },
        1
      );

      if (numberOfRepeatedGroups > 1) {
        const updatedRepeatedGroupElements = [...repeatedGroupElements];
        for (let i = 0; i < numberOfRepeatedGroups - 1; i++) {
          updatedRepeatedGroupElements.push({ formElements });
        }

        setRepeatedGroupElements(updatedRepeatedGroupElements);
      }
    }
    // we only want to run this effect on mount
  }, []);

  const handleAddGroupClick = () => {
    if (!elementChildsValues || !elementValidationValues) {
      return;
    }

    setRepeatedGroupElements([...repeatedGroupElements, { formElements }]);

    Object.keys(elementChildsValues).forEach((elementId) => {
      const elementAnswers = [...elementChildsValues[elementId]];
      const elementValidation = [...elementValidationValues[elementId]];
      const childElement = formElements.find(
        ({ id }) => id.toString() === elementId
      );

      elementAnswers.push(null);
      elementValidation.push({
        status: childElement?.config?.optional
          ? validationResult.VALID
          : validationResult.PENDING,
        message: null,
      });

      dispatch(
        onUpdateField({
          [elementId]: elementAnswers,
        })
      );

      dispatch(
        onUpdateValidation({
          [elementId]: elementValidation,
        })
      );
    });
  };

  const renderGroupElement = () => {
    if (repeatable) {
      return (
        <>
          {showTitle && groupTitle && (
            <Typography
              variant="h6"
              color={colors.grey_200}
              sx={{
                fontSize: { xs: '0.8rem', sm: '1.1rem' },

                fontWeight: 500,
                marginBottom: 1,
                paddingBottom: 1,
              }}
            >
              {groupTitle}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid
              sx={{
                borderLeft: '1px solid rgba(59, 73, 96, 0.12)',
                ml: 0.5,
              }}
              container
              spacing={4}
              columns={4}
              p={0}
              justifyContent="flex-end"
            >
              {repeatedGroupElements.map(
                ({ formElements: repeatableGroupFormElements }, index) => {
                  return (
                    <>
                      {index > 0 && !isViewMode && (
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            if (
                              !elementChildsValues ||
                              !elementValidationValues
                            ) {
                              return;
                            }

                            setRepeatedGroupElements((groups) =>
                              groups.filter((g, i) => i !== index)
                            );

                            // update form Answers AND validation asociated with the group to delete

                            Object.keys(elementChildsValues).forEach(
                              (elementId) => {
                                const elementAnswers = [
                                  ...elementChildsValues[elementId],
                                ];
                                const elementValidation = [
                                  ...elementValidationValues[elementId],
                                ];
                                elementAnswers.splice(index, 1);
                                elementValidation.splice(index, 1);

                                const isChildElementAttachment =
                                  formElements.some(
                                    ({ id, element_type: elementType }) =>
                                      id === Number(elementId) &&
                                      elementType === INPUT_ELEMENTS.Attachment
                                  );

                                dispatch(
                                  onUpdateField({
                                    [elementId]: elementAnswers,
                                  })
                                );

                                dispatch(
                                  onUpdateValidation({
                                    [elementId]: elementValidation,
                                  })
                                );

                                if (isChildElementAttachment) {
                                  dispatch(
                                    onDeleteAttachmentFromRepeatableGroup({
                                      elementId,
                                      groupNumber: index,
                                      isDeleteGroupAction: true,
                                    })
                                  );
                                }
                              }
                            );
                          }}
                        >
                          <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
                        </IconButton>
                      )}

                      {repeatableGroupFormElements.map((ele) => {
                        return (
                          ele.visible && (
                            <Grid
                              item
                              xs={customParams?.columns || DEFAULT_COLUMNS}
                              key={ele.config.element_id}
                            >
                              {parseFormInputElement({
                                element: ele,
                                mode,
                                repeatableGroupInfo: {
                                  repeatable,
                                  groupNumber: index,
                                },
                              })}
                            </Grid>
                          )
                        );
                      })}
                    </>
                  );
                }
              )}
            </Grid>

            {repeatable && !isViewMode && (
              <Button
                color="secondary"
                onClick={handleAddGroupClick}
                sx={{ mt: 2 }}
              >
                {i18n.t('Add')}
              </Button>
            )}
          </Grid>
        </>
      );
    }

    // render regular group element and its childs
    return (
      <>
        {showTitle && groupTitle && (
          <Typography
            variant="h6"
            color={colors.grey_200}
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 500,
              marginBottom: 1,
              paddingBottom: 1,
            }}
          >
            {groupTitle}
          </Typography>
        )}
        <Grid container spacing={2} columns={4} p={0}>
          {formElements.map((ele) => {
            return (
              ele.visible && (
                <Grid
                  item
                  xs={customParams?.columns || DEFAULT_COLUMNS}
                  key={ele.config.element_id}
                >
                  {parseFormInputElement({
                    element: ele,
                    mode,
                  })}
                </Grid>
              )
            );
          })}
        </Grid>
      </>
    );
  };

  return (
    <ConditionalRender element={element}>
      {customParams?.type === 'collapsible' ? (
        <Accordion>
          <AccordionSummary
            expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
          >
            {config.title}
          </AccordionSummary>
          <AccordionDetails>{renderGroupElement()}</AccordionDetails>
        </Accordion>
      ) : (
        renderGroupElement()
      )}
    </ConditionalRender>
  );
};

export default Group;
