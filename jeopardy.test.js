describe("Getting Categories ID's", function () {
  it("Should reject everything but an array", function () {
    expect(() => getCategoryIds(![{}])).toThrowError();
  });
});

describe("Making sure category ID's matches up with catNum before processing", function () {
  it("Should see if the category.length matches the numCategory", function () {
    expect(
      () => (finishingInitilization().categoryID.length = numCategories)
    ).toThrowError();
  });
});

describe("The function in the getCategories", function () {
  it("Should check and see if the return value contains 3 values", function () {
    expect(() => getCategoryIds(typeof catId === "oject").toThrowError());
  });
});
