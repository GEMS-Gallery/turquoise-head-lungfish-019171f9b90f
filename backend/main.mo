import Nat "mo:base/Nat";
import Order "mo:base/Order";

import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: ?Text;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts : List.List<Post> = List.nil();

  // Mutable variable for post ID
  var nextPostId : Nat = 0;

  // Create a new post
  public func createPost(title: Text, body: Text, author: ?Text) : async Nat {
    let post : Post = {
      id = nextPostId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextPostId += 1;
    nextPostId - 1
  };

  // Get all posts, sorted by recency
  public query func getPosts() : async [Post] {
    let sortedPosts = List.sort(posts, func (a: Post, b: Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });
    List.toArray(sortedPosts)
  };

  // System functions for upgrades
  system func preupgrade() {
    // No need to do anything as we're using a stable variable
  };

  system func postupgrade() {
    // No need to do anything as we're using a stable variable
  };
}
