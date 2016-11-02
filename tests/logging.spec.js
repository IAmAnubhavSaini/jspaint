describe("logging", function () {
  var functionType;
  beforeEach(function () {
    functionType = typeof function () { };
  });
  it("getLogger is a function", function () {
    expect(typeof getLogger).toBe(functionType);
  });
  it("getLogger() returns object with log, info and error", function () {
    var logger = getLogger();
    expect(typeof logger.info).toBeDefined();
    expect(typeof logger.log).toBeDefined();
    expect(typeof logger.error).toBeDefined();
  });
  it("getLogger() returns object with functions log, info and error", function () {
    var logger = getLogger();
    expect(typeof logger.info).toBe(functionType);
    expect(typeof logger.log).toBe(functionType);
    expect(typeof logger.error).toBe(functionType);
  });
});
