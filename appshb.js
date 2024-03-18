const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const prettier = require("prettier");
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
const { generateKey } = require("crypto");
require("dotenv").config();

const app = express();

const password = process.env.PASSWORD;
// console.log(password);

mongoose.set("strictQuery", false);

// async function main() {
// mongoose.connect(
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.as6xaod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     // Connection successful, perform further operations
//     console.log("Connected to MongoDB");

//     // ... Your code here ...
//   })
//   .catch((error) => {
//     // Connection failed, handle the error
//     console.log("Failed to connect to MongoDB");
//     console.error(error);
//   });

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuna9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

let profileLinks10;

async function run() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to next day midnight

  const date = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-IN", options).toUpperCase();
  console.log(formattedDate); // Output: 14-MAY-2023

  const usersinfos1 = await usersinfos.find({ timestamp: formattedDate });

  // const profileLinks11 = usersinfos1.map(doc => doc.linkedin_id);

  profileLinks10 = usersinfos1.map((obj) => obj.linkedin_id);
  console.log(profileLinks10);

  //console.log(usersinfos1);
  //console.log(Array.isArray(usersinfos1));
}

// run().then(() => {
//     console.log("Done");
// }).catch(err => {
//     console.error(err);
// });

// let count = 0;
// async function fetchData() {

//     try {

//         count++;
//         var flag;

//         const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox', '--no-sandbox'] });
//         // const browser = await puppeteer.launch({ headless: false, args: ['--disable-setuid-sandbox', '--no-sandbox'] });
//         const page = await browser.newPage();
//         await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
//         // await page.goto('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY');
//         await page.goto('https://www.nseindia.com/api/option-chain-equities?symbol=ABB');
//         console.log('Page loaded successfully!');
//         console.log('scroll over');
//         await new Promise(resolve => setTimeout(resolve, 5000));
//         console.log('Timeout over');

//         const isNotFound = await page.evaluate(() => {
//             const div = document.querySelector('div');
//             return div && div.innerHTML.includes("Resource not found");
//         });

//         console.log(`Function ran ${count} times.`);

//         if (isNotFound) {

//             console.log("Resource not found");
//             flag = 1;
//             setTimeout(fetchData, 5000);
//             await browser.close();
//             return;

//             // set your var value to true here
//         }

//         else {
//             console.log("Resource found");
//             // set your var value to false here
//             flag = 0;
//             console.log(`Function ran ${count} times.`);

//         }

//         await page.waitForSelector('pre');

//         // Extract the text content of the pre tag
//         const preContent = await page.evaluate(() => {
//             const preTag = document.querySelector('pre');
//             return preTag.textContent;
//         });

//         const jsonData = JSON.parse(preContent);
//         const dataArr = jsonData.filtered.data;
//         // console.log(dataArr);

//         const timestamp_json = jsonData.filtered.data;

//         const formattedData = prettier.format(JSON.stringify(dataArr), { parser: 'json' });
//         // write the filtered data to output.json file
//         fs.writeFileSync('./pages/output.json', formattedData);

//         await page.screenshot({ path: './pages/example.png' });
//         console.log('Screenshot saved successfully!');
//         await browser.close();

//         const currentDate = new Date();
//         let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
//         console.log('timestamp' + time);

//         const dataa = dataArr;

//         const timestampp = jsonData.records.timestamp;

//         const company_name = jsonData.filtered.data[0].CE.underlying;

//         const options = {
//             timeZone: 'Asia/Kolkata',
//             year: 'numeric',
//             month: 'short',
//             day: '2-digit',
//             hour12: false,
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//         };

//         const date = new Date();
//         const formattedDate = date.toLocaleString('en-IN', options);

//         let formattedDate1 = formattedDate.slice(0, 11) + ' ' + formattedDate.slice(13, 21);

//         // MAIN BLCOK
//         const data22 = jsonData.filtered.data;

//         // VARS FOR cummulative_openinterest1 SUM
//         const strikePrices_all_array = [];
//         const changeinopen1_all_array = [];
//         const changeinopen1_all_array_PE = [];

//         // Loop through the data array and push the strikePrice value of each object into the strikePrices array
//         for (let i = 0; i < data22.length; i++) {
//             strikePrices_all_array.push(data22[i].strikePrice);
//         }

//         // SUM OF ALL CE OPEN INTEREST

//         for (let i = 0; i < data22.length; i++) {
//             changeinopen1_all_array.push(data22[i].CE.changeinOpenInterest);
//             // const ceData = data22[i].CE;
//             // const middleIndex = Math.floor(ceData.length / 2);
//             // const startIndex = middleIndex - 6;
//             // const endIndex = middleIndex + 6;
//             // const selectedData = changeinOpenInterestArr.slice(startIndex, endIndex + 1);
//             // const sum = selectedData.reduce((acc, val) => acc + val, 0);
//             // changeinopen1_all_array.push(sum);
//         }
//         const middleIndex = Math.floor(changeinopen1_all_array.length / 2);

//         const startIndex = Math.max(0, middleIndex - 6);
//         const endIndex = Math.min(changeinopen1_all_array.length - 1, middleIndex + 6);
//         const ceChangeInOpenInterestSubset = changeinopen1_all_array.slice(startIndex, endIndex + 1);

//         const sum_CE_OPENINTEREST = ceChangeInOpenInterestSubset.reduce((accumulator, currentValue) => accumulator + currentValue);

//         // SUM OF ALL PE OPEN INTEREST

//         for (let i = 0; i < data22.length; i++) {
//             changeinopen1_all_array_PE.push(data22[i].PE.changeinOpenInterest);
//             // const ceData = data22[i].CE;
//             // const middleIndex = Math.floor(ceData.length / 2);
//             // const startIndex = middleIndex - 6;
//             // const endIndex = middleIndex + 6;
//             // const selectedData = changeinOpenInterestArr.slice(startIndex, endIndex + 1);
//             // const sum = selectedData.reduce((acc, val) => acc + val, 0);
//             // changeinopen1_all_array.push(sum);
//         }
//         const middleIndex1 = Math.floor(changeinopen1_all_array_PE.length / 2);

//         // Get the top 6, middle, and next 6 elements
//         const startIndex1 = Math.max(0, middleIndex1 - 6);
//         const endIndex1 = Math.min(changeinopen1_all_array_PE.length - 1, middleIndex1 + 6);
//         const ceChangeInOpenInterestSubset_PE = changeinopen1_all_array_PE.slice(startIndex1, endIndex1 + 1);

//         // Calculate the sum of the subset
//         const sum_PE_OPENINTEREST = ceChangeInOpenInterestSubset_PE.reduce((accumulator, currentValue) => accumulator + currentValue);

//         console.log("Subset:", ceChangeInOpenInterestSubset_PE);
//         console.log("Sum of CE:", sum_PE_OPENINTEREST);

//         const cummulative_openinterest1 = sum_CE_OPENINTEREST - sum_PE_OPENINTEREST;

//         console.log('cummulative open interest for time=' + ' ' + cummulative_openinterest1 + ' ')

//         const existingNote = await open_in.findOne({ timestamp: timestampp });

//         if (existingNote) {
//             console.log('Note already exists');
//         }

//         else {
//             let newNote = new open_in({
//                 timestamp: timestampp,
//                 current_time: formattedDate1,
//                 cummulative_openinterest: cummulative_openinterest1,
//                 company_name: company_name,
//                 dataa,
//             }); //schema complete

//             newNote.save(function (error) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('data saved successfully!');
//                     console.log('fetching again in 20 secs');
//                 }

//             }); // note save completed

//         } //else complete

//     } catch (err) {
//         console.error(err);
//     }

// }

// fetchData();

async function loginToLunchclub() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://lunchclub.com/login");

  // Fill in email input field
  const emailInput = await page.$(".TextInput__StyledInput-sc-1innz0i-0");
  await emailInput.type("prayagbhosale228008@gmail.com");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Click on "Continue" button
  const continueButton = await page.$("Button__StyledButton-sc-13h5o1r-0");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await continueButton.click();

  await page.waitForNavigation();

  // Close the browser
  await browser.close();
}

//loginToLunchclub();

var profileLinks = ["https://www.linkedin.com/in/abhishek-ithape-7b39621b6/"];

async function linkined() {
  // const usersinfosp = await usersinfos.find({ request_send_trigger: "today" });

  // const profileLinkIds = usersinfosp.map((doc) => doc.profile_link_id);
  // const notes = usersinfosp.map((doc) => doc.notes);
  let notes = "would like to connect";

  console.log(profileLinks);
  console.log(notes);

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

  // for (let i = 0; i < profileLinkIds.length; i++) {
  for (let i = 0; i < profileLinks.length; i++) {
    // Navigate to the link
    // await newTab.goto('https://www.linkedin.com/company/noveracion-global/');

    //  await newTab.goto('https://www.linkedin.com/in/divyanshu-sahu-820467245/');

    // await newTab.goto(profileLinkIds[i]);
    await newTab.goto(profileLinks[i]);

    // await newTab.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.7 });

    //page down
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
    //    await button_more_collapse[2].click();

    const username_profile_element = await newTab.$(".text-heading-xlarge");
    const username_profile_page = await newTab.evaluate(
      (username_profile_element) => username_profile_element.textContent,
      username_profile_element
    );
    console.log(username_profile_page);

    const header_element = await newTab.$(".text-body-medium");
    const header_profile_page = await newTab.evaluate(
      (header_element) => header_element.textContent,
      header_element
    );
    console.log(header_profile_page);

    console.log("hiii");

    // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
    // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
    // console.log(textContent);

    // const elements = await newTab.$$(".pv-text-details__left-panel");

    // const secondDiv = elements[1];
    // const textElement = await secondDiv.$("span.text-body-small");
    // const textContent = await newTab.evaluate(
    //   (element) => element.textContent.trim(),
    //   textElement
    // );
    // console.log(textContent);

    //     const location_element = await newTab.$('.text-body-small');
    //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
    //    console.log(location_profile_page);

    const aboutus_user_element = await newTab.$(
      ".pv-shared-text-with-see-more"
    );
    const abotus_user_profile_page = await newTab.evaluate(
      (aboutus_user_element) => aboutus_user_element.textContent,
      aboutus_user_element
    );
    console.log(abotus_user_profile_page);

    // const control_popup = await newTab.$(
    //   ".artdeco-toast-item__dismiss artdeco-button"
    // );
    // const control_user_profile_page = await newTab.evaluate(
    //   (control_popup) => control_popup.textContent,
    //   control_popup
    // );
    // Control what appears on your profile and if your network is notified of changes you make.View settings



    generateNote(profileLinks[i], notes);



    await new Promise((resolve) => setTimeout(resolve, 1000));

    //connect button click  WORKIN---div.artdeco-dropdown__item

    //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

    // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
    //   await button_more_connect_part[7].click();

    // Click the button

    // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');

    const followButton = await newTab.$(
      ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action"
    );
    const followButtonText = await newTab.evaluate(
      (followButton) => followButton.textContent,
      followButton
    );

    console.log(`"${followButtonText}"`);

    try {
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
      // await connect_note_send_message_.type(notes[i]);
      await connect_note_send_message_.type(notes);

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

    // await newTab.waitForSelector(
    //     '[class="artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view mr1"]'
    // );

    // const button111 = await newTab.$$('[class="artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view mr1"]')
    // await button111[0].click();

    // const button_add_a_note_popup = await newTab.$$('button.artdeco-button');
    // await button_add_a_note_popup[4].click();

    // commented
    // await newTab.waitForSelector('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
    // const buttonnew = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
    // await buttonnew.click();

    // await newTab.waitForSelector('#custom-message');
    // const connect_note_send_message_ = await newTab.$('#custom-message');
    // await connect_note_send_message_.type('Hello, I would like to connect with you!');

    // await new Promise(resolve => setTimeout(resolve, 3000));

    // await newTab.waitForSelector('.artdeco-modal__actionbar');
    // const button_send_note_message = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)');
    // await button_send_note_message.click();

    // await new Promise(resolve => setTimeout(resolve, 9000));

    // Close the browser
    //await browser.close();
  }
}

// linkined();

// let linkedin_link1 = 'https://www.linkedin.com/in/abhishek-ithape-7b39621b6/';
// let notess = "f";
async function generateNote() {
  // https://deepai.org/chat/text-generator


};

// generateNote();

app.listen(3000, () => console.log("listening on port 3000"));
