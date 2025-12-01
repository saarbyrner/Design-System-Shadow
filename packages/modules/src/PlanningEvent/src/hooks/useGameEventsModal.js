// @flow

import i18next from 'i18next';
import { useState } from 'react';
import GameEventsModal from '../components/GameEventsModal';
import type { GameEventsModalType } from '../components/GameEventsModal';

/**
 const Component = () => {
  const modal = useGameEventsModal();

  useEffect(() => {
    const modalParams: GameEventsModalType = {...}
    // trigger modal open somewhere in your code
    modal.show(modalParams);
  }, []);

  return (
    <div>
      {modal.renderModal()}
    </div>
  );
};
*/
const useGameEventsModal = () => {
  const [opts, setOpts] = useState<GameEventsModalType>({
    isOpen: false,
    title: '',
    content: '',
    cancelButtonText: i18next.t('Cancel'),
    confirmButtonText: i18next.t('Confirm'),
    onCancel: () => setOpts({ ...opts, isOpen: false }),
    onClose: () => setOpts({ ...opts, isOpen: false }),
    onConfirm: () => setOpts({ ...opts, isOpen: false }),
    onPressEscape: () => setOpts({ ...opts, isOpen: false }),
  });

  const renderModal = () => {
    if (!opts.isOpen) {
      return null;
    }
    return <GameEventsModal {...opts} />;
  };

  const show = (values: $Shape<GameEventsModalType>) => {
    setOpts({
      ...opts,
      ...values,
      isOpen: true,
    });
  };

  const hide = () => {
    setOpts({ ...opts, isOpen: false });
  };

  const showAsync = (values: $Shape<GameEventsModalType>): Promise<boolean> => {
    const close = () => setOpts({ ...opts, isOpen: false });
    return new Promise((resolve) => {
      setOpts({
        ...opts,
        ...values,
        onCancel: () => {
          close();
          resolve(false);
        },
        onClose: () => {
          close();
          resolve(false);
        },
        onConfirm: () => {
          close();
          resolve(true);
        },
        onPressEscape: () => {
          close();
          resolve(false);
        },
        isOpen: true,
      });
    });
  };

  return {
    renderModal,
    show,
    hide,
    opts,
    showAsync,
  };
};

export default useGameEventsModal;
