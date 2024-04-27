import { initializeAddedCard } from './card.js';
import { createNewSwimLane } from './swim_lane.js';


$(".existing-pipeline-yaml").each( function() {
  $(this).on("click", (e) => {
    e.preventDefault()

    $(".swim-lane-wrapper").remove();

    var pipelineName = $(this).attr("value");
    var getSinglePipelineDataURL = `/pipeline_configuration/edit_single_pipeline/${pipelineName}/`;

    $.ajax({
      url: getSinglePipelineDataURL,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        $("#edit-pipeline-container").css("display", "block");

        // Use the response data to populate the form
        var pipelineName = data.pipeline_name;
        var pipelineDescription = data.pipeline_description;
        var pipelineBody = data.pipeline_body;
        var logicBlocks = pipelineBody['logic_blocks'];

        $('#new-pipeline-name').val(pipelineName);
        $('#new-pipeline-description').val(pipelineDescription);

        // Make pipeline name input field disabled
        $('#new-pipeline-name').attr('disabled', 'disabled');

        // Create swim lanes for each logic block and add steps to each swim lane
        $.each(logicBlocks, function(i, logicBlock) {
          var swimLane = createNewSwimLane(logicBlock['name']);

          $.each(logicBlock['spec_details'], function(i, spec_detail) {
            var newCard = $('<div></div>')
            .addClass('card swim-lane-item mb-3 available-step')
            .attr('draggable', 'true').html(`
                <div class="card-header text-bg-light" value="${ spec_detail.name }">
                  <div class="row">
                    <div class="col-sm-10">${ spec_detail.name.toUpperCase() }</div>
                    <button type="button" class="btn-close col-sm-2 remove-single-card" style="display: none;" aria-label="Close">
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">${ spec_detail.description }</p>
                </div>
                <div class="card-footer bg-transparent">
                  <a href="${ spec_detail.doc_link }" target="_blank" class="card-link">Document</a>
                  <a href="#" target="_blank" class="card-link">Admin</a>
                </div>
            `);

            newCard = initializeAddedCard(newCard);

            swimLane.find(".swim-lane").append(newCard);
          });
          swimLane.find(".swim-lane").attr("value", logicBlock['name']);
          $(".lanes").append(swimLane);
        });
      }
    });
  });
});