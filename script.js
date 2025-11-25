document.addEventListener("DOMContentLoaded", () => {
    const fetchBtn = document.getElementById("fetchRepos");
    const clearBtn = document.getElementById("clearRepos");
    const reposContainer = document.getElementById("reposContainer");
    const githubUserInput = document.getElementById("githubUser");
    const repoError = document.getElementById("repoError");
  
    // Click fetch
    fetchBtn.addEventListener("click", () => fetchRepos());
  
    // Double-click fetch (refresh)
    fetchBtn.addEventListener("dblclick", () => {
      reposContainer.innerHTML = "";
      fetchRepos();
    });
  
    // Keyup on username input
    githubUserInput.addEventListener("keyup", () => {
      repoError.textContent = `Ready to fetch repos for ${githubUserInput.value}`;
    });
  
    // Clear repos
    clearBtn.addEventListener("click", () => {
      reposContainer.innerHTML = "";
      repoError.textContent = "";
    });
  
    // Fetch function
    function fetchRepos() {
      const username = githubUserInput.value.trim();
      if (!username) {
        repoError.textContent = "Please enter a GitHub username.";
        return;
      }
  
      repoError.textContent = "";
      reposContainer.innerHTML = "<p>Loading...</p>";
  
      fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch API data");
          return response.json();
        })
        .then(data => {
          reposContainer.innerHTML = "";
          if (data.length === 0) {
            reposContainer.innerHTML = "<p>No repositories found.</p>";
            return;
          }
  
          data.forEach(repo => {
            const card = document.createElement("div");
            card.className = "card p-3 mb-3";
  
            card.innerHTML = `
              <h5><a href="${repo.html_url}" target="_blank">${repo.name}</a></h5>
              <p><strong>Description:</strong> ${repo.description || "No description"}</p>
              <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
              <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
              <p><strong>Last Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
            `;
  
            reposContainer.appendChild(card);
          });
        })
        .catch(err => {
          reposContainer.innerHTML = "";
          repoError.textContent = "Error fetching GitHub data. Check username or connection.";
        });
    }
  });
  