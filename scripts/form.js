const API_KEY = "40ce1cb50e1a07556ce0a5cb5f4e74b77f1f4e38";
const DEAL_URL = `https://api.pipedrive.com/v1/deals?api_token=${API_KEY}`;
const PERSON_URL = `https://api.pipedrive.com/v1/persons?api_token=${API_KEY}`;
const form = document.querySelector(".form");
const createButton = document.querySelector(".create-btn");

function saveFormDataToLocalStorage() {
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    localStorage.setItem(key, value);
  });
}

function loadFormDataFromLocalStorage() {
  const formElements = form.elements;

  for (let element of formElements) {
    if (element.name && localStorage.getItem(element.name)) {
      element.value = localStorage.getItem(element.name);
    }
  }
}

async function sendRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unknown error");
    }

    return result;
  } catch (error) {
    alert(`Request failed: ${error.message}`);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", loadFormDataFromLocalStorage);

form.addEventListener("input", saveFormDataToLocalStorage);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  createButton.textContent = "Request is sand";
  createButton.classList.add("clicked");

  const formData = new FormData(form);

  const personData = {
    name: `${formData.get("first_name")} ${formData.get("last_name")}`,
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  try {
    const personResult = await sendRequest(PERSON_URL, personData);
    const personId = personResult.data.id;

    const dealData = {
      title: `${formData.get("first_name")} ${formData.get(
        "last_name"
      )} - ${formData.get("job_details")}`,
      person_id: personId,
    };

    await sendRequest(DEAL_URL, dealData);

    alert("Deal successfully created in Pipedrive!");

    form.reset();
    localStorage.clear();
    
  } catch (error) {
    console.error("Failed to create deal:", error);
  } finally {
    createButton.textContent = "Create deal";
    createButton.classList.remove("clicked");
  }
});
