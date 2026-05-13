import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type Timestamp = Time.Time;

  public type SubscriptionTier = {
    #free;
    #starter;
    #pro;
    #enterprise;
  };
};
