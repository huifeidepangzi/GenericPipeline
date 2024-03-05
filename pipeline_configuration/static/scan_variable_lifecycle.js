const lifecycleScanForm = document.querySelector('.lifecycle-collection-form');

lifecycleScanForm.addEventListener('submit', function (e) {
  e.preventDefault()
  var formData = new FormData(this);
  const scanLifecycleInfoURL = 'collect-lifecycle-info/?variable_name=' + formData.get("variable_name");

  // Access form data
  fetch(scanLifecycleInfoURL, {
      method: 'GET',
      headers: {
      },
  }).then(response => {
      response.json().then(data => {
        var scanResultElement = document.querySelector(".scan-result-section");
        scanResultElement.innerText = data.scan_results.join("\n");
      })
  });
})