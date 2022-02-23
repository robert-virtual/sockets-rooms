const socket = io();
const roomsList = document.getElementById("rooms");
let h2 = document.getElementById("h2");
socket.on("rooms", (rooms = []) => {
  h2.textContent = `Rooms: ${rooms.length}`;
  roomsList.innerHTML = "";
  rooms.forEach(({ users }, i) => {
    const div = document.createElement("div");
    div.classList = "bg-black text-white p-2 my-1 cursor-pointer";

    const title = document.createElement("p");
    const details = document.createElement("details");
    const sumary = document.createElement("summary");
    sumary.textContent = `Usuarios: ${users.length}`;
    details.append(sumary);
    users.forEach(({ userName }) => {
      let p = document.createElement("p");
      p.textContent = userName;
      details.append(p);
    });

    title.textContent = `Room #${i + 1}`;

    div.append(title);
    div.append(details);
    roomsList.append(div);
  });
});
