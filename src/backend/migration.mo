import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  type OldUser = {
    id : Principal;
    username : Text;
  };

  type OldPost = {
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    posts : List.List<OldPost>;
    users : Map.Map<Principal, OldUser>;
  };

  type NewUser = {
    id : Principal;
    username : Text;
    location : Text;
  };

  type NewPost = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    status : { #pendingReview; #approved; #rejected };
  };

  type NewActor = {
    posts : List.List<NewPost>;
    userProfiles : Map.Map<Principal, NewUser>;
    nextPostId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    var postId : Nat = 0;
    let newPosts = old.posts.map<OldPost, NewPost>(
      func(oldPost) {
        let post = {
          id = postId;
          author = oldPost.author;
          content = oldPost.content;
          timestamp = oldPost.timestamp;
          status = #pendingReview;
        };
        postId += 1;
        post;
      }
    );
    let newUserProfiles = old.users.map<Principal, OldUser, NewUser>(
      func(_id, oldUser) {
        {
          oldUser with
          location = "";
        };
      }
    );
    {
      posts = newPosts;
      userProfiles = newUserProfiles;
      nextPostId = postId;
    };
  };
};
