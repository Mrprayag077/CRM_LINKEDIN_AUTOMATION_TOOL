const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const prettier = require("prettier");
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
require("dotenv").config();
const sharp = require("sharp");

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const app = express();

mongoose.set("strictQuery", false);

// async function main() {
const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuna9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const prayagSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: [true, "Plz enter lat"],
    },

    long: {
      type: Number,
      required: [true, "Plz enter long"],
    },

    image: {
      type: String,
      required: [true, "Plz upload image"],
    },
  },
  { collection: "prayagsp" }
);

const Prayag = mongoose.model("Prayag", prayagSchema);

var profileLinks = ["https://www.linkedin.com/in/gourav-grover-02a82a200/"];

const firebaseConfig = {
  apiKey: "AIzaSyDa7kvj9JGl9vO4CzwCtIvXf_sjyCgk41Q",
  authDomain: "greenmapper-da4bf.firebaseapp.com",
  projectId: "greenmapper-da4bf",
  storageBucket: "greenmapper-da4bf.appspot.com",
  messagingSenderId: "729535270764",
  appId: "1:729535270764:web:cc9987a3d1b9e84be8ad49",
  measurementId: "G-9ZHQP5SXLL",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

async function linkined() {
  //   const usersinfosp = await usersinfos.find({ request_send_trigger: "today" });

  const lat = 18.553091;
  const long = 73.918978;

  //   console.log(profileLinkIds);

  //   const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch({
    headless: false,
    // args: ["--start-maximized"], // This argument will make the browser window fullscreen
    defaultViewport: null,
    permissions: ["notifications"], // Deny the notification permission
    args: ["--disable-notifications"], // Disable notifications
  });

  const page = await browser.newPage();

  await page.addStyleTag({
    content: `
    body, html {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

    .specific-container {
      width: 100% !important;
      height: 100% !important;
    }
  `,
  });

  await page.goto("https://crop-monitoring.eos.com/login");

  // Fill in email input field

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Click on "Continue" button

  // Wait for the button inside the second div to be present in the DOM
  await page.waitForSelector(
    '.button-wrap:nth-child(2) button[data-id="sign-in-button"]',
    { visible: true }
  );

  // Click the button inside the second div
  await page.click(
    '.button-wrap:nth-child(2) button[data-id="sign-in-button"]'
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Fill in email input field
  await page.waitForSelector(".mat-mdc-input-element", { visible: true });
  await page.type(".mat-mdc-input-element", `${process.env.USEREMAIL}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.waitForSelector(".mat-mdc-input-element.password-input", {
    visible: true,
  });

  // Type the password into the input field
  await page.type(
    ".mat-mdc-input-element.password-input",
    `${process.env.PASSWORD}`
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.waitForSelector(".content-wrp");

  // Click on the element with class 'content-wrp'
  await page.click(".content-wrp");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
  // Open a new tab

  //new browser
  //   const newTab = await browser.newPage();

  //   await newTab.goto("https://crop-monitoring.eos.com/main-map/fields/all");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await page.waitForSelector(".search-input", { visible: true });

  const searchInput = await page.$(".search-input");
  await searchInput.type(`${lat} , ${long}`);
  //   await searchInput.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const buttons1 = await page.$$(".search-controls__button");
  await buttons1[1].click();

  await new Promise((resolve) => setTimeout(resolve, 8000));

  const buttons = await page.$$(".mat-mdc-tooltip-trigger");
  await buttons[0].click();

  await new Promise((resolve) => setTimeout(resolve, 4000));

  await page.waitForSelector(".column"); // Replace '.column' with the class selector of the element you want to remove

  // Evaluate a function within the page context to remove the element
  // await page.evaluate(() => {
  //   const elementToRemove = document.querySelector(".column"); // Replace '.column' with the class selector of the element you want to remove
  //   if (elementToRemove) {
  //     elementToRemove.remove();
  //   }
  // });

  await page.evaluate(() => {
    const elementToRemove = document.querySelector(".column");
    if (elementToRemove) {
      elementToRemove.remove();
    }

    const elementToRemove1 = document.querySelector(".no-body-padding");
    if (elementToRemove1) {
      elementToRemove1.remove();
    }

    const elementToRemove2 = document.querySelector(".scenes-container");
    if (elementToRemove2) {
      elementToRemove2.remove();
    }

    const elementToRemove3 = document.querySelector(".search-box");
    if (elementToRemove3) {
      elementToRemove3.remove();
    }

    const elementToRemove4 = document.querySelector(".cm-filter");
    if (elementToRemove4) {
      elementToRemove4.remove();
    }

    const elementToRemove5 = document.querySelector(
      ".controls-wrapper-ng-content"
    );
    if (elementToRemove5) {
      elementToRemove5.remove();
    }

    const elementToRemove6 = document.querySelector(".zsiq_flt_rel");
    if (elementToRemove6) {
      elementToRemove6.remove();
    }

    // controls-wrapper - ng - content;

    //   no-body-padding no-header-padding open ng-star-inserted
    //   scenes-container ng-star-inserted
    //   search-box ng-star-inserted
    //   cm-filter ng-star-inserted
    // zsiq_flt_rel
  });

  await new Promise((resolve) => setTimeout(resolve, 7000));

  randomNumber = Math.floor(Math.random() * 1000); // You can adjust the range of random numbers as needed

  // Take a screenshot with a random filename
  const screenshotPath = `./image/screenshot_000000.png`;
  await page.screenshot({ path: screenshotPath });

  // const clip = { x: 0, y: 0, width: 1300, height: 550 };

  // const clip1 = { x: 0, y: 0, width: 1400, height: 550 };

  // await page.screenshot({
  //   path: `./image/screenshot_clip00_${randomNumber}.png`,
  //   clip: clip,
  // });

  // await page.screenshot({
  //   path: `./image/screenshot_clip222_.png`,
  //   clip: clip1,
  // });

  console.log("screenshot taken");

  await new Promise((resolve) => setTimeout(resolve, 10000));

  const inputPath = "./image/screenshot_000000.png"; // Path to the original screenshot
  const outputPath = "./image/cropped.png"; // Path to save the cropped image
  const cropPercentage = 0.34; // 20% of the width to be cropped

  sharp(inputPath)
    .metadata()
    .then((metadata) => {
      // Calculate the width of the cropped region
      const cropWidth = Math.floor(metadata.width * (1 - cropPercentage));

      // Crop the image from the right 20% of the width
      sharp(inputPath)
        .extract({ left: 0, top: 0, width: cropWidth, height: metadata.height })
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error("Error cropping image:", err);
          } else {
            console.log("insdie 1st");

            console.log("Image cropped and saved successfully.");

            // Example usage
            const inputPath1 = "./image/cropped.png"; // Path to the input image
            const outputPath1 = "./image/crop2.png"; // Path to save the cropped image
            const targetWidth1 = 640; // Width of the cropped image
            const targetHeight1 = 640; // Height of the cropped image

            cropImage(inputPath1, outputPath1, targetWidth1, targetHeight1);
          }
        });
    })
    .catch((err) => {
      console.error("Error reading image metadata:", err);
    });

  await new Promise((resolve) => setTimeout(resolve, 90000));
}

linkined();

let URL_IMAGE;
let filename;
let fileitem;
let randomNumber;

async function uploadImageToFirebase(filename, fileitem) {
  try {
    const storageRef = ref(storage, "images/" + filename);

    // Set the content type as image/png
    const metadata = {
      contentType: "image/png",
    };

    // Upload the file with metadata
    await uploadBytes(storageRef, fileitem, metadata);

    // Get the public download URL
    const publicURL = await getDownloadURL(storageRef);

    console.log("File uploaded successfully!");
    console.log("Public URL:", publicURL);

    URL_IMAGE = publicURL;

    try {
      // Create a new Prayag document
      const newPrayag = new Prayag({
        lat: 101,
        long: 101,
        image: publicURL, // Assuming image is a URL or file path, modify this according to your use case
      });

      await newPrayag.save();

      // Respond with success message
      console.log("IMAGE DATA SAVED ON DB: MONGO");
    } catch (error) {
      // Handle errors and respond with an error message
      console.error(error);
      console.log("DB ERROR NOT SAVED");
    }

    return publicURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw the error to handle it in the calling function if needed
  }
}

//next flow
async function cropImage(inputPath1, outputPath1, targetWidth1, targetHeight1) {
  console.log("insdie cropimfage");

  try {
    // Read the input image metadata
    const metadata = await sharp(inputPath1).metadata();

    // Calculate crop dimensions
    const cropWidth = Math.min(targetWidth1, metadata.width);
    const cropHeight = Math.min(targetHeight1, metadata.height);

    // Calculate crop position
    const left = Math.floor((metadata.width - cropWidth) / 2);
    const top = Math.floor((metadata.height - cropHeight) / 2);

    // Crop and resize the image
    await sharp(inputPath1)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(targetWidth1, targetHeight1)
      .toFile(outputPath1);

    console.log("Image cropped and saved successfully.");

    // Example usage:
    filename = `screenshot_clip00_${randomNumber}_5oct.png`;
    fileitem = fs.readFileSync(`./image/crop2.png`);

    uploadImageToFirebase(filename, fileitem)
      .then((publicURL) => {
        console.log("Public URL:", publicURL);
      })
      .catch((error) => {
        // Handle error if the upload fails
        console.error("Error in uploadImageToFirebase:", error);
      });
  } catch (error) {
    console.error("Error cropping image:", error);
    throw error;
  }
}
