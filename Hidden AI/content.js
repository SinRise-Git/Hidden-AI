navigator.clipboard.readText()
  .then(text => {
    let processedData = text + " kys lol";
    navigator.clipboard.writeText(processedData);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
