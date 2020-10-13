let categories = [];
let gameStarted = false;

let loadingBar = document.querySelector(".spinner-border");

let startButton = document.querySelector(".btn");

//Starting Game button
$(startButton).on("click", function () {
  showLoadingView();
  setupAndStart();
  $(this).text("Loading...");
});

//Getting the category ID's
function getCategoryIds(catID) {
  const res = [];
  for (category of catID) {
    res.push(category.category_id);
  }
  return res;
}

//Getting the category from the category ID's
function getCategory(catId) {
  let title = catId.data.title;
  let clues = [];
  let quesAnswers = { title, clues };
  for (clue of catId.data.clues.splice(0, 5)) {
    let question = clue.question;
    let answer = clue.answer;
    clues.push({ question, answer, showing: "null" });
  }
  return quesAnswers;
}

//Creating Table
async function fillTable() {
  await axios.get("https://jservice.io/api/random?count=6");
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

  for (let i = 0; i < 31; i++) {
    if (row >= 6) {
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
  if (categories[evt.target.id[0]].clues[evt.target.id[2]].showing === "null") {
    evt.target.innerHTML =
      categories[evt.target.id[0]].clues[evt.target.id[2]].question;
    categories[evt.target.id[0]].clues[evt.target.id[2]].showing = "question";
  } else if (
    categories[evt.target.id[0]].clues[evt.target.id[2]].showing === "question"
  ) {
    evt.target.innerHTML =
      categories[evt.target.id[0]].clues[evt.target.id[2]].answer;
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
  $("button").text("Restart");
  gameStarted = true;
}

//Initilizing Game
async function setupAndStart() {
  if (gameStarted === true) {
    categories = [];
    document.querySelector("table").remove();
  }
  const randomCategory = await axios.get(
    "https://jservice.io/api/random?count=30"
  );
  let categoryID = [...new Set(getCategoryIds(randomCategory.data))].splice(
    0,
    6
  );

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
