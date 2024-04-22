import { initializeAddedCard } from './card.js';
import { initializeLanesZone } from './lanes.js';
import { createNewSwimLane } from './swim_lane.js';

var clickedAddStepButtonId = null;


initializeLanesZone($(".lanes").first());


// When click the 'Add Column' button
$("#add-column-button").on('click', function(event) {
  var columnName = $("#column-name").val();

  // Check whether the name is blank
  if (columnName === "") {
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
    $("#column-name").val("");
    return;
  }

  event.preventDefault();

  $(".lanes").append(createNewSwimLane(columnName));

  $(".add-step-button").on("click", function() {
      clickedAddStepButtonId = this.id;
  });

  // Clear the input field
  $("#column-name").val("");
});


// When click any available step
$('.available-step').on('click', function() {
  // Remove the 'selected' class from all cards
  $('.available-step').removeClass('selected');
  // Add the 'selected' class to the clicked card
  $(this).addClass('selected');
});


// When click the 'Add Step' button
$('.add-new-step').on('click', function() {
  // Clone the selected card
  var clonedCard = $('.available-step.selected').clone();

  clonedCard = initializeAddedCard(clonedCard);

  // Add the selected card to the swim lane
  $("#" + clickedAddStepButtonId).parent().append(clonedCard);

  $('#stepListPopOut').modal('hide');
  $('.available-step').removeClass('selected');
});
