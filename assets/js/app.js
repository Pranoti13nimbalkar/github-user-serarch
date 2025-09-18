
const cl=console.log;
let BASE_URL = "https://api.github.com/users";

const userForm = document.getElementById('userForm');
const userNameControl = document.getElementById('userName');
const profileContainer = document.getElementById('profileContainer');
const searchPage = document.getElementById('searchPage');
const profilePage = document.getElementById('profilePage');
const backBtn = document.getElementById('backBtn');

const makeApiCall = async (method_name, api_url) => {
  let res = await fetch(api_url, { method: method_name });
  return await res.json();
};

const onUserSearch = async (eve) => {
  eve.preventDefault();

  let username = userNameControl.value;

  // Show profile page, hide search page
  searchPage.style.display = "none";
  profilePage.style.display = "block";
  profileContainer.innerHTML = `<p> Loading...</p>`;

  let USERNAME_URL = `${BASE_URL}/${username}`;
  let USER_REPOS_URL = `${USERNAME_URL}/repos?sort=created&per_page=6`;

  try {
    let [userDetails, userRepos] = await Promise.all([
      makeApiCall("GET", USERNAME_URL),
      makeApiCall("GET", USER_REPOS_URL),
    ]);

    if (userDetails.message === "Not Found") {
      profileContainer.innerHTML = `<p style="color:red;"> User not found</p>`;
      return;
    }

    showProfile(userDetails, userRepos);
  } catch (err) {
    profileContainer.innerHTML = `<p style="color:red;"> Error loading profile</p>`;
  }
};

const showProfile = (userInfo, repoList) => {
  profileContainer.innerHTML = `
  <div class="col-md-8 offset-md-2">
    <div class="card">
    <div class="col-md-6 offset-md-3">
      <img src="${userInfo.avatar_url}" alt="${userInfo.login}">
      </div>
      <div class="row">
      <div class="col-md-8 offset-md-2">
      <h2>${userInfo.name || userInfo.login}</h2>
      <p>${userInfo.bio || ""}</p>
      <div class="profileInfo">
        <span><i class="fa-solid fa-users"></i> ${userInfo.followers} Followers</span>
        <span><i class="fa-regular fa-circle-right" style="color:Blue;"></i> ${userInfo.following} Following</span>
        <span><i class="fa-solid fa-folder" style="color:Gold;"></i> ${userInfo.public_repos} Repos</span>
      </div>
      </div>
      <div class="col-md-12">
      <div class="repos">
        ${repoList.map(repo => `
          <a class="repo" href="${repo.html_url}" target="_blank">
            ${repo.name} <i class="fa-solid fa-star"style="color:Gold;"></i>${repo.stargazers_count}
          </a>`).join('')}
      </div>
      </div>
      </div>
    </div>
    </div>
  `;
};

// Back button
backBtn.addEventListener('click', () => {
  profilePage.style.display = "none";
  searchPage.style.display = "block";
  userNameControl.value = ""; 
});

userForm.addEventListener('submit', onUserSearch);
