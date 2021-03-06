let numCategories = 6;
let numQuestions = 5;
let categories = [];
let gameStarted = false;
let url_base = "https://jservice.io/api/";

let loadingBar = document.querySelector(".spinner-border");
let startButton = document.querySelector(".btn");

//Starting Game button
$(startButton).on("click", function () {
  showLoadingView();
  setupAndStart();
  $(this).text("Loading...").prop("disabled", true);
});

//Getting the category ID's
function getCategoryIds(catID) {
  let res = catID.map(function (val) {
    return val.category_id;
  });
  return res;
}

//Getting the category from the category ID's
function getCategory(catId) {
  let title = catId.data.title;
  let clues = catId.data.clues.map(function (val) {
    let question = val.question;
    let answer = val.answer;
    return { question, answer, showing: "null" };
  });
  return { title, clues };
}

//Creating Table
function fillTable() {
  let body = document.querySelector(".container-fluid");
  let table = document.createElement("table");

  //Creating the table
  table.setAttribute("id", "jeopardy");
  table.setAttribute("class", "table");
  body.append(table);

  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let trHead = document.createElement("tr");

  table.append(thead);
  table.append(tbody);
  thead.append(trHead);

  //Creating the Categories
  for (i = 0; i < categories.length; i++) {
    let th = document.createElement("th");
    th.innerText = categories[i].title.toUpperCase();
    trHead.appendChild(th);
  }

  //Creating the clues
  let row = 0; //This is horizontal
  let column = 0; //This is vertical
  let tdInfo = [];

  for (let i = 0; i < numCategories * numQuestions + 1; i++) {
    if (row >= numCategories) {
      row = 0;
      column += 1;
      let tr = document.createElement("tr");
      for (info of tdInfo) {
        tr.append(info);
      }
      tbody.appendChild(tr);
      tdInfo = [];
    }
    let td = document.createElement("td");
    td.innerText = "?";
    td.setAttribute("id", `${row}-${column}`);
    td.addEventListener("mouseup", handleClick);
    tdInfo.push(td);

    row++;
  }
}

//Click events in the table
function handleClick(evt) {
  let evtInfo = categories[evt.target.id[0]].clues[evt.target.id[2]];
  if (evtInfo.showing === "null") {
    evt.target.innerHTML = evtInfo.question;
    evtInfo.showing = "question";
  } else if (evtInfo.showing === "question") {
    evt.target.innerHTML = evtInfo.answer;
    evt.target.style.backgroundColor = "green";
  } else {
    evt.target.style.backgroundColor = "green";
  }
}

//Showing and Hiding our loading bar
function showLoadingView() {
  $("div").css("display", "block");
}

function hideLoadingView() {
  $(".spinner-border").css("display", "none");
  $("button").prop("disabled", false);
  $("button").text("Restart");
  gameStarted = true;
}

//Getting the Category ID's (This prevents from getting duplicates)
async function checkForDuplicates() {
  let categories = [];
  let randomCategory = await axios.get(
    `https://jservice.io/api/random?count=${numCategories}`
  );
  let categoryID = [...new Set(getCategoryIds(randomCategory.data))];
  categories.push(categoryID);
  //If the unique Category ID isn't the same as the number of categories assigned, redo this function until so
  if (categoryID.length === numCategories) {
    finishingInitilization(categoryID);
  } else {
    //If there are duplicates, it will repeat this function until there aren't any
    checkForDuplicates();
  }
}

//Getting Clues and building the table
async function finishingInitilization(categoryID) {
  for (cat of categoryID) {
    let category = await axios.get(
      `https://jservice.io/api/category?id=${cat}`
    );
    categories.push(getCategory(category));
  }

  //Creating Table
  fillTable();

  //Hiding loading bar
  hideLoadingView();
}

//Initilizing Game
function setupAndStart() {
  if (gameStarted === true) {
    categories = [];
    document.querySelector("table").remove();
  }
  checkForDuplicates();
}
