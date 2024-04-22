export function initializeAddedCard(clonedCard) {
    // Pre-set the cloned card for adding to swim lane later
    clonedCard.removeClass('selected');
    clonedCard.find('.remove-single-card').css('display', 'block');
    clonedCard.attr('draggable', 'true');
    clonedCard.on("dragstart", function(event) {
        $(this).addClass("is-dragging");
        // To prevent the drag and drop event from bubbling up to the parent element
        // when having nested drag and drop elements
        event.stopPropagation();
    }).on("dragend", function() {
        $(this).removeClass("is-dragging");
    });
  
    // Pre-set the remove button for the cloned card
    clonedCard.find(".remove-single-card").each(function() {
      $(this).on("click", function() {
          $(this).parent().parent().parent().remove();
      });
    });
  
    return clonedCard;
}