import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Post, UserProfile, PostStatus } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useCommunityFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['communityFeed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommunityFeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const principal = Principal.fromText(userId);
        return await actor.getUserProfile(principal);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useUserPosts(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const principal = Principal.fromText(userId);
        return await actor.getUserPosts(principal);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['postsByStatus'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetPostsByStatus(status: PostStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['postsByStatus', status],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPostsByStatus(status);
      } catch (error) {
        console.error('Error fetching posts by status:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.approvePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

export function useRejectPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.rejectPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}
