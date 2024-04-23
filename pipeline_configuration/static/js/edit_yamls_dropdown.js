import { initializeAddedCard } from './card.js';
import { createNewSwimLane } from './swim_lane.js';


var existingPipelineYamls = document.querySelectorAll(".existing-pipeline-yaml");
existingPipelineYamls.forEach((pipelineYaml) => {
  pipelineYaml.addEventListener("click", (e) => {
    e.preventDefault()

    $(".swim-lane-wrapper").remove();

    var pipelineName = pipelineYaml.getAttribute("value");
    var getSinglePipelineDataURL = `/pipeline_configuration/edit_single_pipeline/${pipelineName}/`;

    fetch(getSinglePipelineDataURL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      // body: JSON.stringify({"pipeline_name": pipelineName})
    }).then(response => {
      response.json().then(data => {
        var editPipelineContainer = document.getElementById("edit-pipeline-container");
        editPipelineContainer.style.display = "block";

        // Use the response data to populate the form
        var pipelineName = data.pipeline_name;
        var pipelineDescription = data.pipeline_description;
        var pipelineBody = data.pipeline_body;
        var logicBlocks = pipelineBody['logic_blocks'];

        // document.getElementById("new-pipeline-name").value = pipelineName;
        // document.getElementById("new-pipeline-description").value = pipelineDescription;
        $('#new-pipeline-name').val(pipelineName);
        $('#new-pipeline-description').val(pipelineDescription);

        // Make pipeline name input field disabled
        $('#new-pipeline-name').attr('disabled', 'disabled');

        // Create swim lanes for each logic block and add steps to each swim lane
        for (var i = 0; i < logicBlocks.length; i++) {
          // console.log(logicBlock);
          var swimLane = createNewSwimLane(logicBlocks[i]['name']);
          for (var j = 0; j < logicBlocks[i]['spec_details'].length; j++) {
            var spec_detail = logicBlocks[i]['spec_details'][j];
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
          }
          swimLane.find(".swim-lane").attr("value", logicBlocks[i]['name']);
          $(".lanes").append(swimLane);
        }
      });
    });
  });
});