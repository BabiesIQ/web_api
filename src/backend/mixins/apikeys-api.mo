import List "mo:core/List";
import Runtime "mo:core/Runtime";
import ApiKeyLib "../lib/apikeys";
import ApiKeyTypes "../types/apikeys";

mixin (
  apiKeys : List.List<ApiKeyTypes.ApiKey>,
) {
  var nextKeyId : Nat = 0;

  public shared ({ caller }) func createApiKey(input : ApiKeyTypes.CreateApiKeyInput) : async ApiKeyTypes.CreateApiKeyResult {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    let id = nextKeyId;
    nextKeyId += 1;
    let (key, rawKey) = ApiKeyLib.createApiKey(apiKeys, id, caller, input);
    {
      key = ApiKeyLib.toPublic(key);
      rawKey;
    };
  };

  public shared query ({ caller }) func listApiKeys() : async [ApiKeyTypes.ApiKeyPublic] {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    ApiKeyLib.listApiKeys(apiKeys, caller);
  };

  public shared ({ caller }) func deleteApiKey(keyId : Nat) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous caller not allowed");
    };
    ApiKeyLib.deleteApiKey(apiKeys, caller, keyId);
  };
};
