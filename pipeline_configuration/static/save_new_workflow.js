const newYamlCreationForm = document.querySelector("#new-yaml-creation-form");


newYamlCreationForm.addEventListener('submit', function (e) {
  e.preventDefault()
  // const newYamlCreationURL = 'pipeline_configuration/add_pipeline/';
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

  fetch('', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
//   .then(response => {
//     if (response.ok) {
//         console.log('POST request successful');
//         return response.text(); // or response.json() for JSON response
//     }
//     throw new Error('POST request failed');
//   })
//   .then(data => {
//     console.log('Response:', data);
//     // Handle response here
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//     // Handle error here
//   });
  // Access form data
//   fetch(scanLifecycleInfoURL, {
//       method: 'POST',
//       headers: {
//       },
//   }).then(response => {
//       response.json().then(data => {
//         var scanResultElement = document.querySelector(".scan-result-section");
//         scanResultElement.innerText = data.scan_results.join("\n");
//       })
//   });
})