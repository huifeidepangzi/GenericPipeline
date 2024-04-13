const yamlPreviewButton = document.querySelector("#yaml-preview-button");


yamlPreviewButton.addEventListener('click', function (e) {
  e.preventDefault()
  const newYamlCreationURL = '/pipeline_configuration/generate_yaml_preview/';

  var pipeline_name = document.getElementById("new-pipeline-name").value;
  var pipeline_description = document.getElementById("new-pipeline-description").value;

  var swimLanes = document.getElementById("add-pipeline-lanes-section").querySelectorAll(".swim-lane");
  var logicBlocks = {};

  for (var i = 0; i < swimLanes.length; i++) {
    var stepNames = [];
    var swimLaneName = swimLanes[i].getAttribute("value");
    var cardHeaders = swimLanes[i].querySelectorAll(".card-header");
    
    for (var j = 0; j < cardHeaders.length; j++) {
      stepNames.push(cardHeaders[j].getAttribute("value"));
    }
  
    logicBlocks[swimLaneName] = stepNames;
  }

  var postData = {
    "logic_blocks": logicBlocks,
    "pipeline_name": pipeline_name,
    "pipeline_description": pipeline_description,
  };

  fetch(newYamlCreationURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  }).then(response => {
    var yamlPreviewSection = document.getElementById("yaml-preview");
    response.json().then(data => {
      yamlPreviewSection.innerHTML = data.yaml_str;
    });
  })
});