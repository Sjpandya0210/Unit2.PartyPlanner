const COHORT = "2310-fsa-et-web-pt-sf-b-shruti";
const apiUrl= `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`
console.log(apiUrl);

const state = {
    partyEvents: [],
  };

  const partyList = document.querySelector("#parties");
  const addPartyToForm = document.querySelector("#addParty");
 
  addPartyToForm.addEventListener("submit", addParty);
 

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getParties(); //again and again calling the function 
    renderParties(); // everytime we see if the party is in the event or need to create one.
  }
  render();


/**
 * Update state with party from API
 * function to get data from the server 
 */
async function getParties() {
    try {
      const response = await fetch(apiUrl);
      const jsonResponse = await response.json();
      console.log(jsonResponse); //to check what we have
      const partyEvents = jsonResponse.data; // because we only need data not errors and others
      state.partyEvents = partyEvents;
      console.log('Parties:', state) //to test that its working
      
    } catch (error) {
      console.error(error.message);
    }
  }

/**
 * Render party from state
 * function to update the DOM with the list of 
 */
function renderParties() {
    if (!state.partyEvents.length) {
      partyList.innerHTML = "<li>No party.</li>";
      return;
    }
    // to create an artist, if we dont hv it in the list 
    const partyCards = state.partyEvents.map((party) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>
        <button class="delete-party" data-party-id="${party.id}">X</button>
    `;
      return li;
    });
  
    partyList.replaceChildren(...partyCards);
  }
/**
 * Ask the API to create a new party based on form data
 */
async function addParty(event) {
    event.preventDefault();
  
    try {
      const currentDate = new Date();
      const selectedDate = new Date(addPartyToForm.date.value);
    // Check if the selected date is equal to or greater than the current date
      if (selectedDate < currentDate) {
        throw new Error("Please select a date equal to or greater than the current date.");
      }

      const response = await fetch (apiUrl,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addPartyToForm.name.value,
          date: new Date(addPartyToForm.date.value).toISOString(), // Convert to ISO-8601 format
          location: addPartyToForm.location.value,
          description: addPartyToForm.description.value,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to create party. Server response: ${errorMessage}`);
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }
// function to delete the data from the server

// Add this inside your addArtistForm event listener block

partyList.addEventListener("click", (event) => {

  if (event.target.classList.contains("delete-party")) {
      const partyId = event.target.dataset.partyId;
      deleteParty(partyId);
  }
});

async function deleteParty(partyId) {
  try {
      const response = await fetch(`${apiUrl}/${partyId}`, {
          method: "DELETE",
      });

      if (!response.ok) {
         const errorMessage = await response.text();
          throw new Error(`Failed to delete party.Server response: ${errorMessage}`);
      }

      render();
  } catch (error) {
      console.error(error);
  }
}
