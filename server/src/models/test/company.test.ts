import { ICompany, Company } from "../company";
import * as dbHandler from "./database";
import { companySizes } from "../../helpers/companySizes";

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

/*
describe('post test', () => {
  it('can be created correctly', async () => {
    // expect that two assertios will be made
    expect.assertions(2)
    // create new post model instance
    const post: IPost = new Post()
    // set some test properties
    post.title = 'Test title'
    post.content = 'Test content'
    // save test post to in-memory db
    await post.save()
    // find inserted post by title
    const postInDb = await Post.findOne({title: 'Test title'}).exec()
    console.log('Post document from memory-db', postInDb)
    // check that title is expected
    expect(postInDb.title).toEqual('Test title')
    // check that content is expected
    expect(postInDb.content).toEqual('Test content')
  });
});
*/

describe("Company model", () => {
  it("can be created from valid data", async () => {
    expect.assertions(1);

    const properties = {
      companyName: "HTW Berlin",
      branchName: "Rechenzentrum",
      /* leave out address */
      industry: "Systemadministration",
      size: companySizes.small,
      comment: "It was really nice",
    };
    const company = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    if (savedCompany) expect(savedCompany.companyName).toEqual("HTW Berlin");
  });
  /*
  it("can normalize email and website url", async () => {
    expect.assertions(2);

    const properties = {
      companyName: "HTW Berlin",
      emailAddress: "rechenzentrum@HTW-Berlin.de ",
      website: "rz.htw-berlin.de",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany.emailAddress).toEqual("rechenzentrum@htw-berlin.de");
    expect(savedCompany.website).toEqual("https://rz.htw-berlin.de/");
  });
  it("will not accept anything but iso codes for mainLanguage", async () => {
    expect.assertions(1);

    const properties = {
      companyName: "HTW Berlin",
      mainLanguage: "Deutsch",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany.mainLanguage).toEqual("en");
  });
  it("will accept an iso code for mainLanguage", async () => {
    expect.assertions(1);

    const properties = {
      companyName: "HTW Berlin",
      mainLanguage: "de",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany.mainLanguage).toEqual("de");
  });
   */
});
