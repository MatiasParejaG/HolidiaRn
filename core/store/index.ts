import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '../storage';

interface ShoppingCartStoreInterface {
  item: ICartItem | null;
  addItem: (item: ICartItem) => void;
  removeItem: () => void;
  getItem: () => ICartItem | null;
  getTotalPrice: () => number;
}

const useShoppingCartStore = create<ShoppingCartStoreInterface>()(
  persist(
    (set, get) => ({
      item: null,
      addItem: (newItem) => set({ item: newItem }),
      removeItem: () => set({ item: null }),
      getItem: () => get().item,
      getTotalPrice: () => {
        const { item } = get();
        return item ? item.price_per_night * item.days : 0;
      },
    }),
    {
      name: 'holidia-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
export default useShoppingCartStore;
