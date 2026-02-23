import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    id: Principal;
    username: string;
    location: string;
}
export interface Post {
    id: bigint;
    status: PostStatus;
    content: string;
    author: Principal;
    timestamp: Time;
}
export enum PostStatus {
    pendingReview = "pendingReview",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approvePost(postId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityFeed(): Promise<Array<Post>>;
    getPostsByStatus(status: PostStatus): Promise<Array<Post>>;
    getUserPosts(userId: Principal): Promise<Array<Post>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectPost(postId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
