document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn3").addEventListener("click", async () => {

    const [producersResponse, gamesResponse] = await Promise.all([
      fetch("http://localhost:5001/producatoriREST"),
      fetch("http://localhost:5001/jocuriREST")
    ]);
    
    const producers = await producersResponse.json();
    const games = await gamesResponse.json();


    const producerMap = {};
    producers.forEach(p => { producerMap[p.id] = p; });


    const filteredGames = games
      .filter(game => parseFloat(game.price) < 80)
      .map(game => {
        const producer = producerMap[game.producerId] || {};
        return {
          name: game.name,
          genre: game.genre,
          price: game.price,
          year: game.year,
          producerName: producer.name,
          location: producer.location,
          foundingDate: producer.foundingDate
        };
      });


    const container = document.getElementById("tabel2");
    
    const headers = ["Joc", "Gen", "Pret", "An", "Producator", "Locatie", "Fondare"];
    const rows = filteredGames.map(game => [
      game.name,
      game.genre,
      game.price,
      game.year,
      game.producerName,
      game.location,
      game.foundingDate
    ]);
    
    container.innerHTML = createTable(headers, rows);
  });
});