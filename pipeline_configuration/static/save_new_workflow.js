const newYamlCreationForm = document.querySelector(".new-yaml-creation-form");


newYamlCreationForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const newYamlCreationURL = 'pipeline_configuration/drag_and_drop/';
  var stepNames = [];
  var businessSteps = document.getElementById("business-steps").querySelectorAll(".task");
  console.log(businessSteps);

  businessSteps.forEach(function(step) {
    stepNames.push(step.getAttribute("value"));
  });
  console.log(stepNames);
  var postData = {
    'spec_names': stepNames
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