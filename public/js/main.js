const socket = io();

const messages = document.getElementById("messages");
const usersList = document.getElementById("users-list");
const me = document.getElementById("me");
const openMenu = document.getElementById("open-menu");
const msg = document.getElementById("msg");
const enviar = document.getElementById("enviar");
const usersE = document.getElementById("users");
const btnJoin = document.getElementById("btn-join");
const { pathname } = location;
const ROOM_ID = pathname.replace("/", "");
console.log("ROOM_ID: ", ROOM_ID);

socket.on("disconnect", () => {
  console.log("disconnect"); // undefined
});

msg.addEventListener("keyup", ({ key }) => {
  console.log(key);
  if (key == "Enter") {
    socket.emit("message", usersE.value, msg.value);
    msg.value = "";
  }
});
enviar.addEventListener("click", () => {
  console.log(usersE.value);
  socket.emit("message", usersE.value, msg.value);
  msg.value = "";
});

btnJoin.addEventListener("click", () => {
  btnJoin.classList.add("hidden");
  let userName = prompt("ingrese su nombre");
  if (userName) {
    document.getElementById("msg-container").classList.remove("hidden");
    messages.classList.remove("hidden");
    socket.emit("join-room", ROOM_ID, { userName, color: anyColor() });
    me.textContent = userName;
    console.log(userName);
  }
});

socket.on("join", addUsers);
socket.on("new-participant", addUsers);

socket.on("message", ({ msg, user, private }) => {
  console.log("new message");
  const div = document.createElement("div");
  const nombre = document.createElement("p");
  nombre.textContent = `${user.userName} ${private ? "(privado)" : ""}`;
  nombre.style.color = user.color;
  const text = document.createElement("p");
  let style = "bg-gray-200 text-black ";
  div.classList.add("self-start");

  if (user.id == socket.id) {
    div.classList.replace("self-start", "self-end");
    style = "bg-cyan-400 text-white ";
  } else {
    div.append(nombre);
  }
  div.classList += " p-2 rounded " + style;
  text.textContent = msg;
  div.append(text);

  messages.append(div);
});

function addUsers(users = []) {
  console.log("addUsers", users);
  usersE.hidden = false;
  usersE.innerHTML = "";
  addToMenu(users);
  users.unshift({ id: ROOM_ID, userName: "Todos" });
  users.forEach(({ id, userName }) => {
    if (id != socket.id) {
      const op = document.createElement("option");
      op.value = id;
      op.textContent = userName;
      usersE.append(op);
    }
  });
}

function addToMenu(users = []) {
  let h2 = document.createElement("h2");
  h2.textContent = "Usuarios";
  h2.classList = "text-4xl mb-4 sticky top-0 bg-cyan-100";
  usersList.innerHTML = "";
  usersList.append(h2);
  users.forEach(({ id, userName }) => {
    if (id != socket.id) {
      const div = document.createElement("div");
      div.classList = "bg-white p-2 my-1 cursor-pointer";
      // div.id = id;
      div.addEventListener("click", () => {
        usersE.value = id;
      });
      const p = document.createElement("p");
      p.textContent = userName;
      div.append(p);
      usersList.append(div);
    }
  });
}

function random() {
  let { random, round } = Math;
  return round(random() * 255);
}

function anyColor() {
  return `rgb(${random()},${random()},${random()})`;
}

openMenu.addEventListener("click", () => {
  // users - list;
  usersList.classList.toggle("hidden");
});
