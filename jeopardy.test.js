describe("Getting Categories ID's", function () {
  it("Should reject everything but an array", function () {
    expect(() => getCategoryIds(![{}])).toThrowError();
  });
});
