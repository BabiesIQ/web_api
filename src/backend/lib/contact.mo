import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/contact";

module {
  public func submitContact(
    submissions : List.List<Types.ContactSubmission>,
    nextId : Nat,
    input : Types.ContactInput,
  ) : Types.ContactSubmission {
    let submission : Types.ContactSubmission = {
      id = nextId;
      name = input.name;
      email = input.email;
      subject = input.subject;
      message = input.message;
      submittedAt = Time.now();
    };
    submissions.add(submission);
    submission;
  };
};
