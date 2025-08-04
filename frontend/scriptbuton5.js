document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn5").addEventListener("click", async () => {

    const query = `
      query {
        allJocuris {
          id
          name
          genre
          price
          year
          producerId
        }
        allProducatoris {
          id
          name
          location
          foundingDate
        }
      }
    `;

    const response = await fetch("http://localhost:5001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    

    const oldProducers = result.data.allProducatoris
      .filter(producer => {
        const year = parseInt(producer.foundingDate, 10);
        return !isNaN(year) && year < 2000;
      })
      .reduce((map, producer) => {
        map[producer.id] = producer;
        return map;
      }, {});
    

    const filteredGames = result.data.allJocuris
      .filter(game => oldProducers[game.producerId])
      .map(game => {
        const producer = oldProducers[game.producerId];
        return {
          name: game.name,
          genre: game.genre,
          price: game.price,
          year: game.year,
          producerName: producer.name,
          location: producer.location,
          foundingYear: producer.foundingDate
        };
      });
    

    const container = document.getElementById("tabel3");
       
    const headers = ["Joc", "Gen", "Pret", "An", "Producator", "Locatie", "An fondare"];
    const rows = filteredGames.map(game => [
      game.name,
      game.genre,
      game.price,
      game.year,
      game.producerName,
      game.location,
      game.foundingYear
    ]);
    
    container.innerHTML = createTable(headers, rows);
  });
});