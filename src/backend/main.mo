import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use actor migration feature
(with migration = Migration.run)
actor {
  public type PostStatus = { #pendingReview; #approved; #rejected };

  public type UserProfile = {
    id : Principal;
    username : Text;
    location : Text;
  };

  public type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    status : PostStatus;
  };

  module Post {
    public func compareByTimestamp(post1 : Post, post2 : Post) : Order.Order {
      Nat.compare(post2.timestamp.toNat(), post1.timestamp.toNat());
    };
  };

  let posts = List.empty<Post>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextPostId : Nat = 0;

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Get community feed - only approved posts visible to all users
  public query ({ caller }) func getCommunityFeed() : async [Post] {
    let approvedPosts = posts.filter(
      func(post) {
        post.status == #approved;
      }
    );
    approvedPosts.toArray().sort(Post.compareByTimestamp);
  };

  // Get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile - public information
  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    userProfiles.get(userId);
  };

  // Get user posts - users see all their own posts, others only see approved posts
  public query ({ caller }) func getUserPosts(userId : Principal) : async [Post] {
    let userPosts = posts.filter(
      func(post) {
        if (post.author == userId) {
          // If viewing own posts or caller is admin, show all posts
          if (caller == userId or AccessControl.isAdmin(accessControlState, caller)) {
            true;
          } else {
            // Others only see approved posts
            post.status == #approved;
          };
        } else {
          false;
        };
      }
    );
    userPosts.toArray().sort(Post.compareByTimestamp);
  };

  // Save or update caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (caller != profile.id) {
      Runtime.trap("Unauthorized: Can only update own profile");
    };
    userProfiles.add(caller, profile);
  };

  // Create new post (pending review)
  public shared ({ caller }) func createPost(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User must have a profile to post.") };
      case (?_) {
        let newPost : Post = {
          id = nextPostId;
          author = caller;
          content;
          timestamp = Time.now();
          status = #pendingReview;
        };
        nextPostId += 1;
        posts.add(newPost);
      };
    };
  };

  // Approve a post (Admin/Moderator Only)
  public shared ({ caller }) func approvePost(postId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve posts");
    };
    let updatedPosts = List.fromIter<Post>(
      posts.values().map(
        func(post) {
          if (post.id == postId) {
            { post with status = #approved };
          } else {
            post;
          };
        }
      )
    );
    posts.clear();
    posts.addAll(updatedPosts.values());
  };

  // Reject a post (Admin/Moderator Only)
  public shared ({ caller }) func rejectPost(postId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject posts");
    };
    let updatedPosts = List.fromIter<Post>(
      posts.values().map(
        func(post) {
          if (post.id == postId) {
            { post with status = #rejected };
          } else {
            post;
          };
        }
      )
    );
    posts.clear();
    posts.addAll(updatedPosts.values());
  };

  // Get posts by status (Admin/Moderator Only - for moderation dashboard)
  public query ({ caller }) func getPostsByStatus(status : PostStatus) : async [Post] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view posts by status");
    };
    let filteredPosts = posts.filter(
      func(post) {
        post.status == status;
      }
    );
    filteredPosts.toArray();
  };

  // Delete post (Admin/Moderator Only)
  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    let remainingPosts = posts.filter(
      func(post) {
        post.id != postId;
      }
    );
    posts.clear();
    posts.addAll(remainingPosts.values());
  };
};

