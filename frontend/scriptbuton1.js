document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn1").addEventListener("click", async () => {
    const query = `
      PREFIX ci:     <http://cosminionut.ro/> 
      PREFIX schema: <http://schema.org/>
      PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>
      
      SELECT ?gameName ?genre ?price ?year ?creatorName ?location ?foundingDate
      WHERE {
        GRAPH ci:Jocuri {
          ?game a schema:VideoGame ;
                schema:genre ?genre ;
                schema:price ?price ;
                schema:datePublished ?year ;
                schema:creator ?creator .
          FILTER(?year >= "2015"^^xsd:gYear)
        }
      
        GRAPH ci:Producatori {
          ?creator schema:location ?location ;
                   schema:foundingDate ?foundingDate .
        }
      
        BIND(REPLACE(STR(?game), "http://cosminionut.ro/", "") AS ?gameName)
        BIND(REPLACE(STR(?creator), "http://cosminionut.ro/", "") AS ?creatorName)
      }
    `;

    const response = await fetch("http://localhost:5001/queryRDF", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    

    const headers = ["Joc", "Gen", "Pret", "An", "Producator", "Locatie", "Fondare"];
    const rows = data.results.bindings.map(row => [
      row.gameName.value,
      row.genre.value,
      row.price.value,
      row.year.value,
      row.creatorName.value,
      row.location.value,
      row.foundingDate.value
    ]);
    
    document.getElementById("tabel1").innerHTML = createTable(headers, rows);
  });
});

function createTable(headers, rows) {
  return `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map(row => 
          `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`
        ).join("")}
      </tbody>
    </table>
  `;
}