import List "mo:core/List";
import Runtime "mo:core/Runtime";
import UsageLib "../lib/usage";
import UsageTypes "../types/usage";

mixin (
  usageRecords : List.List<UsageTypes.UsageRecord>,
) {
  public shared ({ caller }) func recordUsage(input : UsageTypes.RecordUsageInput) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    UsageLib.recordUsage(usageRecords, caller, input);
  };

  public shared query ({ caller }) func getUsageStats() : async UsageTypes.UsageStats {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    UsageLib.getUsageStats(usageRecords, caller);
  };
};
