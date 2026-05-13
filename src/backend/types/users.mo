import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type SubscriptionTier = CommonTypes.SubscriptionTier;

  public type UserProfile = {
    id : UserId;
    var email : ?Text;
    var organizationName : ?Text;
    var subscriptionTier : SubscriptionTier;
    createdAt : Timestamp;
  };

  public type UserProfilePublic = {
    id : UserId;
    email : ?Text;
    organizationName : ?Text;
    subscriptionTier : SubscriptionTier;
    createdAt : Timestamp;
  };

  public type CreateUserInput = {
    email : ?Text;
    organizationName : ?Text;
  };

  public type UpdateUserInput = {
    email : ?Text;
    organizationName : ?Text;
    subscriptionTier : ?SubscriptionTier;
  };
};
