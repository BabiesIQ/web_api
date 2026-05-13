import List "mo:core/List";
import UserTypes "types/users";
import ApiKeyTypes "types/apikeys";
import UsageTypes "types/usage";
import ContactTypes "types/contact";
import UsersMixin "mixins/users-api";
import ApiKeysMixin "mixins/apikeys-api";
import UsageMixin "mixins/usage-api";
import ContactMixin "mixins/contact-api";

actor {
  let users = List.empty<UserTypes.UserProfile>();
  let apiKeys = List.empty<ApiKeyTypes.ApiKey>();
  let usageRecords = List.empty<UsageTypes.UsageRecord>();
  let contactSubmissions = List.empty<ContactTypes.ContactSubmission>();

  include UsersMixin(users);
  include ApiKeysMixin(apiKeys);
  include UsageMixin(usageRecords);
  include ContactMixin(contactSubmissions);
};
