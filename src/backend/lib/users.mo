import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/users";

module {
  public func createUser(
    users : List.List<Types.UserProfile>,
    id : Types.UserId,
    input : Types.CreateUserInput,
  ) : Types.UserProfile {
    let profile : Types.UserProfile = {
      id;
      var email = input.email;
      var organizationName = input.organizationName;
      var subscriptionTier = #free;
      createdAt = Time.now();
    };
    users.add(profile);
    profile;
  };

  public func getUser(
    users : List.List<Types.UserProfile>,
    id : Types.UserId,
  ) : ?Types.UserProfile {
    users.find(func(u) { Principal.equal(u.id, id) });
  };

  public func updateUser(
    users : List.List<Types.UserProfile>,
    id : Types.UserId,
    input : Types.UpdateUserInput,
  ) : ?Types.UserProfilePublic {
    switch (users.find(func(u) { Principal.equal(u.id, id) })) {
      case null null;
      case (?user) {
        switch (input.email) {
          case (?e) { user.email := ?e };
          case null {};
        };
        switch (input.organizationName) {
          case (?o) { user.organizationName := ?o };
          case null {};
        };
        switch (input.subscriptionTier) {
          case (?tier) { user.subscriptionTier := tier };
          case null {};
        };
        ?toPublic(user);
      };
    };
  };

  public func toPublic(user : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = user.id;
      email = user.email;
      organizationName = user.organizationName;
      subscriptionTier = user.subscriptionTier;
      createdAt = user.createdAt;
    };
  };
};
