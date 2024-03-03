const ServerURL = "https://roozine.cyclic.app";
//https://roozine.cyclic.app

const username = document.getElementById("username");
const message = document.getElementById("message");

const posts = document.getElementById("posts");
const errorTxt = document.getElementById("error");

const postBtn = document.getElementById("postBtn");

function post() {
  if (username.value.trim() == "" || message.value.trim() == "") {
    errorTxt.innerText = "Filed Are empty!";
    return;
  }
  console.log(username.value, message.value);
  postBtn.disabled = true;
  const date = new Date();
  var jsonData = {
    id: 0,
    user: username.value,
    msg: message.value,
    date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}  ${date
      .getHours()
      .toString()
      .padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`,
  };

  fetch(`${ServerURL}/appendData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      getData();
      afterPost();
      postBtn.disabled = true;
    })
    .catch((error) => {
      console.error("Error:", error);
      errorTxt.innerText = error;
    });
}
let cachedData = null;
function getData() {
  fetch(`${ServerURL}/getData`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data from db.json:", data);

      showRecentPosts(data);
      sortPostsByReaction(data);

      cachedData = data;
    })
    .catch((error) => {
      console.error("Error:", error);
      errorTxt.innerText = error;
    });
}

function showRecentPosts(data) {
  if (showingState !== "Recent") return;
  posts.innerHTML = "";

  recentBtn.style.textDecoration = "underline hsl(195, 59%, 60%) 2px";
  hotBtn.style.textDecoration = "none";
  bestBtn.style.textDecoration = "none";

  recentBtn.style.color = "hsl(0, 0%, 100%);";
  hotBtn.style.color = "hsl(0, 0%, 80%);";
  bestBtn.style.color = "hsl(0, 0%, 80%);";
  data.forEach((post) => {
    const newPost = document.createElement("div");

    newPost.innerHTML = `<div class="post-box" id=${post.id}>
    <p class="userid">${post.user}</p>
    <p class="postmsg">${post.msg}</p>
    <p class="postdate">${post.date}</p>
    <div class="reactions">
    <button onClick="reaction('l',${post.id})">👍 ${post.l}</button>
    <button onClick="reaction('d',${post.id})">👎 ${post.d}</button>
    <button onClick="reaction('h',${post.id})">❤️ ${post.h}</button>
    <button onClick="reaction('s',${post.id})">😁 ${post.s}</button>
    <button onClick="reaction('c',${post.id})">😢 ${post.c}</button>
    </div>
  </div>`;
    posts.prepend(newPost);
  });
}

function sortPostsByReaction(data) {
  if (showingState !== "Hot") return;
  let postRank = 1;
  let rankStyle;

  recentBtn.style.textDecoration = "none";
  hotBtn.style.textDecoration = "underline hsl(195, 59%, 60%) 2px";
  bestBtn.style.textDecoration = "none";

  recentBtn.style.color = "hsl(0, 0%, 80%);";
  hotBtn.style.color = "hsl(0, 0%, 100%);";
  bestBtn.style.color = "hsl(0, 0%, 80%);";
  posts.innerHTML = "";

  const sortedArrayDescending = data.sort((a, b) => {
    return b.l + b.d + b.h + b.s + b.c - (a.l + a.d + a.h + a.s + a.c);
  });

  sortedArrayDescending.forEach((post) => {
    const newPost = document.createElement("div");

    if (postRank === 1) {
      rankStyle = "style='color: gold;'";
    }
    if (postRank === 2) {
      rankStyle = "style='color: silver;'";
    }
    if (postRank === 3) {
      rankStyle = "style='color: #cd7f32;'";
    }
    if (postRank > 3) {
      rankStyle = "style='color: hsl(195, 59%, 60%)'";
    }
    newPost.innerHTML = `<div class="post-box">
    <p ${rankStyle} class="postrank">#${postRank++}</p>
    <p class="userid">${post.user}</p>
    <p class="postmsg">${post.msg}</p>
    <p class="postdate">${post.date}</p>
    <div class="reactions">
    <button onClick="reaction('l',${post.id})">👍 ${post.l}</button>
    <button onClick="reaction('d',${post.id})">👎 ${post.d}</button>
    <button onClick="reaction('h',${post.id})">❤️ ${post.h}</button>
    <button onClick="reaction('s',${post.id})">😁 ${post.s}</button>
    <button onClick="reaction('c',${post.id})">😢 ${post.c}</button>
    </div>
  </div>`;
    posts.append(newPost);
  });
}

const newpostheader = document.getElementById("newpostheader");
const newpost = document.getElementById("new-post");
const newpostheadericon = document.getElementById("newpostheadericon");

let newPostIsShowing = false;
newpostheader.addEventListener("click", () => {
  if (!newPostIsShowing) {
    newpostheader.classList.remove("newpostheaderhide");
    newpost.classList.remove("newposthide");
    newpostheadericon.classList.remove("newpostheaderhide");
    newpostheader.classList.add("newpostheadershow");
    newpost.classList.add("newpostshow");
    newpostheadericon.classList.add("newpostheadershow");
    newPostIsShowing = true;
  } else {
    newpostheader.classList.remove("newpostheadershow");
    newpost.classList.remove("newpostshow");
    newpostheadericon.classList.remove("newpostheadershow");
    newpostheader.classList.add("newpostheaderhide");
    newpost.classList.add("newposthide");
    newpostheadericon.classList.add("newpostheaderhide");
    newPostIsShowing = false;
  }
});

function afterPost() {
  //hides the new post div
  newpostheader.classList.remove("newpostheadershow");
  newpost.classList.remove("newpostshow");
  newpostheadericon.classList.remove("newpostheadershow");
  newpostheader.classList.add("newpostheaderhide");
  newpost.classList.add("newposthide");
  newpostheadericon.classList.add("newpostheaderhide");
  newPostIsShowing = false;

  //reset the inputs
  username.value = "";
  message.value = "";
}

document.addEventListener("DOMContentLoaded", getData);

const siteheader = document.getElementById("site-header");

siteheader.addEventListener("click", () => {
  window.location.href = "https://github.com/phantomboy0";
});

function reaction(emote, postId) {
  if (localStorage.getItem(postId + "voted")) {
    alert("You have already voted!");
  } else {
    var jsonData = {
      e: `${emote}`,
      id: `${postId}`,
    };
    fetch(`${ServerURL}/react`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        localStorage.setItem(postId + "voted", true);
        changeReactionState(emote, postId);
        getData();
      })
      .catch((error) => {
        console.error("Error:", error);
        errorTxt.innerText = error;
      });
  }
}

function changeReactionState(emote, postId) {
  var myDiv = document.getElementById(postId);

  // Find the first button inside the div
  var buttonInsideDiv = myDiv.querySelectorAll("button");
  switch (emote) {
    case "l":
      buttonInsideDiv[0].style.backgroundColor = "#576cbc";

      break;
    case "d":
      buttonInsideDiv[1].style.backgroundColor = "#576cbc";

      break;
    case "h":
      buttonInsideDiv[2].style.backgroundColor = "#576cbc";

      break;
    case "s":
      buttonInsideDiv[3].style.backgroundColor = "#576cbc";
      break;
    case "c":
      buttonInsideDiv[4].style.backgroundColor = "#576cbc";
      break;

    default:
      break;
  }
  // Save the updated styles in localStorage
}

const recentBtn = document.getElementById("Recent");
const hotBtn = document.getElementById("Hot");
const bestBtn = document.getElementById("Best");

let showingState = "Recent";
function changeShowState(state) {
  showingState = state;
  if (cachedData !== null) {
    showRecentPosts(cachedData);
    sortPostsByReaction(cachedData);
  } else {
    getData();
  }
}

// Function to save styles in localStorage
