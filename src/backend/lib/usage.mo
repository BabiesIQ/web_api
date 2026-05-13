import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/usage";

module {
  public func recordUsage(
    records : List.List<Types.UsageRecord>,
    userId : Types.UserId,
    input : Types.RecordUsageInput,
  ) : () {
    let date = todayDate();
    switch (records.find(func(r) {
      Principal.equal(r.userId, userId) and r.date == date and r.modelName == input.modelName
    })) {
      case (?existing) {
        existing.requestCount += 1;
      };
      case null {
        let record : Types.UsageRecord = {
          userId;
          date;
          var requestCount = 1;
          modelName = input.modelName;
        };
        records.add(record);
      };
    };
  };

  public func getUsageStats(
    records : List.List<Types.UsageRecord>,
    userId : Types.UserId,
  ) : Types.UsageStats {
    let userRecords = records.filter(func(r) { Principal.equal(r.userId, userId) });

    var totalRequests : Nat = 0;
    let dailyMap = Map.empty<Text, Nat>();
    let modelMap = Map.empty<Text, Nat>();

    userRecords.forEach(func(r) {
      totalRequests += r.requestCount;

      let prevDaily = switch (dailyMap.get(r.date)) {
        case (?v) v;
        case null 0;
      };
      dailyMap.add(r.date, prevDaily + r.requestCount);

      let prevModel = switch (modelMap.get(r.modelName)) {
        case (?v) v;
        case null 0;
      };
      modelMap.add(r.modelName, prevModel + r.requestCount);
    });

    {
      totalRequests;
      dailyBreakdown = dailyMap.entries().toArray();
      modelBreakdown = modelMap.entries().toArray();
    };
  };

  public func todayDate() : Text {
    let nowNs : Int = Time.now();
    let nowSecs : Int = nowNs / 1_000_000_000;
    let daysSinceEpoch : Nat = Int.abs(nowSecs / 86400);
    epochDaysToDateString(daysSinceEpoch);
  };

  // Convert days since 1970-01-01 to "YYYY-MM-DD"
  // Algorithm: Howard Hinnant's civil-from-days
  func epochDaysToDateString(days : Nat) : Text {
    let z : Int = days.toInt() + 719468;
    let era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe : Int = z - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp : Int = (5 * doy + 2) / 153;
    let d : Int = doy - (153 * mp + 2) / 5 + 1;
    let m : Int = mp + (if (mp < 10) 3 else -9);
    let finalY : Int = y + (if (m <= 2) 1 else 0);

    padLeft(Int.abs(finalY), 4) # "-" # padLeft(Int.abs(m), 2) # "-" # padLeft(Int.abs(d), 2);
  };

  func padLeft(n : Nat, width : Nat) : Text {
    var s = n.toText();
    var len = s.size();
    while (len < width) {
      s := "0" # s;
      len += 1;
    };
    s;
  };
};
