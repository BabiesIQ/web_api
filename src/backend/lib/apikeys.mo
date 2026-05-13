import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Types "../types/apikeys";

module {
  public func createApiKey(
    keys : List.List<Types.ApiKey>,
    nextId : Nat,
    owner : Types.UserId,
    input : Types.CreateApiKeyInput,
  ) : (Types.ApiKey, Text) {
    let raw = generateKey(owner, nextId);
    let hashed = hashKey(raw);
    let key : Types.ApiKey = {
      id = nextId;
      owner;
      var name = input.name;
      keyHash = hashed;
      createdAt = Time.now();
      var lastUsedAt = null;
      var isActive = true;
    };
    keys.add(key);
    (key, raw);
  };

  public func listApiKeys(
    keys : List.List<Types.ApiKey>,
    owner : Types.UserId,
  ) : [Types.ApiKeyPublic] {
    let filtered = keys.filter(func(k) { Principal.equal(k.owner, owner) and k.isActive });
    filtered.map<Types.ApiKey, Types.ApiKeyPublic>(func(k) { toPublic(k) }).toArray();
  };

  public func deleteApiKey(
    keys : List.List<Types.ApiKey>,
    owner : Types.UserId,
    keyId : Nat,
  ) : Bool {
    switch (keys.find(func(k) { k.id == keyId and Principal.equal(k.owner, owner) })) {
      case null false;
      case (?key) {
        key.isActive := false;
        true;
      };
    };
  };

  public func toPublic(key : Types.ApiKey) : Types.ApiKeyPublic {
    {
      id = key.id;
      owner = key.owner;
      name = key.name;
      keyHash = key.keyHash;
      createdAt = key.createdAt;
      lastUsedAt = key.lastUsedAt;
      isActive = key.isActive;
    };
  };

  // Generates a pseudo-unique raw key from owner principal + id + timestamp
  public func generateKey(owner : Types.UserId, id : Nat) : Text {
    let t = Time.now();
    owner.toText() # "-" # id.toText() # "-" # t.toText();
  };

  // Returns a deterministic fingerprint of the raw key using text size + char fold
  public func hashKey(rawKey : Text) : Text {
    var acc : Nat = 5381;
    for (c in rawKey.toIter()) {
      let code = Nat32.toNat(Char.toNat32(c));
      acc := ((acc * 33) + code) % 4294967295;
    };
    "hk_" # acc.toText() # "_" # rawKey.size().toText();
  };
};
