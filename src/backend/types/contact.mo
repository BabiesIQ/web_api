import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;

  public type ContactSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    submittedAt : Timestamp;
  };

  public type ContactInput = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
  };
};
