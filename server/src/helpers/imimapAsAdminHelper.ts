import { IUser, User } from "../models/user";

const imiMapAdminId = "00000000696d696d61703231";

let imiMapAdmin: IUser | null = null;

async function loadAdminFromDB(): Promise<IUser> {
  return (
    (await User.findById("00000000696d696d61703231")) ||
    (await new User({
      _id: imiMapAdminId,
      emailAddress: "imimap@htw-berlin.de",
      isAdmin: true,
    }).save())
  );
}

export async function getIMIMapAdmin(): Promise<IUser> {
  if (imiMapAdmin === null) imiMapAdmin = await loadAdminFromDB();
  return imiMapAdmin;
}
