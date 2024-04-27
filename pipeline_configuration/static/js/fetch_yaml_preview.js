$("#yaml-preview-button").on('click', function (e) {
  e.preventDefault()
  const newYamlCreationURL = '/pipeline_configuration/generate_yaml_preview/';

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
    url: newYamlCreationURL,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(postData),
    success: function(data) {
      $("#yaml-preview").html(data.yaml_str);
    }
  });
});