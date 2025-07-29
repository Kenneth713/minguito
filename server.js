const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const filePath = "./contact.json";

function getContacts() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function saveContacts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/api/contacts", (req, res) => {
  const contacts = getContacts();
  res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
  const contacts = getContacts();
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  const newContact = { name, email };
  contacts.push(newContact);
  saveContacts(contacts);

  res.status(201).json({ message: "Contact added", contact: newContact });
});

app.put("/api/contacts/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const contacts = getContacts();

  if (isNaN(index) || index < 0 || index >= contacts.length) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const { name, email } = req.body;
  contacts[index] = {
    ...contacts[index],
    ...(name && { name }),
    ...(email && { email })
  };

  saveContacts(contacts);
  res.json({ message: "Contact updated", contact: contacts[index] });
});

app.delete("/api/contacts/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const contacts = getContacts();

  if (isNaN(index) || index < 0 || index >= contacts.length) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const deleted = contacts.splice(index, 1)[0];
  saveContacts(contacts);
  res.json({ message: "Contact deleted", deleted });
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
