import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type UsageRecord = {
    userId : UserId;
    date : Text;
    var requestCount : Nat;
    modelName : Text;
  };

  public type UsageStats = {
    totalRequests : Nat;
    dailyBreakdown : [(Text, Nat)];
    modelBreakdown : [(Text, Nat)];
  };

  public type RecordUsageInput = {
    modelName : Text;
  };
};
