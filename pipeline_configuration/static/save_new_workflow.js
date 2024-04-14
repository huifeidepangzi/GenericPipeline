const newYamlCreationForm = document.querySelector("#new-yaml-creation-form");


newYamlCreationForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const newYamlCreationURL = '/pipeline_configuration/add_pipeline/';
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
    var saveResultMessageLocation = document.getElementById("save-result-message");
    if (response.ok) {
        saveResultMessageLocation.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Pipeline yaml created successfully!</strong>
          <button type="button" class="btn-close close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        `;
    } else {
      response.json().then(data => {
        console.log('Response:', data);
        saveResultMessageLocation.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Fail to create pipeline yaml...Reason: ${data.message}</strong>
            <button type="button" class="btn-close close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        `;
      });
    }
  })
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