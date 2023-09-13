import { create } from "zustand";

interface Modalstore {
  isOpen: boolean; //modal open or close
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<Modalstore>()((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
