var clickedAddStepButtonId = null;

const getClosestItem = (zone, mouseY) => {
  const allOtherItems = zone.querySelectorAll(".swim-lane-item:not(.is-dragging)");

  let closestItem = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  allOtherItems.forEach((item) => {
    const { top, height } = item.getBoundingClientRect();

    const offset = mouseY - (top + height/2);

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestItem = item;
    }
  });

  return closestItem;
};


const getClosestLane = (zone, mouseX) => {
  const allOtherLanes = zone.querySelectorAll(".swim-lane-wrapper:not(.is-dragging)");

  let closestLane = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  allOtherLanes.forEach((lane) => {
    const { left } = lane.getBoundingClientRect();

    const offset = mouseX - left;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestLane = lane;
    }
  });

  return closestLane;
};


// Get the form
var addNewColumnButton = document.getElementById("add-column-button");

// Add an event listener for the 'submit' event
addNewColumnButton.addEventListener('click', function(event) {
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
  newColumn.classList.add("swim-lane-wrapper");
  newColumn.setAttribute("draggable", "true");
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

  var swimLanes = document.querySelectorAll(".swim-lane");
  swimLanes.forEach((swimLane) => {
    swimLane.addEventListener("dragover", (dragEvent) => {
      dragEvent.preventDefault();

      const closestItem = getClosestItem(swimLane, dragEvent.clientY);
      const itemToDrop = document.querySelector(".is-dragging");
  
      if (!closestItem) {
        swimLane.appendChild(itemToDrop);
      } else {
        swimLane.insertBefore(itemToDrop, closestItem);
      }
    });
  });

  var lanesZone = document.querySelectorAll(".lanes")[0];
  lanesZone.addEventListener("dragover", (dragEvent) => {
    dragEvent.preventDefault();

    const closestLane = getClosestLane(lanesZone, dragEvent.clientX);
    const itemToDrop = document.querySelector(".lane-is-dragging");

    if (!closestLane) {
      lanesZone.appendChild(itemToDrop);
    } else {
      lanesZone.insertBefore(itemToDrop, closestLane);
    }
  });

  var swimLanesWrappers = document.querySelectorAll(".swim-lane-wrapper");
  swimLanesWrappers.forEach((lane) => {
    lane.addEventListener("dragstart", (event) => {
      lane.classList.add("lane-is-dragging");
    });
    lane.addEventListener("dragend", () => {
      lane.classList.remove("lane-is-dragging");
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
  var targetAddStepButton = document.getElementById(clickedAddStepButtonId);
  var parentElement = targetAddStepButton.parentElement;
  parentElement.appendChild(clonedCard);

  document.querySelectorAll(".remove-single-card").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.parentElement.parentElement.remove();
    });
  });

  var swimLaneItems = document.querySelectorAll(".swim-lane-item");
  swimLaneItems.forEach((swimLaneItem) => {
    swimLaneItem.addEventListener("dragstart", (event) => {
      swimLaneItem.classList.add("is-dragging");

      // To prevent the drag and drop event from bubbling up to the parent element
      // when having nested drag and drop elements
      event.stopPropagation();
    });
    swimLaneItem.addEventListener("dragend", () => {
      swimLaneItem.classList.remove("is-dragging");
    });
  });

  $('#stepListPopOut').modal('hide');

  for (var j = 0; j < cards.length; j++) {
    cards[j].classList.remove('selected');
  }
});