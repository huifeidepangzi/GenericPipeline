const newYamlCreationForm = document.querySelector("#new-yaml-creation-form");


newYamlCreationForm.addEventListener('submit', function (e) {
  e.preventDefault()
  // const newYamlCreationURL = 'pipeline_configuration/add_pipeline/';
  var stepNames = [];
  var businessSteps = document.getElementById("business-steps").querySelectorAll(".card-header");
  var pipeline_name = document.getElementById("new-pipeline-name").value;
  var pipeline_description = document.getElementById("new-pipeline-description").value;
  console.log(businessSteps);

  businessSteps.forEach(function(step) {
    stepNames.push(step.getAttribute("value"));
  });
  console.log(stepNames);
  var postData = {
    "spec_names": stepNames,
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