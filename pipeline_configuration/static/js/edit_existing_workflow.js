$(".side-bar-link").css('background', '#7386D5').css('color', '#fff');
$("#side-bar-edit-button").css('background', '#fff').css('color', '#7386D5');

$("#edit-yaml-form").on('submit', function (e) {
  e.preventDefault()

  var pipeline_name = $("#new-pipeline-name").val();
  var pipeline_description = $("#new-pipeline-description").val();
  
  var swimLanes = $("#add-pipeline-lanes-section .swim-lane");

  var logicBlocks = {};

  swimLanes.each(function(i, swimLane) {
    var stepNames = [];
    var swimLaneName = $(swimLane).attr("value");
    var cardHeaders = $(swimLane).find(".card-header");
  
    cardHeaders.each(function(j, cardHeader) {
      stepNames.push($(cardHeader).attr("value"));
    });
  
    logicBlocks[swimLaneName] = stepNames;
  });

  var postData = {
    "logic_blocks": logicBlocks,
    "pipeline_name": pipeline_name,
    "pipeline_description": pipeline_description,
  };

  $.ajax({
    url: "/pipeline_configuration/edit_single_pipeline/",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(postData),
    success: function(data) {
      $("#save-result-message").html(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>
            Pipeline yaml updated successfully. 
            Click <a href="/admin/${data.app_name}/pipelineyaml/${data.admin_pk}/change/" target="_blank">[<em>HERE</em>]</a> to view details.
          </strong>
          <button type="button" class="btn-close close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `);
    },
    error: function(jqXHR) {
      var data = jqXHR.responseJSON;
      $("#save-result-message").html(`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Fail to update pipeline yaml...Reason: ${data.message}</strong>
          <button type="button" class="btn-close close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `);
    }
  });
})