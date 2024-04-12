var clickedAddStepButtonId = null;

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};


// Get the form
var addNewColumnButton = document.getElementById("add-column-button");

// Add an event listener for the 'submit' event
addNewColumnButton.addEventListener('click', function(event) {
  // Your code here

  
  // console.log("Form submitted");
  var columnName = document.getElementById('column-name').value;

  if (columnName === '') {
    // Display an error message
    alert('The input field is empty. Please enter a value.');
    return;
  }

  // Check whether the name of swim lane already exists
  var swimLanes = document.querySelectorAll(".swim-lane");
  for (var i = 0; i < swimLanes.length; i++) {
    if (swimLanes[i].getAttribute("value") === columnName) {
      alert('The name of the swim lane already exists. Please try a different name.');
      return;
    }
  }

  // Prevent the form from submitting normally
  event.preventDefault();

  var newColumn = document.createElement("div");
  newColumn.classList.add("col-sm-3");
  newColumn.innerHTML = `
    <div class="swim-lane" value="${columnName}">
      <div class="row">
        <h3 class="heading single-column-name col-sm-10">${columnName}</button></h3>
        <button type="button" class="btn-close col-sm-2 remove-single-column" aria-label="Close">
      </div>
      <button id="add-step-button-${columnName}" type="button" class="btn btn-danger add-step-button" data-bs-toggle="modal" data-bs-target="#stepListPopOut">ADD STEP</button>
    </div>
  `
  document.querySelector(".lanes").appendChild(newColumn);
  document.querySelectorAll(".remove-single-column").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.parentElement.parentElement.remove();
    });
  });
  document.querySelectorAll(".add-step-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      clickedAddStepButtonId = event.target.id;
    });
  });

  var droppables = document.querySelectorAll(".swim-lane");
  droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
  
      const bottomTask = insertAboveTask(zone, e.clientY);
      const curTask = document.querySelector(".is-dragging");

      // Get the "Add Step" button
      // const addStepButtons = document.querySelectorAll('.add-step-button');

      // Check if the bottomTask is the last child of its parent
      // if (bottomTask === bottomTask.parentNode.lastElementChild) {
      //   // Prevent the card from being dropped
      //   return;
      // }
  
      if (!bottomTask) {
        zone.appendChild(curTask);
      } else {
        zone.insertBefore(curTask, bottomTask);
      }
    });
  });

  columnName.value = '';
});

var cards = document.querySelectorAll('.available-step');

// Loop through the cards
for (var i = 0; i < cards.length; i++) {
  // Add a click event listener to each card
  cards[i].addEventListener('click', function() {
    // Remove the 'selected' class from all cards
    for (var j = 0; j < cards.length; j++) {
      cards[j].classList.remove('selected');
    }

    // Add the 'selected' class to the clicked card
    this.classList.add('selected');
  });
}

// Get the "Add" button
var addNewStepButton = document.querySelector('.add-new-step');
// Add a click event listener to the "Add" button
addNewStepButton.addEventListener('click', function() {
  // Get the selected card
  var selectedCard = document.querySelector('.available-step.selected');

  // Clone the selected card
  var clonedCard = selectedCard.cloneNode(true);

  // Remove the 'selected' class from the cloned card
  clonedCard.classList.remove('selected');
  clonedCard.getElementsByClassName('remove-single-card')[0].style.display = 'block';
  clonedCard.setAttribute('draggable', 'true');

  // Get the swim-lane
  // var swimLane = document.querySelector('.swim-lane');
  var targetAddStepButton = document.getElementById(clickedAddStepButtonId);
  var parentElement = targetAddStepButton.parentElement;
  // Append the cloned card to the swim-lane
  // swimLane.appendChild(clonedCard);
  // targetAddStepButton.prepend(clonedCard);
  // parentElement.insertBefore(clonedCard, targetAddStepButton);
  parentElement.appendChild(clonedCard);

  document.querySelectorAll(".remove-single-card").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.parentElement.parentElement.remove();
    });
  });

  var draggables = document.querySelectorAll(".task");
  draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });

  $('#stepListPopOut').modal('hide');

  for (var j = 0; j < cards.length; j++) {
    cards[j].classList.remove('selected');
  }
});