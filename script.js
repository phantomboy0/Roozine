const username = document.getElementById("username");
const message = document.getElementById("message");

const posts = document.getElementById("posts");
const errorTxt = document.getElementById("error");

function post() {
  if (username.value == "" || message.value == "") {
    errorTxt.innerText = "Filed Are empty!";
    return;
  }
  console.log(username.value, message.value);

  const date = new Date();
  var jsonData = {
    user: username.value,
    msg: message.value,
    date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date
      .getHours()
      .toString()
      .padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`,
  };

  fetch("https://roozine.cyclic.app/appendData", {
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
    })
    .catch((error) => {
      console.error("Error:", error);
      errorTxt.innerText = error;
    });
}

function getData() {
  fetch("https://roozine.cyclic.app/getData")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data from db.json:", data);
      showPosts(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      errorTxt.innerText = error;
    });
}

function showPosts(data) {
  posts.innerHTML = "";

  data.forEach((post) => {
    console.log(post.user, post.msg, post.date);
    const newPost = document.createElement("div");

    newPost.innerHTML = `<div class="post-box">
    <p class="userid">${post.user}</p>
    <p class="postmsg">${post.msg}</p>
    <p class="postdate">${post.date}</p>
  </div>`;
    posts.prepend(newPost);
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
document.addEventListener("DOMContentLoaded", getData());

const siteheader = document.getElementById("site-header");

siteheader.addEventListener("click", () => {
  window.location.href = "https://github.com/phantomboy0";
});
