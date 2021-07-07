import { User } from "../models/user";

const imimapAdminId = "00000000696d696d61703231";

export const imimapAdmin = (async () => {
  return (
    (await User.findById("00000000696d696d61703231")) ||
    (await new User({
      _id: imimapAdminId,
      emailAddress: "imimap@htw-berlin.de",
      isAdmin: true,
    }).save())
  );
})();
