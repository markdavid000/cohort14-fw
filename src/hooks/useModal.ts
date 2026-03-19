// src/hooks/useModal.ts
import { useState } from 'react';
import { type ModalState } from '../types/IMultisig';

export const useModal = () => {
  const [modals, setModals] = useState<ModalState>({
    newTransaction: false,
    approveTransaction: null,
    addOwner: false,
    removeOwner: false,
    changeThreshold: false,
    replaceOwner: false,
  });

  const openNewTransaction = () =>
    setModals((m) => ({ ...m, newTransaction: true }));

  const closeNewTransaction = () =>
    setModals((m) => ({ ...m, newTransaction: false }));

  const openApproveTransaction = (txId: string) =>
    setModals((m) => ({ ...m, approveTransaction: txId }));

  const closeApproveTransaction = () =>
    setModals((m) => ({ ...m, approveTransaction: null }));

  const openAddOwner = () =>
    setModals((m) => ({ ...m, addOwner: true }));

  const closeAddOwner = () =>
    setModals((m) => ({ ...m, addOwner: false }));

  const openRemoveOwner = () =>
    setModals((m) => ({ ...m, removeOwner: true }));

  const closeRemoveOwner = () =>
    setModals((m) => ({ ...m, removeOwner: false }));

  const openChangeThreshold = () =>
    setModals((m) => ({ ...m, changeThreshold: true }));

  const closeChangeThreshold = () =>
    setModals((m) => ({ ...m, changeThreshold: false }));

  const openReplaceOwner = () =>
    setModals((m) => ({ ...m, replaceOwner: true }));

  const closeReplaceOwner = () =>
    setModals((m) => ({ ...m, replaceOwner: false }));

  const closeAllModals = () =>
    setModals({
      newTransaction: false,
      approveTransaction: null,
      addOwner: false,
      removeOwner: false,
      changeThreshold: false,
      replaceOwner: false,
    });

  return {
    modals,
    openNewTransaction,
    closeNewTransaction,
    openApproveTransaction,
    closeApproveTransaction,
    openAddOwner,
    closeAddOwner,
    openRemoveOwner,
    closeRemoveOwner,
    openChangeThreshold,
    closeChangeThreshold,
    openReplaceOwner,
    closeReplaceOwner,
    closeAllModals,
  };
};