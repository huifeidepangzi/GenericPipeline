export function createNewSwimLane(columnName) {
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
  
    newColumn.find(".swim-lane").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
  
        const closestItem = getClosestItem(newColumn, dragEvent.clientY);
        const itemToDrop = $(".is-dragging");
  
        if (itemToDrop.length === 0) {
            return;
        }
  
        if (!closestItem) {
            $(this).append(itemToDrop);
        } else {
            itemToDrop.insertBefore(closestItem);
        }
    });
  
    newColumn.find(".remove-single-column").on("click", function() {
        $(this).parent().parent().parent().remove();
    });

    newColumn.on("dragstart", function(event) {
        $(this).addClass("lane-is-dragging");
        event.stopPropagation();
    }).on("dragend", function() {
        $(this).removeClass("lane-is-dragging");
    });

    newColumn.find(".add-step-button").on("click", function() {
        $('#stepListPopOut').attr('data-add-step-button-id', this.id);
    });

    return newColumn;
}


const getClosestItem = (zone, mouseY) => {
    let closestItem = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    
    zone.find(".swim-lane-item:not(.is-dragging)").each(function() {
        // get the y-coordinate of the top side of the element, relative to the viewport
        const top = $(this).offset().top - $(document).scrollTop();
        // get the height of the element
        const height = $(this).outerHeight();
        const offset = mouseY - (top + height / 2);
    
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestItem = this;
        }
    });
    
    return closestItem;
};