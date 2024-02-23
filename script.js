const username = document.getElementById("username");
const message = document.getElementById("message");

const posts = document.getElementById("posts");
const errorTxt = document.getElementById("error");

function post() {
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
      username.value = "";
      message.value = "";
      getData();
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
    <p>${post.user}</p>
    <p>${post.msg}</p>
    <p>${post.date}</p>
  </div>`;
    posts.prepend(newPost);
  });
}

document.addEventListener("DOMContentLoaded", getData());
