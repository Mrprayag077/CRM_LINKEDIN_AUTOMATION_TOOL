const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const prettier = require("prettier");
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { cosmiconfig } = require("prettier/third-party");
require("dotenv").config();

//WORK DONE
// ALREADY DONE CSV SEND REQUESTION WITH INDEX.HTML
//main working from sept 12 copied from old computer and done ACCEPT AND SERACHING SIMILAR PROFILES :

const app = express();

app.use(bodyParser.json());

const password = process.env.PASSWORD;
// console.log(password);
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500/');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
// app.use(
//     cors({
//         origin: ["http://127.0.0.1:5500/", ],
//         methods: ["GET", "POST"],
//         credentials: true,
//     })
// );
const corsOptions = {
  origin: "http://127.0.0.1:5501",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

mongoose.set("strictQuery", false);

// async function main() {
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.as6xaod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,

    // "mongodb+srv://prayag_SIHH:pp1234@cluster0.tuna9.mongodb.net/ats_linkedin?retryWrites=true&w=majority",

    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    // Connection successful, perform further operations
    console.log("Connected to MongoDB");

    // ... Your code here ...
  })
  .catch((error) => {
    // Connection failed, handle the error
    console.log("Failed to connect to MongoDB");
    console.error(error);
  });

const usersinfosSchema = {
  profile_link_id: String,
  request_send_trigger: String,
  notes: String,
  scrapped_data: {
    profile_link: String,
    username: String,
    followers: String,
    connections: String,
    header: String,
    about: String,
    location: String,
    experience: [String],
    education: [String],
    skills: [String],
    licenses_certifications: [String],
    interest: [String],
    highlights: [String],
    about_profile_joined: String,
    about_profile_contact_information: String,
    about_profile_profile_photo: String,
  },

  status: {
    request_sent: Boolean,
    request_date: Date,
    request_accepted: Boolean,
    replied: Boolean,
    follow_up_date: Date,
    connected: Boolean,
  },

  model_data: {
    priority: Number,
    request_message: Number,
    follow_up: Number,
  },
};

const usersinfos = mongoose.model("usersinfos", usersinfosSchema); //open_in== coll name

// var usersinfosp = ['https://www.linkedin.com/in/gourav-grover-02a82a200/'];

// async function linkined() {

//     // const usersinfosp = await usersinfos.find({ request_send_trigger: 'today' });

//     // const profileLinkIds = usersinfosp.map(doc => doc.profile_link_id);
//     const profileLinkIds = usersinfosp;
//     // const notes = usersinfosp.map(doc => doc.notes);
//     const notes = ['hiii i would like to connect with you.'];

//     console.log(profileLinkIds);
//     console.log(notes);

//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto('https://www.linkedin.com/login');

//     // Fill in email input field
//     const emailInput = await page.$('#username');
//     await emailInput.type(`${process.env.USEREMAIL}`);

//     const passInput = await page.$('#password');
//     await passInput.type(`${process.env.PASSWORD}`);

//     await new Promise(resolve => setTimeout(resolve, 3000));

//     // Click on "Continue" button
//     const continueButton = await page.$('.btn__primary--large.from__button--floating');
//     await new Promise(resolve => setTimeout(resolve, 3000));

//     await continueButton.click();

//     await new Promise(resolve => setTimeout(resolve, 3000));

//     await page.waitForNavigation();

//     await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
//     const button = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
//     await button[0].click();

//     await new Promise(resolve => setTimeout(resolve, 3000));

//     const serachButton = await page.$('.search-global-typeahead__collapsed-search-button');
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await serachButton.click();

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const serachInput = await page.$('.search-global-typeahead__input');
//     await serachInput.type('noveracion global');

//     await new Promise(resolve => setTimeout(resolve, 2000));
//     //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
//     // Open a new tab

//     //new browser
//     const newTab = await browser.newPage();

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     for (let i = 0; i < profileLinkIds.length; i++) {

//         // Navigate to the link
//         // await newTab.goto('https://www.linkedin.com/company/noveracion-global/');

//         //  await newTab.goto('https://www.linkedin.com/in/divyanshu-sahu-820467245/');

//         await newTab.goto(profileLinkIds[i]);

//         // await newTab.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.7 });

//         //page down
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
//         //    await button_more_collapse[2].click();

//         const username_profile_element = await newTab.$('.text-heading-xlarge');
//         const username_profile_page = await newTab.evaluate(username_profile_element => username_profile_element.textContent, username_profile_element);
//         // console.log(username_profile_page);

//         const header_element = await newTab.$('.text-body-medium');
//         const header_profile_page = await newTab.evaluate(header_element => header_element.textContent, header_element);
//         // console.log(header_profile_page);

//         console.log('hiii');

//         // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
//         // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
//         // console.log(textContent);

//         const elements = await newTab.$$('.pv-text-details__left-panel');

//         const secondDiv = elements[1];
//         const textElement = await secondDiv.$('span.text-body-small');
//         const textContent = await newTab.evaluate(element => element.textContent.trim(), textElement);
//         console.log(textContent);

//         //     const location_element = await newTab.$('.text-body-small');
//         //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
//         //    console.log(location_profile_page);

//         const aboutus_user_element = await newTab.$('.pv-shared-text-with-see-more');
//         const abotus_user_profile_page = await newTab.evaluate(aboutus_user_element => aboutus_user_element.textContent, aboutus_user_element);
//         //console.log(abotus_user_profile_page);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         //connect button click  WORKIN---div.artdeco-dropdown__item

//         //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

//         // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
//         //   await button_more_connect_part[7].click();

//         // Click the button

//         // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');

//         const followButton = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
//         const followButtonText = await newTab.evaluate(followButton => followButton.textContent, followButton);

//         console.log(`"${followButtonText}"`);

//         try {
//             if (followButtonText.includes('Follow')) {
//                 console.log('Follow if detected');

//                 await new Promise(resolve => setTimeout(resolve, 2000));

//                 const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
//                 await button_more_collapse[2].click();

//                 await new Promise(resolve => setTimeout(resolve, 1000));

//                 //connect button click  WORKIN---div.artdeco-dropdown__item

//                 const button_more_connect_part = await newTab.$$('div.artdeco-dropdown__item');
//                 // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
//                 await button_more_connect_part[7].click();

//                 await new Promise(resolve => setTimeout(resolve, 3000));

//                 add_a_note();
//             }

//             else if (followButtonText.includes('Connect')) {
//                 console.log('NOO Follow button detected going to three dot menu');
//                 await followButton.click();

//                 add_a_note();

//             }

//         } catch (err) {
//             console.log(err);

//         }

//         //await followButton.click();

//         async function add_a_note() {

//             await newTab.waitForSelector('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
//             const buttonnew = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
//             await buttonnew.click();

//             await newTab.waitForSelector('#custom-message');
//             const connect_note_send_message_ = await newTab.$('#custom-message');
//             // await connect_note_send_message_.type('Hello, I would like to connect with you!');
//             console.log("notessssssssssssss 583");
//             console.log(notes[0]);
//             await connect_note_send_message_.type(notes[0]);

//             await new Promise(resolve => setTimeout(resolve, 3000));

//             await newTab.waitForSelector('.artdeco-modal__actionbar');
//             const button_send_note_message = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)');
//             await button_send_note_message.click();

//             await new Promise(resolve => setTimeout(resolve, 9000));

//         };

//         await new Promise(resolve => setTimeout(resolve, 5000));

//         //  const profile_page_button = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
//         // await newTab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
//         // await profile_page_button.click();

//         await new Promise(resolve => setTimeout(resolve, 3000));

//         // Close the browser
//         //await browser.close();

//     }
// }

// linkined();

app.post("/datap", (req, res) => {
  const columnData = req.body.columnData;
  console.log("Received columnData:", columnData);

  // var usersinfosp = ['https://www.linkedin.com/in/gourav-grover-02a82a200/'];
  var usersinfosp;
  var usersinfosp1 = columnData;
  async function linkined() {
    let hrefArrayll = usersinfosp1.filter(
      (profile) =>
        !profile.includes("/company/") &&
        !profile.includes("/groups/") &&
        !profile.includes("/newsletters/")
    );

    console.log(hrefArrayll);
    console.log(hrefArrayll.length);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    usersinfosp = hrefArrayll.map((url) => url.replace(/\/$/, ""));
    console.log("finalllllllll -- 412");
    console.log(hrefArrayll);

    console.log("inside function :)");
    console.log(usersinfosp);

    // const usersinfosp = await usersinfos.find({ request_send_trigger: 'today' });

    // const profileLinkIds = usersinfosp.map(doc => doc.profile_link_id);
    const profileLinkIds = usersinfosp;
    let username_profile_page;
    // const notes = usersinfosp.map(doc => doc.notes);
    const notes = [`hiii,  would like to connect with you.`];

    console.log(profileLinkIds);
    console.log(notes);

    // const hrefArray = [];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.linkedin.com/login");

    // Fill in email input field
    const emailInput = await page.$("#username");
    await emailInput.type(`${process.env.USEREMAIL}`);

    const passInput = await page.$("#password");
    await passInput.type(`${process.env.PASSWORD}`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Click on "Continue" button
    const continueButton = await page.$(
      ".btn__primary--large.from__button--floating"
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await continueButton.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await page.waitForNavigation();

    await page.waitForSelector(
      ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
    );
    const button = await page.$$(
      ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
    );
    await button[0].click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const serachButton = await page.$(
      ".search-global-typeahead__collapsed-search-button"
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await serachButton.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const serachInput = await page.$(".search-global-typeahead__input");
    await serachInput.type("noveracion global");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
    // Open a new tab

    //new browser
    const newTab = await browser.newPage();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (let i = 0; i < profileLinkIds.length; i++) {
      // Navigate to the link
      // await newTab.goto('https://www.linkedin.com/company/noveracion-global/');

      //  await newTab.goto('https://www.linkedin.com/in/divyanshu-sahu-820467245/');

      await newTab.goto(profileLinkIds[i]);

      // await newTab.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.7 });

      //page down
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
      //    await button_more_collapse[2].click();

      const username_profile_element = await newTab.$(".text-heading-xlarge");
      username_profile_page = await newTab.evaluate(
        (username_profile_element) => username_profile_element.textContent,
        username_profile_element
      );
      console.log(username_profile_page);

      const header_element = await newTab.$(".text-body-medium");
      const header_profile_page = await newTab.evaluate(
        (header_element) => header_element.textContent,
        header_element
      );
      // console.log(header_profile_page);

      console.log("hiii");

      // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
      // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
      // console.log(textContent);

      const elements = await newTab.$$(".pv-text-details__left-panel");

      const secondDiv = elements[1];
      const textElement = await secondDiv.$("span.text-body-small");
      const textContent = await newTab.evaluate(
        (element) => element.textContent.trim(),
        textElement
      );
      console.log(textContent);

      //     const location_element = await newTab.$('.text-body-small');
      //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
      //    console.log(location_profile_page);

      console.log("hiii1");

      const aboutus_user_element = await newTab.$(
        ".pv-shared-text-with-see-more"
      );
      const abotus_user_profile_page = await newTab.evaluate(
        (aboutus_user_element) => aboutus_user_element.textContent,
        aboutus_user_element
      );
      //console.log(abotus_user_profile_page);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("hiii2");

      //connect button click  WORKIN---div.artdeco-dropdown__item

      //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

      // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
      //   await button_more_connect_part[7].click();

      // Click the button

      // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');

      let followButton;
      let followButtonText;

      try {
        console.log("inside try");

        followButton = await newTab.$(
          ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action"
        );
        followButtonText = await newTab.evaluate(
          (followButton) => followButton.textContent,
          followButton
        );

        console.log(`"${followButtonText}"`);
      } catch {
        console.log("inside catch");

        const pendingButton = await newTab.$(
          ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.pvs-profile-actions__action .artdeco-button__text"
        );
        const pendingText = await newTab.evaluate(
          (pendingButton) => pendingButton.textContent.trim(),
          pendingButton
        );

        console.log("Pending Text:", pendingText);

        if (pendingText.includes("Pending")) {
          console.log(
            "NOO Follow button detected going to three dot menu  pending detected --------------------------------"
          );
          // await followButton.click();

          // add_a_note();
          continue;
        }

        // console.log(`"${pendingText}"`);
        console.log("hiii5");
      }

      // await new Promise(resolve => setTimeout(resolve, 90000));

      try {
        console.log("hiii6");

        if (followButtonText.includes("Follow")) {
          console.log("Follow if detected");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          const button_more_collapse = await newTab.$$(
            "button.artdeco-dropdown__trigger"
          );
          await button_more_collapse[2].click();

          await new Promise((resolve) => setTimeout(resolve, 1000));

          //connect button click  WORKIN---div.artdeco-dropdown__item

          const button_more_connect_part = await newTab.$$(
            "div.artdeco-dropdown__item"
          );
          // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
          await button_more_connect_part[7].click();

          await new Promise((resolve) => setTimeout(resolve, 3000));

          add_a_note();
        } else if (followButtonText.includes("Connect")) {
          console.log("NOO Follow button detected going to three dot menu");
          await followButton.click();

          add_a_note();
        }
      } catch (err) {
        console.log(err);
      }

      //await followButton.click();

      async function add_a_note() {
        await newTab.waitForSelector(
          "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
        );
        const buttonnew = await newTab.$(
          "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
        );
        await buttonnew.click();

        await newTab.waitForSelector("#custom-message");
        const connect_note_send_message_ = await newTab.$("#custom-message");
        // await connect_note_send_message_.type('Hello, I would like to connect with you!');
        console.log("notessssssssssssss 583");
        console.log(notes[0]);
        // await connect_note_send_message_.type(notes[0]);
        await connect_note_send_message_.type(
          `hiii, ${username_profile_page}, i would like to connect with you.`
        );

        await new Promise((resolve) => setTimeout(resolve, 3000));

        await newTab.waitForSelector(".artdeco-modal__actionbar");
        const button_send_note_message = await newTab.$(
          "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)"
        );
        await button_send_note_message.click();

        await new Promise((resolve) => setTimeout(resolve, 9000));
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      //  const profile_page_button = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
      // await newTab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
      // await profile_page_button.click();

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Close the browser
      //await browser.close();
    }
  }

  linkined();

  res.status(200).json({ message: "Data received successfully" });
});

//ACCEPT ALL REQUEST
async function testingv1_ACCEPT() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // const usersinfosp = await usersinfos.find({ request_send_trigger: 'today' });

  // const profileLinkIds = usersinfosp.map(doc => doc.profile_link_id);

  // const hrefArray = [];

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  // Fill in email input field
  const emailInput = await page.$("#username");
  await emailInput.type(`${process.env.USEREMAIL}`);

  const passInput = await page.$("#password");
  await passInput.type(`${process.env.PASSWORD}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Click on "Continue" button
  const continueButton = await page.$(
    ".btn__primary--large.from__button--floating"
  );
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await continueButton.click();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await page.waitForNavigation();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await page.waitForSelector(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  const button = await page.$$(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  await button[0].click();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const serachButton = await page.$(
    ".search-global-typeahead__collapsed-search-button"
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await serachButton.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const serachInput = await page.$(".search-global-typeahead__input");
  await serachInput.type("noveracion global");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await new Promise((resolve) => setTimeout(resolve, 2000));
  //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
  // Open a new tab

  //new browser
  // const newTab = await browser.newPage();
  await page.goto("https://www.linkedin.com/mynetwork/");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // const button1 = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // await button1[0].click();

  // // Replace 'YOUR_CLASS_NAMES' with the actual class names

  // // Use page.$$eval() to count the elements with the specified class names
  // const buttonSelector = '.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn';

  // // Wait for the button to become visible and clickable
  // await page.waitForSelector(buttonSelector);

  // // Click the button
  // await page.click(buttonSelector);

  // await page.reload();

  const classSelector =
    ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn";

  // Use page.$$() to query for all elements with the specified class selector
  const elements = await page.$$(classSelector);
  var i = 0;
  if (elements.length > 0) {
    console.log(
      `Found ${elements.length} element(s) with the specified class selector.`
    );

    // Loop through the elements and perform actions if needed
    for (const element of elements) {
      // You can click the element here if needed
      await element.click();
      console.log("i = " + ++i);
    }
  } else {
    console.log("No element with the specified class selector found.");
  }

  await new Promise((resolve) => setTimeout(resolve, 90000));

  for (let i = 0; i < profileLinkIds.length; i++) {
    //page down
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
    //    await button_more_collapse[2].click();

    const username_profile_element = await newTab.$(".text-heading-xlarge");
    username_profile_page = await newTab.evaluate(
      (username_profile_element) => username_profile_element.textContent,
      username_profile_element
    );
    console.log(username_profile_page);

    const header_element = await newTab.$(".text-body-medium");
    const header_profile_page = await newTab.evaluate(
      (header_element) => header_element.textContent,
      header_element
    );
    // console.log(header_profile_page);

    console.log("hiii");

    // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
    // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
    // console.log(textContent);

    const elements = await newTab.$$(".pv-text-details__left-panel");

    const secondDiv = elements[1];
    const textElement = await secondDiv.$("span.text-body-small");
    const textContent = await newTab.evaluate(
      (element) => element.textContent.trim(),
      textElement
    );
    console.log(textContent);

    //     const location_element = await newTab.$('.text-body-small');
    //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
    //    console.log(location_profile_page);

    console.log("hiii1");

    const aboutus_user_element = await newTab.$(
      ".pv-shared-text-with-see-more"
    );
    const abotus_user_profile_page = await newTab.evaluate(
      (aboutus_user_element) => aboutus_user_element.textContent,
      aboutus_user_element
    );
    //console.log(abotus_user_profile_page);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("hiii2");

    //connect button click  WORKIN---div.artdeco-dropdown__item

    //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

    // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
    //   await button_more_connect_part[7].click();

    // Click the button

    // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');

    let followButton;
    let followButtonText;

    try {
      console.log("inside try");

      followButton = await newTab.$(
        ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action"
      );
      followButtonText = await newTab.evaluate(
        (followButton) => followButton.textContent,
        followButton
      );

      console.log(`"${followButtonText}"`);
    } catch {
      console.log("inside catch");

      const pendingButton = await newTab.$(
        ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.pvs-profile-actions__action .artdeco-button__text"
      );
      const pendingText = await newTab.evaluate(
        (pendingButton) => pendingButton.textContent.trim(),
        pendingButton
      );

      console.log("Pending Text:", pendingText);

      if (pendingText.includes("Pending")) {
        console.log(
          "NOO Follow button detected going to three dot menu  pending detected --------------------------------"
        );
        // await followButton.click();

        // add_a_note();
        continue;
      }

      // console.log(`"${pendingText}"`);
      console.log("hiii5");
    }

    // await new Promise(resolve => setTimeout(resolve, 90000));

    try {
      console.log("hiii6");

      if (followButtonText.includes("Follow")) {
        console.log("Follow if detected");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const button_more_collapse = await newTab.$$(
          "button.artdeco-dropdown__trigger"
        );
        await button_more_collapse[2].click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        //connect button click  WORKIN---div.artdeco-dropdown__item

        const button_more_connect_part = await newTab.$$(
          "div.artdeco-dropdown__item"
        );
        // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
        await button_more_connect_part[7].click();

        await new Promise((resolve) => setTimeout(resolve, 3000));

        add_a_note();
      } else if (followButtonText.includes("Connect")) {
        console.log("NOO Follow button detected going to three dot menu");
        await followButton.click();

        add_a_note();
      }
    } catch (err) {
      console.log(err);
    }

    //await followButton.click();

    async function add_a_note() {
      await newTab.waitForSelector(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
      );
      const buttonnew = await newTab.$(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
      );
      await buttonnew.click();

      await newTab.waitForSelector("#custom-message");
      const connect_note_send_message_ = await newTab.$("#custom-message");
      // await connect_note_send_message_.type('Hello, I would like to connect with you!');
      console.log("notessssssssssssss 583");
      console.log(notes[0]);
      // await connect_note_send_message_.type(notes[0]);
      await connect_note_send_message_.type(
        `hiii, ${username_profile_page}, i would like to connect with you.`
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await newTab.waitForSelector(".artdeco-modal__actionbar");
      const button_send_note_message = await newTab.$(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)"
      );
      await button_send_note_message.click();

      await new Promise((resolve) => setTimeout(resolve, 9000));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //  const profile_page_button = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
    // await newTab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
    // await profile_page_button.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Close the browser
    //await browser.close();
  }
}
// testingv1_ACCEPT();

//
//FIND SIMILAR ACC
async function testingv1_SIMILAR_ACC() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // const usersinfosp = await usersinfos.find({ request_send_trigger: 'today' });

  // const profileLinkIds = usersinfosp.map(doc => doc.profile_link_id);

  // const hrefArray = [];

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  // Fill in email input field
  const emailInput = await page.$("#username");
  await emailInput.type(`${process.env.USEREMAIL}`);

  const passInput = await page.$("#password");
  await passInput.type(`${process.env.PASSWORD}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Click on "Continue" button
  const continueButton = await page.$(
    ".btn__primary--large.from__button--floating"
  );
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await continueButton.click();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await page.waitForNavigation();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await page.waitForSelector(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  const button = await page.$$(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  await button[0].click();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const serachButton = await page.$(
    ".search-global-typeahead__collapsed-search-button"
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await serachButton.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const serachInput = await page.$(".search-global-typeahead__input");
  await serachInput.type("noveracion global");

  //   await searchInput.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await new Promise((resolve) => setTimeout(resolve, 2000));
  //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
  // Open a new tab

  //new browser
  // const newTab = await browser.newPage();

  const serachInput1 = await page.$(".search-global-typeahead__input");
  await serachInput1.type("vishwakarma institute of technology");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  let urls;

  for (var i = 2; i < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.goto(
      `https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A845670&keywords=vishwakarma%20institute%20of%20technology&origin=RICH_QUERY_SUGGESTION&page=${i}`
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Replace 'YOUR_CLASS_SELECTOR' with the class selector you want to check
    const classSelector = ".entity-result__title-text a.app-aware-link";

    // Use page.$$eval() to extract the URLs from all matching elements
    urls = await page.$$eval(classSelector, (elements) => {
      return elements.map((element) => element.getAttribute("href"));
    });

    // Log the extracted URLs or do any other operations with them
    console.log("Extracted URLs:", urls);

    // for (var i = 1; i <= 10; i++) {}
  }

  // await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // const button1 = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // await button1[0].click();

  // // Replace 'YOUR_CLASS_NAMES' with the actual class names

  // // Use page.$$eval() to count the elements with the specified class names
  // const buttonSelector = '.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn';

  // // Wait for the button to become visible and clickable
  // await page.waitForSelector(buttonSelector);

  // // Click the button
  // await page.click(buttonSelector);

  // await page.reload();

  const classSelector =
    ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn";

  // Use page.$$() to query for all elements with the specified class selector
  const elements = await page.$$(classSelector);
  var i = 0;
  if (elements.length > 0) {
    console.log(
      `Found ${elements.length} element(s) with the specified class selector.`
    );

    // Loop through the elements and perform actions if needed
    for (const element of elements) {
      // You can click the element here if needed
      await element.click();
      console.log("i = " + ++i);
    }
  } else {
    console.log("No element with the specified class selector found.");
  }

  await new Promise((resolve) => setTimeout(resolve, 90000));

  for (let i = 0; i < profileLinkIds.length; i++) {
    //page down
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
    //    await button_more_collapse[2].click();

    const username_profile_element = await newTab.$(".text-heading-xlarge");
    username_profile_page = await newTab.evaluate(
      (username_profile_element) => username_profile_element.textContent,
      username_profile_element
    );
    console.log(username_profile_page);

    const header_element = await newTab.$(".text-body-medium");
    const header_profile_page = await newTab.evaluate(
      (header_element) => header_element.textContent,
      header_element
    );
    // console.log(header_profile_page);

    console.log("hiii");

    // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
    // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
    // console.log(textContent);

    const elements = await newTab.$$(".pv-text-details__left-panel");

    const secondDiv = elements[1];
    const textElement = await secondDiv.$("span.text-body-small");
    const textContent = await newTab.evaluate(
      (element) => element.textContent.trim(),
      textElement
    );
    console.log(textContent);

    //     const location_element = await newTab.$('.text-body-small');
    //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
    //    console.log(location_profile_page);

    console.log("hiii1");

    const aboutus_user_element = await newTab.$(
      ".pv-shared-text-with-see-more"
    );
    const abotus_user_profile_page = await newTab.evaluate(
      (aboutus_user_element) => aboutus_user_element.textContent,
      aboutus_user_element
    );
    //console.log(abotus_user_profile_page);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("hiii2");

    //connect button click  WORKIN---div.artdeco-dropdown__item

    //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

    // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
    //   await button_more_connect_part[7].click();

    // Click the button

    // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');

    let followButton;
    let followButtonText;

    try {
      console.log("inside try");

      followButton = await newTab.$(
        ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action"
      );
      followButtonText = await newTab.evaluate(
        (followButton) => followButton.textContent,
        followButton
      );

      console.log(`"${followButtonText}"`);
    } catch {
      console.log("inside catch");

      const pendingButton = await newTab.$(
        ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.pvs-profile-actions__action .artdeco-button__text"
      );
      const pendingText = await newTab.evaluate(
        (pendingButton) => pendingButton.textContent.trim(),
        pendingButton
      );

      console.log("Pending Text:", pendingText);

      if (pendingText.includes("Pending")) {
        console.log(
          "NOO Follow button detected going to three dot menu  pending detected --------------------------------"
        );
        // await followButton.click();

        // add_a_note();
        continue;
      }

      // console.log(`"${pendingText}"`);
      console.log("hiii5");
    }

    // await new Promise(resolve => setTimeout(resolve, 90000));

    try {
      console.log("hiii6");

      if (followButtonText.includes("Follow")) {
        console.log("Follow if detected");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const button_more_collapse = await newTab.$$(
          "button.artdeco-dropdown__trigger"
        );
        await button_more_collapse[2].click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        //connect button click  WORKIN---div.artdeco-dropdown__item

        const button_more_connect_part = await newTab.$$(
          "div.artdeco-dropdown__item"
        );
        // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
        await button_more_connect_part[7].click();

        await new Promise((resolve) => setTimeout(resolve, 3000));

        add_a_note();
      } else if (followButtonText.includes("Connect")) {
        console.log("NOO Follow button detected going to three dot menu");
        await followButton.click();

        add_a_note();
      }
    } catch (err) {
      console.log(err);
    }

    //await followButton.click();

    async function add_a_note() {
      await newTab.waitForSelector(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
      );
      const buttonnew = await newTab.$(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)"
      );
      await buttonnew.click();

      await newTab.waitForSelector("#custom-message");
      const connect_note_send_message_ = await newTab.$("#custom-message");
      // await connect_note_send_message_.type('Hello, I would like to connect with you!');
      console.log("notessssssssssssss 583");
      console.log(notes[0]);
      // await connect_note_send_message_.type(notes[0]);
      await connect_note_send_message_.type(
        `hiii, ${username_profile_page}, i would like to connect with you.`
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await newTab.waitForSelector(".artdeco-modal__actionbar");
      const button_send_note_message = await newTab.$(
        "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)"
      );
      await button_send_note_message.click();

      await new Promise((resolve) => setTimeout(resolve, 9000));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //  const profile_page_button = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
    // await newTab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
    // await profile_page_button.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Close the browser
    //await browser.close();
  }
}
// testingv1_SIMILAR_ACC();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => console.log("listening on port 3000"));
