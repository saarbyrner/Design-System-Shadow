// @flow
import { Stepper, Step, StepLabel } from '@kitman/playbook/components';

type Props = {
  currentHeadingId: number,
  headings: Array<string>,
};

export default ({ currentHeadingId, headings }: Props) => {
  return (
    <Stepper activeStep={currentHeadingId - 1} alternativeLabel>
      {headings.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
