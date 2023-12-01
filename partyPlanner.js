const COHORT = "REPLACE_ME!";
const API_URL= `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b/events`
console.log(API_URL);

const state = {
    parties: [],
  };
  const partyList = document.querySelector("#parties");
  const addPartyForm = document.querySelector("#addParty");
  addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getParties();
    renderParties();
  }
  render();

/**
 * Update state with artists from API
 */
async function getParties() {
    try {
      const response = await fetch(API_URL);
      const jsonResponse = await response.json();
      console.log(jsonResponse); //to check what we have
      const parties = jsonResponse.data;
      state.parties = parties;
      console.log('Parties:', state) //to test that its working
      
    } catch (error) {
      console.error(error.message);
    }
  }

/**
 * Render party from state
 */
function renderParties() {
    if (!state.parties.length) {
      partyList.innerHTML = "<li>No party.</li>";
      return;
    }
    // to create an artist, if we dont hv it in the list 
    const partyCards = state.parties.map((party) => {
      const button = document.createElement("button");
      button.innerText = "Delete"
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>

      `;
      return li;
    });
  
    partyList.replaceChildren(...partyCards);
  }
/**
 * Ask the API to create a new artist based on form data
 */
async function addParty(event) {
    event.preventDefault();
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addPartyForm.name.value,
          date: addPartyForm.date.value,
          time: addPartyForm.time.value,
          location: addPartyForm.location.value,
          description: addPartyForm.description.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create party");
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }

