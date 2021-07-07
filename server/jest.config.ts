module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["./node_modules/", "./test/__utils", "./dist/"],
  moduleFileExtensions: ["ts", "tsx", "js"],
};
