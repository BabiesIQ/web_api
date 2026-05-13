import List "mo:core/List";
import Runtime "mo:core/Runtime";
import UserLib "../lib/users";
import UserTypes "../types/users";

mixin (
  users : List.List<UserTypes.UserProfile>,
) {
  public shared ({ caller }) func createUser(input : UserTypes.CreateUserInput) : async UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    // Return existing profile if already created
    switch (UserLib.getUser(users, caller)) {
      case (?existing) { UserLib.toPublic(existing) };
      case null {
        let profile = UserLib.createUser(users, caller, input);
        UserLib.toPublic(profile);
      };
    };
  };

  public shared query ({ caller }) func getUser() : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    switch (UserLib.getUser(users, caller)) {
      case null null;
      case (?user) ?UserLib.toPublic(user);
    };
  };

  public shared ({ caller }) func updateUser(input : UserTypes.UpdateUserInput) : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    UserLib.updateUser(users, caller, input);
  };
};
