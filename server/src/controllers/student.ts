import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { constants } from "http2";
import { Forbidden, NotFound } from "http-errors";
import { InternshipModule } from "../models/internshipModule";

export async function getStudents(req: Request, res: Response): Promise<void> {
  let internshipModules;
  if (!req.query.semester) {
    // If no semester was chosen
    internshipModules = await InternshipModule.find();
  } else {
    // Get internship modules filtered by semester
    internshipModules = await InternshipModule.find({
      inSemester: req.query.semester as string,
    })
      .limit(Number.parseInt(req.query.count as string) ?? 50)
      .skip(Number.parseInt(req.query.offset as string) ?? 0);
  }
  // Get users belonging to the found internship modules
  const users = [];
  for (const internshipModule of internshipModules) {
    const user = await User.findOne({ "studentProfile.internship": internshipModule._id }).populate(
      {
        path: "studentProfile.internship",
        lean: true,
        populate: {
          path: "internships",
          lean: true,
          populate: {
            path: "company",
            lean: true,
          },
        },
      }
    );
    users.push(user);
  }

  res.json(users);
}

export async function getStudentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all student details."));

  const studentId = req.params.id.toString();

  const student = await User.findById(studentId).populate({
    path: "studentProfile.internship",
    lean: true,
    populate: {
      path: "internships",
      lean: true,
      populate: {
        path: "company",
        lean: true,
      },
    },
  });
  if (!student) return next(new NotFound("Student not found"));
  res.json(student);
}

export async function clearInternshipSearchHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findById(req.params.id);
  if (!user || !user.studentProfile)
    return next(new NotFound(`Student with id ${req.params.id} not found`));

  user.studentProfile.companiesSeen = [];
  await user.save();
  res.statusCode = constants.HTTP_STATUS_NO_CONTENT;
  res.send();
}
