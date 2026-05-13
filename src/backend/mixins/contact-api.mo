import List "mo:core/List";
import ContactLib "../lib/contact";
import ContactTypes "../types/contact";

mixin (
  contactSubmissions : List.List<ContactTypes.ContactSubmission>,
) {
  var nextContactId : Nat = 0;

  public shared func submitContact(input : ContactTypes.ContactInput) : async ContactTypes.ContactSubmission {
    let id = nextContactId;
    nextContactId += 1;
    ContactLib.submitContact(contactSubmissions, id, input);
  };
};
