import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types/art';

interface UserState {
  followedArtistIds: string[];
  savedCollectionIds: string[];
  collectedOrders: Order[];
  toggleFollowArtist: (artistId: string) => void;
  isFollowingArtist: (artistId: string) => boolean;
  toggleSaveCollection: (collectionId: string) => void;
  isCollectionSaved: (collectionId: string) => boolean;
  addCollectedOrder: (order: Order) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      followedArtistIds: ['artist-1', 'artist-2'], // default followed for pleasant initial state
      savedCollectionIds: ['col-1', 'col-3'],
      collectedOrders: [],

      toggleFollowArtist: (artistId) =>
        set((state) => {
          const isFollowing = state.followedArtistIds.includes(artistId);
          return {
            followedArtistIds: isFollowing
              ? state.followedArtistIds.filter((id) => id !== artistId)
              : [...state.followedArtistIds, artistId],
          };
        }),

      isFollowingArtist: (artistId) => get().followedArtistIds.includes(artistId),

      toggleSaveCollection: (collectionId) =>
        set((state) => {
          const isSaved = state.savedCollectionIds.includes(collectionId);
          return {
            savedCollectionIds: isSaved
              ? state.savedCollectionIds.filter((id) => id !== collectionId)
              : [...state.savedCollectionIds, collectionId],
          };
        }),

      isCollectionSaved: (collectionId) => get().savedCollectionIds.includes(collectionId),

      addCollectedOrder: (order) =>
        set((state) => ({
          collectedOrders: [order, ...state.collectedOrders],
        })),
    }),
    {
      name: 'atelier-user-storage',
    }
  )
);
