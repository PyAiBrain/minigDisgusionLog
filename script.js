const documentGrid = document.getElementById("document-grid")
const searchBar = document.getElementById("search-bar")

let wordDocuments = []

async function fetchDocuments() {
  try {
    const response = await fetch("https://api.github.com/repos/PyAiBrain/minigDisgusionLog/contents/protocol")
    if (!response.ok) throw new Error("Failed to fetch documents")
    const data = await response.json()
    wordDocuments = data
      .filter((file) => file.name.endsWith(".docx"))
      .map((file) => ({
        name: file.name,
        url: `https://raw.githubusercontent.com/PyAiBrain/minigDisgusionLog/main/protocol/${file.name}`,
      }))
    displayDocuments(wordDocuments)
  } catch (error) {
    console.error("Error fetching documents:", error)
    documentGrid.innerHTML = "<p>Error loading documents. Please try again later.</p>"
  }
}

function createDocumentElement(doc) {
  const container = document.createElement("div")
  container.className = "document-container"

  const title = document.createElement("h2")
  title.className = "document-title"
  title.textContent = doc.name

  container.appendChild(title)

  container.addEventListener("click", () => downloadDocument(doc))

  return container
}

function downloadDocument(doc) {
  fetch(doc.url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error("Error downloading document:", error)
      alert("Failed to download document. Please try again.")
    })
}

function displayDocuments(docs) {
  docs.forEach((doc) => {
    const docElement = createDocumentElement(doc)
    documentGrid.appendChild(docElement)
  })
}

function filterDocuments(query) {
  const filteredDocs = wordDocuments.filter((doc) => doc.name.toLowerCase().includes(query.toLowerCase()))
  displayDocuments(filteredDocs)
}

searchBar.addEventListener("input", (e) => {
  filterDocuments(e.target.value)
})

// Fetch and display documents when the page loads
fetchDocuments()

