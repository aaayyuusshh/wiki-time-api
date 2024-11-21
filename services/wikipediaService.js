async function getArticleHTML(title) {
    const url = "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
        origin: "*",
        action: "parse",
        page: title,
        format: "json",
        prop: "text"
    });
  
    const req = await fetch(url);
    const json = await req.json();
    console.log(json.parse.text["*"]);
    
    return json.parse.text["*"];
}

module.exports = { getArticleHTML };