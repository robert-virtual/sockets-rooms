const socket = io();

const messages = document.getElementById("messages");
const me = document.getElementById("me");
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

enviar.addEventListener("click", () => {
  console.log(usersE.value);
  socket.emit("message", usersE.value, msg.value);
});

btnJoin.addEventListener("click", () => {
  btnJoin.classList.add("hidden");
  const nombre = prompt("ingrese su nombre");
  if (nombre) {
    socket.emit("join-room", ROOM_ID, nombre);
    me.textContent = nombre;
    console.log(nombre);
  }
});

socket.on("join", addUsers);
socket.on("new-participant", addUsers);
socket.on("message", ({ msg, user }) => {
  console.log("new message");
  const div = document.createElement("div");

  const nombre = document.createElement("p");
  nombre.textContent = user.userName;
  const p = document.createElement("p");
  let style = "bg-gray-200 text-black";

  if (user.id == socket.id) {
    style = "bg-cyan-400 text-white";
  }
  p.classList = "p-2 rounded" + style;
  p.textContent = msg;
  div.append(nombre);
  div.append(p);

  messages.append(div);
});

function addUsers(users = []) {
  console.log("addUsers", users);
  usersE.hidden = false;
  usersE.innerHTML = "";
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
