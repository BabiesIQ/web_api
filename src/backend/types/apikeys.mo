import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type ApiKey = {
    id : Nat;
    owner : UserId;
    var name : Text;
    keyHash : Text;
    createdAt : Timestamp;
    var lastUsedAt : ?Timestamp;
    var isActive : Bool;
  };

  public type ApiKeyPublic = {
    id : Nat;
    owner : UserId;
    name : Text;
    keyHash : Text;
    createdAt : Timestamp;
    lastUsedAt : ?Timestamp;
    isActive : Bool;
  };

  public type CreateApiKeyInput = {
    name : Text;
  };

  public type CreateApiKeyResult = {
    key : ApiKeyPublic;
    rawKey : Text;
  };
};
