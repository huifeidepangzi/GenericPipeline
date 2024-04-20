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


$("#add-column-button").on('click', function(event) {
  var columnName = $("#column-name").val();

  if (columnName === "") {
    // Display an error message
    alert("The input field is empty. Please enter a value.");
    return;
  }

  // Check whether the name of swim lane already exists
  try {
    $(".swim-lane").each(function() {
      if ($(this).attr("value") === columnName) {
          throw new Error('The name of the swim lane already exists. Please try a different name.');
      }
    });
  } catch (error) {
    alert('The name of the swim lane already exists. Please try a different name.');
    return;
  }

  // Prevent the form from submitting normally
  event.preventDefault();

  var newColumn = $('<div></div>')
  .addClass('col-sm-3 swim-lane-wrapper')
  .attr('draggable', 'true')
  .html(`
      <div class="swim-lane" value="${columnName}">
          <div class="row">
              <h3 class="heading single-column-name col-sm-10">${columnName}</h3>
              <button type="button" class="btn-close col-sm-2 remove-single-column" aria-label="Close"></button>
          </div>
          <button id="add-step-button-${columnName}" type="button" class="btn btn-danger add-step-button" data-bs-toggle="modal" data-bs-target="#stepListPopOut">ADD STEP</button>
      </div>
  `);

  $(".lanes").append(newColumn);

  $(".remove-single-column").on("click", function() {
      $(this).parent().parent().parent().remove();
  });

  $(".add-step-button").on("click", function() {
      clickedAddStepButtonId = this.id;
  });

  var swimLanes = document.querySelectorAll(".swim-lane");
  swimLanes.forEach((swimLane) => {
    swimLane.addEventListener("dragover", (dragEvent) => {
      dragEvent.preventDefault();
      dragEvent.stopPropagation();

      const closestItem = getClosestItem(swimLane, dragEvent.clientY);
      const itemToDrop = document.querySelector(".is-dragging");

      if (itemToDrop === null || itemToDrop === undefined) {
        return;
      }
  
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
    dragEvent.stopPropagation();

    const closestLane = getClosestLane(lanesZone, dragEvent.clientX);
    const itemToDrop = document.querySelector(".lane-is-dragging");

    if (itemToDrop === null || itemToDrop === undefined) {
      return;
    }

    if (!closestLane) {
      lanesZone.appendChild(itemToDrop);
    } else {
      lanesZone.insertBefore(itemToDrop, closestLane);
    }
  });

  $(".swim-lane-wrapper").each(function() {
    $(this).on("dragstart", function(event) {
        $(this).addClass("lane-is-dragging");
        event.stopPropagation();
    }).on("dragend", function() {
        $(this).removeClass("lane-is-dragging");
    });
  });

  columnName.value = '';
});


$('.available-step').on('click', function() {
  // Remove the 'selected' class from all cards
  $('.available-step').removeClass('selected');
  // Add the 'selected' class to the clicked card
  $(this).addClass('selected');
});


$('.add-new-step').on('click', function() {
  // Clone the selected card
  var clonedCard = $('.available-step.selected').clone();

  // Pre-set the cloned card for adding to swim lane later
  clonedCard.removeClass('selected');
  clonedCard.find('.remove-single-card').css('display', 'block');
  clonedCard.attr('draggable', 'true');

  // Add the selected card to the swim lane
  $("#" + clickedAddStepButtonId).parent().append(clonedCard);

  $(".remove-single-card").each(function() {
    $(this).on("click", function() {
        $(this).parent().parent().parent().remove();
    });
  });

  $(".swim-lane-item").each(function() {
    $(this).on("dragstart", function(event) {
        $(this).addClass("is-dragging");
        // To prevent the drag and drop event from bubbling up to the parent element
        // when having nested drag and drop elements
        event.stopPropagation();
    }).on("dragend", function() {
        $(this).removeClass("is-dragging");
    });
  });

  $('#stepListPopOut').modal('hide');
  $('.available-step').removeClass('selected');
});