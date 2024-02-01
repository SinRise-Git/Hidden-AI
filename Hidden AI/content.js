navigator.clipboard.readText()
  .then(text => {
    let processedData = text + "test";
    navigator.clipboard.writeText(processedData);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
