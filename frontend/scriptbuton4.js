document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form4");
  

  populateProducerDropdown();

  form.addEventListener("submit", async () => {

    const formData = Object.fromEntries(new FormData(form));
    

    const [producersResponse, gamesResponse] = await Promise.all([
      fetch("http://localhost:5001/producatoriREST"),
      fetch("http://localhost:5001/jocuriREST")
    ]);
    
    const producers = await producersResponse.json();
    const games = await gamesResponse.json();

    const mutations = [];
    
    mutations.push(`
      createJocuri(
        name: "${formData.name}",
        genre: "${formData.genre}",
        price: "${formData.price}",
        year: "${formData.year}",
        producerId: ${formData.producerId}
      ) { id }
    `);
    

    const uniqueProducers = new Set();
    producers.forEach(producer => {
      if (!uniqueProducers.has(producer.name)) {
        uniqueProducers.add(producer.name);
        mutations.push(`
          createProducatori(
            name: "${producer.name}",
            location: "${producer.location}",
            foundingDate: "${producer.foundingDate}"
          ) { id }
        `);
      }
    });
    

    games.forEach(game => {
      mutations.push(`
        createJocuri(
          name: "${game.name}",
          genre: "${game.genre}",
          price: "${game.price}",
          year: "${game.year}",
          producerId: ${game.producerId}
        ) { id }
      `);
    });
    

    for (const mutation of mutations) {
      await fetch("http://localhost:5001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `mutation { ${mutation} }` })
      });
    }
    

    form.reset();
    await populateProducerDropdown();
  });
});