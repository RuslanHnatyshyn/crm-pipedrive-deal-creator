function openForm() {
  const formUrl = "./pages/form.html";
  const newWindow = window.open(formUrl, "_blank");

  if (!newWindow) {
    alert("Please allow pop-ups for this site.");
  }

  const checkIfClosed = setInterval(() => {
    if (newWindow.closed) {
      clearInterval(checkIfClosed);
      alert("The form was closed.");
    }
  }, 1000);
}
