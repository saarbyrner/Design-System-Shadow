// @flow
import { useState } from 'react';
import type { Node } from 'react';
import {
  Box,
  StaticDateRangePicker,
  Modal,
  Button,
  StaticDatePicker,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onDateSelection: Function,
  onSave: Function,
  onCancel: Function,
  children: Node,
  isDateRange?: boolean,
  date: Date | null | Array<Date | null>,
};

const DateSelection = ({
  onDateSelection,
  onSave,
  onCancel,
  children,
  date,
  isDateRange,
  t,
}: I18nProps<Props>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };

  const handleSave = () => {
    onSave();
    setIsModalOpen(false);
  };

  const isButtonDisabled =
    isDateRange && Array.isArray(date) ? date.some((d) => !d) : !date;

  const CustomActionBar = () => {
    return (
      <Box
        sx={{
          gridColumn: '1 / 4',
          gridRow: '3',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <Button onClick={handleCancel} color="secondary">
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isButtonDisabled}
          color="primary"
        >
          {isDateRange ? t('Save') : t('Revoke')}
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Button
        sx={{
          gap: '5px',
        }}
        onClick={handleOpenModal}
        variant="text"
        className="dateSelection__button"
      >
        {children}
      </Button>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            left: '50%',
            p: 4,
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '100%',
          }}
        >
          {isDateRange ? (
            <StaticDateRangePicker
              label={t('Date range')}
              value={date}
              calendars={2}
              onChange={([firstDate, secondDate]) => {
                onDateSelection([firstDate, secondDate]);
              }}
              slots={{
                actionBar: CustomActionBar,
              }}
            />
          ) : (
            <StaticDatePicker
              label={t('Date')}
              value={date}
              onChange={(pickedDate) => {
                onDateSelection(pickedDate);
              }}
              slots={{
                actionBar: CustomActionBar,
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DateSelection;
