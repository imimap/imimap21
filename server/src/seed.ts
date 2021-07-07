import { IUser, User } from "./models/user";
import * as faker from "faker";
import { Schema } from "mongoose";
import { IInternship, Internship } from "./models/internship";
import { Company } from "./models/company";
import { companySizes } from "./helpers/companySizes";
import { isoLanguages } from "./helpers/isoLanguages";
import { IInternshipModule, InternshipModule } from "./models/internshipModule";

function generateRange(size: number, start?: number): number[] {
  return [...Array(size).keys()].map((i) => i + (start ?? 0));
}

async function createUser(
  studentId: string,
  internshipModuleId: Schema.Types.ObjectId
): Promise<IUser> {
  return await User.create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    emailAddress: `s0${studentId}@htw-berlin.de`,
    studentProfile: {
      studentId: `s0${studentId}`,
      internship: internshipModuleId,
    },
  });
}

async function createInternshipModule(
  internshipIds: Schema.Types.ObjectId[] = []
): Promise<IInternshipModule> {
  const internshipModule = await InternshipModule.create({ internships: internshipIds });
  return internshipModule.plan();
}

async function createInternship(): Promise<IInternship> {
  const company = await Company.create({
    companyName: faker.company.companyName(),
    branchName: faker.company.catchPhraseNoun(),
    address: {
      street: faker.address.streetName(),
      streetNumber: faker.datatype.number().toString(),
      zip: faker.address.zipCode(),
      city: faker.address.city(),
      country: faker.address.country(),
      additionalLines: faker.address.secondaryAddress(),
      coordinates: {
        latitude: Number.parseFloat(faker.address.latitude()),
        longitude: Number.parseFloat(faker.address.longitude()),
      },
    },
    emailAddress: faker.internet.email(),
    industry: faker.lorem.word(),
    website: faker.internet.url(),
    mainLanguage: faker.random.arrayElement(Object.keys(isoLanguages)),
    size: faker.random.arrayElement(Object.keys(companySizes)),
    comment: faker.lorem.words(10),
  });

  return await Internship.create({
    startDate: faker.date.recent(120),
    endDate: faker.date.soon(50),
    company: company.id,
    tasks: faker.lorem.lines(3),
    operationalArea: faker.company.catchPhraseNoun(),
    programmingLanguages: [...Array(faker.datatype.number(4))].map(() => faker.company.bsNoun()),
    livingCosts: faker.datatype.number({
      min: 300,
      max: 800,
    }),
    salary: faker.datatype.number({
      min: 300,
      max: 800,
    }),
    paymentTypes: [...Array(faker.datatype.number(2))].map(() =>
      faker.random.arrayElement(["uncharted", "cash benefit", "noncash benefit", "no payment"])
    ),
    workingHoursPerWeek: faker.datatype.number({
      min: 30,
      max: 50,
    }),
    supervisor: {
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      emailAddress: faker.internet.email(),
    },
  });
}

async function generateStudents(
  firstStudentId: number,
  amount: number,
  internshipGenerator: () => Promise<Schema.Types.ObjectId[]> = () => Promise.resolve([])
): Promise<void> {
  await Promise.all(
    generateRange(amount, firstStudentId).map(
      async (id) =>
        await createUser(
          id.toString(),
          (
            await createInternshipModule(await internshipGenerator())
          ).id
        )
    )
  );
}

export default async function seed(): Promise<void> {
  // Generate users without internships
  await generateStudents(100000, 10);

  // Generate users with one internship
  await generateStudents(200000, 10, async () => [(await createInternship()).id]);

  // Generate users with two internships
  await generateStudents(300000, 10, async () => [
    (await createInternship()).id,
    (await createInternship()).id,
  ]);
}
