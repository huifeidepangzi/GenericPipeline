export function initializeLanesZone (lanesZone) {
    lanesZone.on("dragover", function (dragEvent) {
      dragEvent.preventDefault();
      dragEvent.stopPropagation();
  
      const closestLane = getClosestLane($(this), dragEvent.clientX);
      const itemToDrop = $(".lane-is-dragging");
  
      if (itemToDrop.length === 0) {
        return;
      }
  
      if (!closestLane) {
        $(this).append(itemToDrop.first());
      } else {
        itemToDrop.first().insertBefore(closestLane);
      }
    });
  
    return lanesZone;
}


const getClosestLane = (zone, mouseX) => {
    let closestLane = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    
    zone.find(".swim-lane-wrapper:not(.is-dragging)").each(function() {
        const left = $(this).offset().left - $(document).scrollLeft();
        const offset = mouseX - left;
    
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestLane = this;
        }
    });
    
    return closestLane;
};