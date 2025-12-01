// @flow
import { useEffect, type Node } from 'react';
import { Collapse, Box } from '@kitman/playbook/components';
import { useSelector, useDispatch } from 'react-redux';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { validateElement } from '@kitman/modules/src/HumanInput/shared/utils';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import {
  isConditionSatisfied,
  isInEditableMode,
  getFieldValueFactory,
  getChildValuesFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

const conditionBorderLeft = '1px solid rgba(59, 73, 96, 0.12)';

type Props = {
  element: HumanInputFormElement,
  children: Function,
};

const ConditionalRender = (props: Props): Node => {
  const dispatch = useDispatch();
  // eslint-disable-next-line camelcase
  const { condition, custom_params } = props.element?.config || {};
  const shouldRender = useSelector(
    condition ? isConditionSatisfied(condition) : () => true
  );
  /**
   * if data's "custom_params" has property "editable_modes", this will allow you to conditionally render
   * elements if the current mode is within the given array. For example:
   * only display a users role in Edit mode:
   *   editableModes: ["EDIT"]
   * To show it in all modes just not providing the property at would do.
   */
  const renderInEditMode = useSelector(
    custom_params?.editable_modes
      ? isInEditableMode(custom_params.editable_modes)
      : () => true
  );

  const shouldShowBorder = useSelector(
    condition ? isConditionSatisfied(condition) : () => false
  );

  const boxSx = shouldShowBorder
    ? { borderLeft: conditionBorderLeft, paddingLeft: '16px' }
    : {};

  const elementValue = useSelector(getFieldValueFactory(props.element.id));
  const elementChildsValue = useSelector(
    getChildValuesFactory(
      props.element.form_elements?.map((element) => element.id) || []
    )
  );

  useEffect(() => {
    // we should skip validation for elements that are not conditionally rendered
    // we will mark them as VALID to not interfere with the form validation
    // because elements that should not be rendered shouldn't be PENDING
    if (!shouldRender) {
      dispatch(
        onUpdateValidation({
          [props.element.id]: {
            status: 'VALID',
            message: null,
          },
        })
      );

      // same for their form_elements childs
      props.element.form_elements.forEach((element) => {
        dispatch(
          onUpdateValidation({
            [element.id]: {
              status: 'VALID',
              message: null,
            },
          })
        );
      });
    }
  }, [shouldRender, props.element, dispatch]);

  // Stringifying the object and parsing it again inside the useEffect to avoid infinite loops
  // During each render, elementChildsValue object is created from scratch.
  // The useEffect internally compares the dependencies by reference. And since the reference to the map object is different for each render,
  // the effect would be run with every render as well (and we don't want that)
  const childsValueMap = JSON.stringify(elementChildsValue);

  useEffect(() => {
    // we should trigger validation for the elements that have  a condition config and meet the condition criteria
    if (condition && shouldRender) {
      const childsValueMapParsed = JSON.parse(childsValueMap);

      const { status, message } = validateElement(props.element, elementValue);
      dispatch(
        onUpdateValidation({
          [props.element.id]: {
            status,
            message,
          },
        })
      );

      // same for their form_elements childs
      props.element.form_elements.forEach((element) => {
        const { status: statusChild, message: messageChild } = validateElement(
          element,
          childsValueMapParsed[element.id]
        );

        dispatch(
          onUpdateValidation({
            [element.id]: {
              status: statusChild,
              message: messageChild,
            },
          })
        );
      });
    }
  }, [
    condition,
    shouldRender,
    elementValue,
    childsValueMap,
    props.element,
    dispatch,
  ]);

  return (
    <Collapse in={shouldRender && renderInEditMode}>
      <Box sx={boxSx}>{props.children}</Box>
    </Collapse>
  );
};

export default ConditionalRender;
