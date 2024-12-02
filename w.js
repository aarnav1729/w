// Step 1: Create a CSV File of Stakeholder Information
// Filename: stakeholders.csv
// Content of stakeholders.csv
// name,number
// John Doe,+911234567890
// Jane Smith,+911234567891
// Mark Taylor,+911234567892

// Step 2: Full JavaScript Script Integrated with whatsapp-web.js

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const csv = require("csv-parser");

// Create a new WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Generate and display QR code for authentication
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Log when the client is ready
client.on("ready", () => {
  console.log("Client is ready!");

  // Step 3: Read Stakeholder Information from CSV File
  let stakeholders = [];

  fs.createReadStream("w.csv")
    .pipe(csv())
    .on("data", (row) => {
      stakeholders.push({
        name: row.name,
        number: row.number,
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed");

      // Step 4: Send Personalized Messages to Each Stakeholder
      stakeholders.forEach((stakeholder) => {
        const { name, number } = stakeholder;

        // Basic validation: Ensure number starts with '+' and is at least 10 digits long
        if (!/^\+\d{10,15}$/.test(number)) {
          console.error(`Invalid number format: ${number}`);
          return;
        }

        const message = `Hello ${name}, this is a friendly reminder regarding the insider trading norms applicable to you. Please ensure you have reviewed the latest policies.`;

        client
          .sendMessage(number, message)
          .then((response) => {
            console.log(`Message sent to ${number}`);
          })
          .catch((err) => {
            console.error(`Failed to send message to ${number}:`, err);
          });
      });

      // Step 5: Close the Client After Sending Messages
      setTimeout(() => {
        client.destroy();
      }, 5000);
    });
});

// Initialize the client
client.initialize();
