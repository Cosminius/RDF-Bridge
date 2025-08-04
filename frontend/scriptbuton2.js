document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn2").addEventListener("click", async () => {

    const rows = document.querySelectorAll("#tabel1 table tbody tr");

    const producerMap = {};
    for (const row of rows) {
      const name = row.children[4].innerText;
      const location = row.children[5].innerText;
      const foundingDate = row.children[6].innerText;

      if (!producerMap[name]) {
        const response = await fetch("http://localhost:5001/producatoriREST", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, location, foundingDate })
        });
        const producer = await response.json();
        producerMap[name] = producer.id;
      }
    }

    for (const row of rows) {
      const [name, genre, price, year, producerName] = 
        Array.from(row.children).slice(0, 5).map(td => td.innerText);

      await fetch("http://localhost:5001/jocuriREST", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          genre, 
          price,
          year,
          producerId: producerMap[producerName]
        })
      });
    }


    await populateProducerDropdown();
  });
});


async function populateProducerDropdown() {
  const dropdown = document.getElementById("dropdownProducers");
  
  const response = await fetch("http://localhost:5001/producatoriREST");
  const producers = await response.json();

  dropdown.innerHTML = "";
for (let p of producers) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.id} - ${p.name}`;
    dropdown.appendChild(option);
  }
  
}