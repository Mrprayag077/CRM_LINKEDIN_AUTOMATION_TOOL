const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const prettier = require("prettier");
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
require("dotenv").config();
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

mongoose.set("strictQuery", false);
// async function main() {
const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuna9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usersinfosSchema = {
  profile_link_id: String,
  request_send_trigger: String,
  notes: String,
  username: String,
  email: String,
  password: String,

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

// const userSchema = {
//   username: String,
//   email: String,
//   password: String,
// };

// const userModel = mongoose.model("Users", userSchema);

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

//loginToLunchclub();

var profileLinks = ["https://www.linkedin.com/in/gourav-grover-02a82a200/"];

async function linkined() {
  const usersinfosp = await usersinfos.find({ request_send_trigger: "today" });
  const profileLinkIds = usersinfosp.map((doc) => doc.profile_link_id);
  const notes = usersinfosp.map((doc) => doc.notes);

  console.log(profileLinkIds);
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

  for (let i = 0; i < profileLinkIds.length; i++) {
    // Navigate to the link
    // await newTab.goto('https://www.linkedin.com/company/noveracion-global/');

    //  await newTab.goto('https://www.linkedin.com/in/divyanshu-sahu-820467245/');

    await newTab.goto(profileLinkIds[i]);

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
    // console.log(username_profile_page);

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

    const aboutus_user_element = await newTab.$(
      ".pv-shared-text-with-see-more"
    );
    const abotus_user_profile_page = await newTab.evaluate(
      (aboutus_user_element) => aboutus_user_element.textContent,
      aboutus_user_element
    );
    //console.log(abotus_user_profile_page);

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
      await connect_note_send_message_.type(notes[i]);

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

async function testingv1() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  //------------------------------------ SECTION:START #SIGIN SECTIOM#: -------------------------------
  const emailInput = await page.$("#username");
  await emailInput.type(`${process.env.USEREMAIL}`);

  const passInput = await page.$("#password");
  await passInput.type(`${process.env.PASSWORD}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const continueButton = await page.$(
    ".btn__primary--large.from__button--floating"
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await continueButton.click();

  await page.waitForNavigation();

  await page.waitForSelector(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  const button = await page.$$(
    ".msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)"
  );
  await button[0].click();
  //------------------------------------ SECTION: END #SIGIN IN SECTIO#: -------------------------------

  //------------------------------------ SECTION: #TARGET SERACH INPUT BOX#: -------------------------------
  const serachButton = await page.$(
    ".search-global-typeahead__collapsed-search-button"
  );
  await serachButton.click();

  //------------------------------------ SECTION: #SERACH INPUT BOX#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const serachInput = await page.$(".search-global-typeahead__input");
  await serachInput.type("noveracion global");

  async function extractHrefs(page) {
    const hrefsArray = [];

    for (let i = 1; i <= 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Processing page", i);
      const url = `https://www.linkedin.com/search/results/people/?origin=FACETED_SEARCH&page=${i}&sid=gvP`;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await page.goto(url);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const divs = await page.$$(
        ".entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light"
      );

      for (const div of divs) {
        const hrefElement = await div.$("a.app-aware-link");
        if (hrefElement) {
          const href = await page.evaluate(
            (element) => element.getAttribute("href"),
            hrefElement
          );
          hrefsArray.push(href);
        }
      }
      console.log(hrefsArray);
      console.log(hrefsArray.length);
      console.log("count=" + i);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return hrefsArray;
  }

  const hrefs = await extractHrefs(page);
  console.log(hrefs);
  console.log(hrefs.length);

  var profileLinks1pp = [
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/saurabhkrishangulab?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABryj2MBwzpxC_01ZyWqCYI_F0l4wB6sV2M",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/rajaprasad25?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADTMbyUBMqnnJYyDtcWkotJ15T2-znyLA1k",
    "https://www.linkedin.com/in/mrityunjay-yadav-%F0%9F%95%89%EF%B8%8F%F0%9F%9A%A9-477aa224a?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD290hsBoMPbwNy3rpROwjv9T_f3Vuy3KeY",
    "https://www.linkedin.com/in/avdhoot-fulsundar?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADsZLzkBX7lhiKBXX0fr-WIlHBJT7e5P-lc",
    "https://www.linkedin.com/in/shubham-lal?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD7HDrEBqZI14chamRhZWfvL8XY9kejMy6M",
    "https://www.linkedin.com/in/mrugeshm?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAATfWwcBpLK2kV73H9Q6qYtxvvVWj1X_0_U",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/vishal-kushwaha-b30442214?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADYrh9QBBPX0NhBxQm98aWRGIUYK_O51o0A",
    "https://www.linkedin.com/in/harsh-kumar-bb542422b?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADmMo7kBMtjJAvij7H_vNhYu_D8O9lD-UD8",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/sohamderoy?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABgVxzUBHVeqMUvIZRW5nxELmlXT8UqzEMs",
    "https://www.linkedin.com/in/swatejpatil?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADOdKs0BANSOwTAvrfjI9z9DItJKSDDCpU4",
    "https://www.linkedin.com/in/gibrankhantareen?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC_FXOQBycUG7j5wuvgNmKJo2U64VshZ6iQ",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/farazullakhan?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD4ox-IByDBEjAwJhrv1VAj8idIvVwIjmng",
    "https://www.linkedin.com/in/jasmeetsohal?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABYpMv4B1t2Y5IoW4rxiXlsKtK2qDWGrTek",
    "https://www.linkedin.com/in/bala-priya?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADXSc5ABaUfNyqq36vr-5AInTgOY6EUwYwU",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/triposat?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADF4VHoBMu5JuwDCd_DKwUooy0sD5ESEqg0",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/saksham-paliwal?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADPCrbsBKXM7CUcM19fugfJhsed5JCEdfQg",
    "https://www.linkedin.com/in/abhismansarkar?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADEQbq0BI69HkGvraY6RK2YIbzxwvu5aUrE",
    "https://www.linkedin.com/in/kedarmakode?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADD-GfMBkp2srLoyUaM1_HCVfMVdt-6zjiM",
    "https://www.linkedin.com/in/7jkaushal?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADBM3MEBZjYCErqZaRJioIc-Tfi1IHHM1BY",
    "https://www.linkedin.com/in/ramkrishna-patidar-9342061b4?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADHdRbgBi0MVjXv68iPMztoyC3A4ByfftXc",
    "https://www.linkedin.com/in/prashant-shukla-1271a1250?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD32vW8BpAu3b5QTGKffDWZT6M0o01tlezE",
    "https://www.linkedin.com/in/punita-ojha-74550a53?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAtJs6UBnA3v-xBo520rUVjBT076Pms0Yhk",
    "https://www.linkedin.com/in/swapnil-thatte-80b90621b?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADd8SQsBzhZAlFeD3lTWDCzsdhLNi1fJ_Bs",
    "https://www.linkedin.com/in/mr-bhushan-patil?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAACKO8w0BB1SWoy8EfsCWb5mCy9Dp1B83CMU",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/tanishka-makode-62459826a?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAEHwLnwB1_0b-KQY2c3B2bJjlc_NBg8Fbes",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/sk7000?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABdHyBoBtSHUJTOYxUkU9_GyqDfQjO1Hj2w",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/surya-prakash-76233b22a?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADlbxXoBYCrtvCfXR2hhcyFqk275bNAeFK8",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/sharvinshah?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAB3jOIkBHrj5HeuPaua-1Qkj7B1IW8kgmjk",
    "https://www.linkedin.com/in/manish-verma-from-khagaria-55507722b?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADl_GVEBexT9z6BmdyA2sp_tChUYlGJ8xTs",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/vishal-kumar-b605111b5?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADIWajgB3IolABHQtn40GUetv2Ziy6lbuK4",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/harshi-rabta-04a740220?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADejWDoBV6xbI63wy02pGxPFg42GCjMEw88",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/gourav-mehar-7b629a25b?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD_vqPoB8sAFQ-eR_grjM6wCUIGesC4rjgs",
    "https://www.linkedin.com/in/psmohammedali?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAACX1vJUBVw1q8c8qphv-HTRKeQtatI6_fbk",
    "https://www.linkedin.com/in/tapasadhikary?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAK-Q0MBABkA3ABiTPhGqzjlqEVCxxnteLY",
    "https://www.linkedin.com/in/rajan-raj-cse-itggu?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADNnVhQBaTKIkWHUxA6xbm7OA259Xdysl5U",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/sobit-prasad?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC5rJSsBXpt1NVOqpIyKkF22Q1uy88CjJS4",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/gokulhansv?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADjEUz0BT7vZc28ElK0K2lNuB3KjZku6grI",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/surajondev?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAACRgF6YBZ1SHPdfHOC3-TNX-XaNX-CaHab4",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/duttakapil?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAmk3owBiGes8wjAjr5z5cuwdrqKgpvgfL4",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/yuvrajchandra?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAB8JGeQBDAGJ5NHpdEe46XLR6x5Nictt7xU",
    "https://www.linkedin.com/in/reet-kaur-81a68024b?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAD3bhJYBonx7Oc96LLi0tZlrp5EMvLW242A",
    "https://www.linkedin.com/in/anaantraj?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADaqLTABuHIm4ZLnuIs66O5jkvT9OPP7nrc",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/shadma-ansari-465202214?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADYiqA0BOv9lXKHhDxO5Vg3pzs4Zkybcr1M",
    "https://www.linkedin.com/in/hashim-yousuf-6b8196215?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADZPYWwB_KNalTbSpR3RhQWPYszueO8hml4",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/yash2411?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC23tSQBWGjxD3EjP7ewH_jOPli8cs8Uw3U",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/sayan-roy-808bb9266?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAEFRYEgBHFLu3A3JMON3gCJmyVTmBhC0QP0",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
  ];

  ////////////////////////////////
  var profileLinks1ll = [
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/saurabhkrishangulab?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABryj2MBwzpxC_01ZyWqCYI_F0l4wB6sV2M",
    "https://www.linkedin.com/in/yash2411?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC23tSQBWGjxD3EjP7ewH_jOPli8cs8Uw3U",
    "https://www.linkedin.com/search/results/people/headless?currentCompany=%5B4831032%5D&origin=COMPANY_PAGE_CANNED_SEARCH",
    "https://www.linkedin.com/in/hashim-yousuf-6b8196215?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADZPYWwB_KNalTbSpR3RhQWPYszueO8hml4",
  ];

  //filtier the /s/r and keep only id's
  const filteredHrefs = hrefs.filter(
    (href) => !href.includes("/search/results/")
  );
  // console.log(filteredHrefs);

  // remove the ? part and keep only proper id
  var modifiedProfileLinks = filteredHrefs.map((link) => link.split("?")[0]);

  // now add '/' at end of each index
  var hrefArrayll = modifiedProfileLinks.map((link) => link + "/");

  console.log(hrefArrayll);

  // const browser = await puppeteer.launch({ headless: false });
  // const page = await browser.newPage();
  // await page.goto('https://www.linkedin.com/login');

  // //------------------------------------ SECTION:START #SIGIN SECTIOM#: -------------------------------
  // const emailInput = await page.$('#username');
  // await emailInput.type(`${process.env.USEREMAIL}`);

  // const passInput = await page.$('#password');
  // await passInput.type(`${process.env.PASSWORD}`);

  // await new Promise(resolve => setTimeout(resolve, 1000));

  // const continueButton = await page.$('.btn__primary--large.from__button--floating');
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // await continueButton.click();

  // await page.waitForNavigation();

  // await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // const button = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
  // await button[0].click();
  // //------------------------------------ SECTION: END #SIGIN IN SECTIO#: -------------------------------

  // //------------------------------------ SECTION: #TARGET SERACH INPUT BOX#: -------------------------------
  // const serachButton = await page.$('.search-global-typeahead__collapsed-search-button');
  // await serachButton.click();

  // //------------------------------------ SECTION: #SERACH INPUT BOX#: -------------------------------
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // const serachInput = await page.$('.search-global-typeahead__input');
  // await serachInput.type('noveracion global');

  // const net = await browser.newPage();
  // await net.goto('https://www.linkedin.com/mynetwork/');

  // await new Promise(resolve => setTimeout(resolve, 5000));

  // const buttons = await net.$$('.artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.ember-view');
  // await buttons[3].click();

  // await new Promise(resolve => setTimeout(resolve, 8000));

  // const hrefArray = await net.$$eval('a.app-aware-link.discover-entity-type-card__link.discover-entity-type-card__link--dash', elements => {
  //     return elements.map(element => element.href);
  // });

  // console.log(hrefArray);
  // console.log(hrefArray.length);
  // await new Promise(resolve => setTimeout(resolve, 2000));

  // await net.close();

  //------------------------------------ SECTION: PROFILE #NEW BROWSER#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newTab = await browser.newPage();

  const profileLinks1 = [];

  for (const profile_link_id of hrefArrayll) {
    const existing_userid = await usersinfos.findOne({ profile_link_id });
    if (!existing_userid) {
      profileLinks1.push(profile_link_id);
    }
  }

  console.log("============================================");
  console.log(profileLinks1);
  console.log(profileLinks1.length);
  console.log("============================================");

  //------------------------------------ SECTION: PROFILE #FOR LOOP FOR MULTIPLE ID'S#: -------------------------------

  for (let i = 0; i < profileLinks1.length; i++) {
    await newTab.goto(profileLinks1[i]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("kkkkk");
    const followers_number = await newTab.evaluate(() => {
      const firstLiElement = document.querySelector(
        "ul.pv-top-card--list li.text-body-small.t-black--light.inline-block span.t-bold"
      );
      return firstLiElement ? firstLiElement.innerText.trim() : "";
    });

    const connections_number = await newTab.evaluate(() => {
      const secondLiElement = document.querySelector(
        "ul.pv-top-card--list li.text-body-small span.t-black--light span.t-bold"
      );
      return secondLiElement ? secondLiElement.innerText.trim() : "";
    });

    console.log(followers_number);
    console.log(connections_number);
    console.log("kkkkk");

    //------------------------------------ SECTION: PROFILE #PROFILE USERNAME#: -------------------------------

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

    let header_profile_page0 = header_profile_page.trim();
    console.log(header_profile_page0);

    //------------------------------------ SECTION: PROFILE #LOCATION#: -------------------------------

    const elements = await newTab.$$(".pv-text-details__left-panel");

    const secondDiv = elements[1];
    const textElement = await secondDiv.$("span.text-body-small");
    const textContent = await newTab.evaluate(
      (element) => element.textContent.trim(),
      textElement
    );
    console.log("tetxtusknnl");
    console.log(textContent);

    // const location_element = await newTab.$('.text-body-small');
    // const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
    // console.log(location_profile_page);

    //------------------------------------ SECTION: PROFILE #ABOUT US#: -------------------------------

    const aboutus_user_element = await newTab.$(
      ".pv-shared-text-with-see-more"
    );
    const abotus_user_profile_page = await newTab.evaluate(
      (aboutus_user_element) => aboutus_user_element.textContent,
      aboutus_user_element
    );

    // let abotus_user_profile_page0 = abotus_user_profile_page.replace(/\s/g, "");

    let abotus_user_profile_page0 = abotus_user_profile_page.trim();
    console.log(abotus_user_profile_page0);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const skills_url000 = profileLinks1[i] + "details/highlights/";
    console.log(skills_url000);

    const page000 = await browser.newPage();
    await page000.goto(skills_url000);

    const extractedData = await page000.evaluate(() => {
      const selector00 = "div.display-flex.flex-row.justify-space-between";

      return Array.from(document.querySelectorAll(selector00)).map((item) => {
        const visuallyHiddenElement = item.querySelector(
          "span.visually-hidden"
        );
        const text = visuallyHiddenElement
          ? visuallyHiddenElement.innerText.trim()
          : "";
        return text;
      });
    });

    console.log(extractedData);

    await page000.close();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("i am outtttttt");

    var skills_url00 = profileLinks1[i] + "details/interests";
    console.log(skills_url00);

    const page00 = await browser.newPage();
    await page00.goto(skills_url00);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const textArray = await page00.evaluate(() => {
      const selector =
        "div.display-flex.flex-wrap.align-items-center.full-height";

      const elements = Array.from(document.querySelectorAll(selector));
      const extractedText = elements.map((element) => {
        const visuallyHiddenSpan = element.querySelector(
          "span.visually-hidden"
        );
        return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
      });

      return extractedText;
    });

    console.log(textArray);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("I am done.");

    await page00.close();

    // await newTab_education.close();

    //------------------------------------ SECTION START: SKILLS SECTION: -------------------------------

    // if (url.endsWith('/')) {
    //     url = url.replace(/\/$/, '');
    //   }

    var skills_url = profileLinks1[i] + "details/skills";
    console.log(skills_url);

    const newTab_skills = await browser.newPage();
    await newTab_skills.goto(skills_url);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selector1 = "span.mr1.hoverable-link-text.t-bold";

    const textArray_skills = await newTab_skills.evaluate((selector1) => {
      const spanElements = Array.from(document.querySelectorAll(selector1));
      const textValues = spanElements.map((span) => {
        const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
        return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
      });
      return textValues;
    }, selector1);

    console.log(textArray_skills);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("i am outt");

    await newTab_skills.close();

    //------------------------------------ SECTION END: SKILLS SECTION: -------------------------------

    //------------------------------------ SECTION START: CERTIFICATION SECTION: -------------------------------

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTab_certifications = await browser.newPage();

    var certificate_url = profileLinks1[i] + "details/certifications/";
    console.log(certificate_url);

    await newTab_certifications.goto(certificate_url);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selector_certifications = "span.mr1.hoverable-link-text.t-bold";

    const textArray_certifications = await newTab_certifications.evaluate(
      (selector2) => {
        const spanElements = Array.from(document.querySelectorAll(selector2));
        const textValues = spanElements.map((span) => {
          const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
          return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        });
        return textValues;
      },
      selector_certifications
    );

    console.log(textArray_certifications);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("i am outt");

    await newTab_certifications.close();

    //------------------------------------ SECTION END: CERTIFICATION SECTION: -------------------------------

    //------------------------------------ SECTION START: EXPERIENCE SECTION: -------------------------------

    const newTab_exp = await browser.newPage();

    var exp_url = profileLinks1[i] + "details/experience/";
    console.log(exp_url);

    await newTab_exp.goto(exp_url);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("i am inside");

    const textArray_exp = await newTab_exp.evaluate(() => {
      const selector = "div.display-flex.flex-column.full-width";

      const expItems = Array.from(document.querySelectorAll(selector));
      const extractedData = expItems.map((item) => {
        const titleElement = item.querySelector(
          "span.mr1.t-bold span.visually-hidden"
        );
        const title = titleElement ? titleElement.innerText.trim() : "";

        const subtitleElement = item.querySelector(
          "span.t-14.t-normal:not(.t-black--light) span.visually-hidden"
        );
        const subtitle = subtitleElement
          ? subtitleElement.innerText.trim()
          : "";

        const durationElement = item.querySelector(
          "span.t-14.t-normal.t-black--light span.visually-hidden"
        );
        const duration = durationElement
          ? durationElement.innerText.trim()
          : "";

        const result = [
          title,
          subtitle ? subtitle : "",
          duration ? duration : "",
        ]
          .filter(Boolean)
          .join(", ");

        return result;
      });

      return extractedData;
    });

    const exp_data = textArray_exp.filter((_, index) => index % 2 === 0);
    console.log(textArray_exp);
    console.log(exp_data);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("i am outt");

    await newTab_exp.close();

    //------------------------------------ SECTION END:EXPERIENCE: -------------------------------

    //------------------------------------ SECTION START: EDUCATION SECTION: -------------------------------

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // const newTab_education = await browser.newPage();
    // await newTab_education.goto('https://www.linkedin.com/in/nikunj-mistry-b03993223/details/education/');

    // await new Promise(resolve => setTimeout(resolve, 5000));

    // const selector_education = 'span.mr1.hoverable-link-text.t-bold';

    // const textArray_education = await newTab_education.evaluate((selector4) => {
    //     const spanElements = Array.from(document.querySelectorAll(selector4));
    //     const textValues = spanElements.map((span) => {
    //         const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
    //         return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
    //     });
    //     return textValues;
    // }, selector_education);

    // console.log(textArray_education);

    // await new Promise(resolve => setTimeout(resolve, 1000));
    // console.log('i am outt');

    // await newTab_education.close();

    const newTab_education = await browser.newPage();

    var edu_url = profileLinks1[i] + "details/education/";
    console.log(edu_url);

    await newTab_education.goto(edu_url);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const textArray_education = await newTab_education.evaluate(() => {
      const selector = "div.display-flex.flex-row.justify-space-between";

      const educationItems = Array.from(document.querySelectorAll(selector));
      const extractedData = educationItems.map((item) => {
        const universityElement = item.querySelector(
          "span.mr1.hoverable-link-text.t-bold span.visually-hidden"
        );
        const university = universityElement
          ? universityElement.innerText.trim()
          : "";

        const degreeElement = item.querySelector(
          "span.t-14.t-normal span.visually-hidden"
        );
        const degree = degreeElement ? degreeElement.innerText.trim() : "";

        const durationElement = item.querySelector(
          "span.t-14.t-normal.t-black--light span.visually-hidden"
        );
        const duration = durationElement
          ? durationElement.innerText.trim()
          : "";

        return `${university}${degree ? ", " + degree : ""}${
          duration ? ", " + duration : ""
        }`;
      });

      return extractedData;
    });

    console.log(textArray_education);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("I am done.");

    await newTab_education.close();

    //------------------------------------ SECTION END: EDUCATION SECTION: -------------------------------

    //------------------------------------ SECTION SART: ABOUT THE PROFILE: -------------------------------

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const button_more_collapse = await newTab.$$(
      "button.artdeco-dropdown__trigger"
    );
    await button_more_collapse[2].click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const button_more_connect_part = await newTab.$$(
      "div.artdeco-dropdown__item"
    );
    await button_more_connect_part[9].click();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selector_about_this_profile_joined =
      "div.artdeco-modal__content.ember-view";
    await newTab.waitForSelector(selector_about_this_profile_joined);
    const divElement_modalContent = await newTab.$(
      selector_about_this_profile_joined
    );

    const selector_visuallyHidden = "span.visually-hidden";
    await divElement_modalContent.waitForSelector(selector_visuallyHidden);
    const spanElements_visuallyHidden = await divElement_modalContent.$$(
      selector_visuallyHidden
    );

    let trimmedVar1 = null;
    let trimmedVar2 = null;
    let trimmedVar3 = null;

    try {
      const firstSpanElement_visuallyHidden0 = spanElements_visuallyHidden[0];
      const firstSpanElement_visuallyHidden1 = spanElements_visuallyHidden[1];
      const firstSpanElement_visuallyHidden2 = spanElements_visuallyHidden[2];

      const about_this_profile_joined_visuallyHidden0 = await newTab.evaluate(
        (span) => span.textContent.trim(),
        firstSpanElement_visuallyHidden0
      );
      const about_this_profile_joined_visuallyHidden1 = await newTab.evaluate(
        (span) => span.textContent.trim(),
        firstSpanElement_visuallyHidden1
      );
      const about_this_profile_joined_visuallyHidden2 = await newTab.evaluate(
        (span) => span.textContent.trim(),
        firstSpanElement_visuallyHidden2
      );
      console.log(about_this_profile_joined_visuallyHidden0);
      console.log(about_this_profile_joined_visuallyHidden1);
      console.log(about_this_profile_joined_visuallyHidden2);

      trimmedVar1 = about_this_profile_joined_visuallyHidden0
        .slice(about_this_profile_joined_visuallyHidden0.indexOf(":") + 1)
        .trim();
      trimmedVar2 = about_this_profile_joined_visuallyHidden1
        .slice(about_this_profile_joined_visuallyHidden1.indexOf(":") + 1)
        .trim();
      trimmedVar3 = about_this_profile_joined_visuallyHidden2
        .slice(about_this_profile_joined_visuallyHidden2.indexOf(":") + 1)
        .trim();
      console.log(trimmedVar1);
      console.log(trimmedVar2);
      console.log(trimmedVar3);
    } catch (error) {
      console.log(trimmedVar1);
      console.log(trimmedVar2);
      console.log(trimmedVar3);
    }

    const close_button_about_this_profile =
      "button.artdeco-modal__dismiss.artdeco-button";
    await newTab.waitForSelector(close_button_about_this_profile);
    await newTab.click(close_button_about_this_profile);

    //------------------------------------ SECTION END: ABOUT THE PROFILE: --------------------------------

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Close the browser
    //await browser.close();

    let profileid = profileLinks1[i];
    console.log(profileid);

    // const existing_userid = await usersinfos.findOne({ profile_link_id: profileid });
    const existing_userid = await usersinfos.findOne({
      profile_link_id: profileid,
    });

    if (existing_userid) {
      console.log("user_id already existsssssssssssssssss");
    } else {
      let newNote = new usersinfos({
        profile_link_id: profileid,
        notes: null,
        request_send_trigger: null,
        scrapped_data: {
          profile_link: profileid,
          username: username_profile_page,
          followers: followers_number,
          connections: connections_number,
          header: header_profile_page0,
          about: abotus_user_profile_page0,
          location: textContent,
          experience: exp_data,
          education: textArray_education,
          skills: textArray_skills,
          licenses_certifications: textArray_certifications,
          interest: textArray,
          about_profile_joined: trimmedVar1,
          about_profile_contact_information: trimmedVar2,
          about_profile_profile_photo: trimmedVar3,
        },
        status: {
          request_sent: false,
          request_date: new Date(),
          request_accepted: false,
          replied: false,
          follow_up_date: null,
          connected: false,
        },
        model_data: {
          priority: 0,
          request_message: 0,
          follow_up: 0,
        },
      });

      newNote.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("data saved successfully!");
          console.log("fetching again in 20 secs");
        }
      }); // note save completed

      console.log("(" + i + "/" + profileLinks1.length + ")");
    } //else complete
  }
}

// testingv1();

// GET RANDOM PROFILES LINKED ID's
async function testingv11() {
  const browser = await puppeteer.launch({ headless: false, timeout: 90000 });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  //------------------------------------ SECTION:START #SIGIN SECTIOM#: -------------------------------
  const emailInput = await page.$("#username");
  await emailInput.type(`${process.env.USEREMAIL}`);

  const passInput = await page.$("#password");
  await passInput.type(`${process.env.PASSWORD}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

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
  //------------------------------------ SECTION: END #SIGIN IN SECTIO#: -------------------------------

  //------------------------------------ SECTION: #TARGET SERACH INPUT BOX#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const serachButton = await page.$(
    ".search-global-typeahead__collapsed-search-button"
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await serachButton.click();

  //------------------------------------ SECTION: #SERACH INPUT BOX#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const serachInput = await page.$(".search-global-typeahead__input");
  await serachInput.type("noveracion global");

  async function secondFunction() {
    const net = await browser.newPage();
    await net.goto("https://www.linkedin.com/mynetwork/");

    await new Promise((resolve) => setTimeout(resolve, 8000));

    await net.waitForSelector(
      ".artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.ember-view.ph2"
    );
    const buttons = await net.$$(
      ".artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.ember-view.ph2"
    );
    await new Promise((resolve) => setTimeout(resolve, 8000));

    await buttons[0].click();

    await new Promise((resolve) => setTimeout(resolve, 8000));

    const hrefArray0 = await net.$$eval(
      "a.app-aware-link.discover-entity-type-card__link",
      (elements) => {
        return elements.map((element) => element.href);
      }
    );

    let hrefArrayll = hrefArray0.filter(
      (profile) =>
        !profile.includes("/company/") &&
        !profile.includes("/groups/") &&
        !profile.includes("/newsletters/")
    );

    console.log(hrefArray0);
    console.log(hrefArray0.length);
    console.log(hrefArrayll);
    console.log(hrefArrayll.length);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await net.close();

    hrefArrayll = hrefArrayll.map((url) => url.replace(/\/$/, ""));
    // console.log(hrefArrayll);

    const hrefArray = [];

    for (const profile_link_id of hrefArrayll) {
      const existing_userid = await usersinfos.findOne({ profile_link_id });
      if (!existing_userid) {
        hrefArray.push(profile_link_id);
      }
    }

    console.log("============================================");
    console.log(hrefArray);
    console.log(hrefArray.length);
    console.log("============================================");

    //------------------------------------ SECTION: PROFILE #NEW BROWSER#: -------------------------------
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newTab = await browser.newPage();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    //------------------------------------ SECTION: PROFILE #FOR LOOP FOR MULTIPLE ID'S#: -------------------------------

    for (let i = 0; i < hrefArray.length; i++) {
      console.log("main link :)");
      console.log(hrefArray[i]);

      await newTab.goto(hrefArray[i]);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("kkkkk");
      const followers_number = await newTab.evaluate(() => {
        const firstLiElement = document.querySelector(
          "ul.pv-top-card--list li.text-body-small.t-black--light.inline-block span.t-bold"
        );
        return firstLiElement ? firstLiElement.innerText.trim() : "";
      });

      const connections_number = await newTab.evaluate(() => {
        const secondLiElement = document.querySelector(
          "ul.pv-top-card--list li.text-body-small span.t-black--light span.t-bold"
        );
        return secondLiElement ? secondLiElement.innerText.trim() : "";
      });

      console.log(followers_number);
      console.log(connections_number);
      console.log("kkkkk");

      //------------------------------------ SECTION: PROFILE #PROFILE USERNAME#: -------------------------------

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

      let header_profile_page0 = header_profile_page.trim();
      console.log(header_profile_page0);

      //------------------------------------ SECTION: PROFILE #LOCATION#: -------------------------------

      const elements = await newTab.$$(".pv-text-details__left-panel");

      const secondDiv = elements[1];
      const textElement = await secondDiv.$("span.text-body-small");
      const textContent = await newTab.evaluate(
        (element) => element.textContent.trim(),
        textElement
      );
      console.log("tetxtusknnl");
      console.log(textContent);

      // const location_element = await newTab.$('.text-body-small');
      // const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
      // console.log(location_profile_page);

      //------------------------------------ SECTION: PROFILE #ABOUT US#: -------------------------------

      const aboutus_user_element = await newTab.$(
        ".pv-shared-text-with-see-more"
      );
      const abotus_user_profile_page = await newTab.evaluate(
        (aboutus_user_element) => aboutus_user_element.textContent,
        aboutus_user_element
      );

      // let abotus_user_profile_page0 = abotus_user_profile_page.replace(/\s/g, "");

      let abotus_user_profile_page0 = abotus_user_profile_page.trim();
      console.log(abotus_user_profile_page0);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // const textArray001 = await newTab.evaluate(() => {
      //     const descriptionElement = document.querySelector('.feed-mini-update-contextual-description__text');
      //     const secondListElement = document.querySelector('ul.social-details-social-counts');

      //     const descriptionText = descriptionElement ? descriptionElement.innerText.trim() : '';
      //     const secondListText = secondListElement ? secondListElement.innerText.trim() : '';

      //     return [descriptionText, secondListText];
      // });

      // console.log('================================');
      // console.log(textArray001);
      // console.log('================================');

      // const skills_url0001 = hrefArray[i] + '/recent-activity/all/';
      // console.log(skills_url0001);

      // const page0001 = await browser.newPage();
      // await page0001.goto(skills_url0001);

      // const textArray1 = await page.evaluate(() => {
      //     const commentaryElement = document.querySelector('.update-components-text.relative.feed-shared-update-v2__commentary');
      //     const timeElement = document.querySelector('.update-components-text-view.break-words');

      //     const commentaryText = commentaryElement ? commentaryElement.innerText.trim() : '';
      //     const timeText = timeElement ? timeElement.innerText.trim() : '';

      //     return [`${timeText}, ${commentaryText}`];
      // });

      // console.log('================================');
      // console.log(textArray1);
      // console.log('================================');

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const skills_url000 = hrefArray[i] + "/details/highlights/";
      console.log(skills_url000);

      const page000 = await browser.newPage();
      await page000.goto(skills_url000);

      const extractedData = await page000.evaluate(() => {
        const selector00 = "div.display-flex.flex-row.justify-space-between";

        return Array.from(document.querySelectorAll(selector00)).map((item) => {
          const visuallyHiddenElement = item.querySelector(
            "span.visually-hidden"
          );
          const text = visuallyHiddenElement
            ? visuallyHiddenElement.innerText.trim()
            : "";
          return text;
        });
      });

      console.log(extractedData);

      await page000.close();

      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log("i am outtttttt");

      var skills_url00 = hrefArray[i] + "/details/interests";
      console.log(skills_url00);

      const page00 = await browser.newPage();
      await page00.goto(skills_url00);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const textArray = await page00.evaluate(() => {
        const selector =
          "div.display-flex.flex-wrap.align-items-center.full-height";

        const elements = Array.from(document.querySelectorAll(selector));
        const extractedText = elements.map((element) => {
          const visuallyHiddenSpan = element.querySelector(
            "span.visually-hidden"
          );
          return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        });

        return extractedText;
      });

      console.log(textArray);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("I am done.");

      await page00.close();

      // await newTab_education.close();

      //------------------------------------ SECTION START: SKILLS SECTION: -------------------------------

      // if (url.endsWith('/')) {
      //     url = url.replace(/\/$/, '');
      //   }

      var skills_url = hrefArray[i] + "/details/skills";
      console.log(skills_url);

      const newTab_skills = await browser.newPage();
      await newTab_skills.goto(skills_url);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const selector1 = "span.mr1.hoverable-link-text.t-bold";

      const textArray_skills = await newTab_skills.evaluate((selector1) => {
        const spanElements = Array.from(document.querySelectorAll(selector1));
        const textValues = spanElements.map((span) => {
          const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
          return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        });
        return textValues;
      }, selector1);

      console.log(textArray_skills);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("i am outt");

      await newTab_skills.close();

      //------------------------------------ SECTION END: SKILLS SECTION: -------------------------------

      //------------------------------------ SECTION START: CERTIFICATION SECTION: -------------------------------

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const newTab_certifications = await browser.newPage();

      var certificate_url = hrefArray[i] + "/details/certifications/";
      console.log(certificate_url);

      await newTab_certifications.goto(certificate_url);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const selector_certifications = "span.mr1.hoverable-link-text.t-bold";

      const textArray_certifications = await newTab_certifications.evaluate(
        (selector2) => {
          const spanElements = Array.from(document.querySelectorAll(selector2));
          const textValues = spanElements.map((span) => {
            const visuallyHiddenSpan = span.querySelector(
              "span.visually-hidden"
            );
            return visuallyHiddenSpan
              ? visuallyHiddenSpan.innerText.trim()
              : "";
          });
          return textValues;
        },
        selector_certifications
      );

      console.log(textArray_certifications);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("i am outt");

      await newTab_certifications.close();

      //------------------------------------ SECTION END: CERTIFICATION SECTION: -------------------------------

      //------------------------------------ SECTION START: EXPERIENCE SECTION: -------------------------------

      const newTab_exp = await browser.newPage();

      var exp_url = hrefArray[i] + "/details/experience/";
      console.log(exp_url);

      await newTab_exp.goto(exp_url);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log("i am inside");

      const textArray_exp = await newTab_exp.evaluate(() => {
        const selector = "div.display-flex.flex-column.full-width";

        const expItems = Array.from(document.querySelectorAll(selector));
        const extractedData = expItems.map((item) => {
          const titleElement = item.querySelector(
            "span.mr1.t-bold span.visually-hidden"
          );
          const title = titleElement ? titleElement.innerText.trim() : "";

          const subtitleElement = item.querySelector(
            "span.t-14.t-normal:not(.t-black--light) span.visually-hidden"
          );
          const subtitle = subtitleElement
            ? subtitleElement.innerText.trim()
            : "";

          const durationElement = item.querySelector(
            "span.t-14.t-normal.t-black--light span.visually-hidden"
          );
          const duration = durationElement
            ? durationElement.innerText.trim()
            : "";

          const result = [
            title,
            subtitle ? subtitle : "",
            duration ? duration : "",
          ]
            .filter(Boolean)
            .join(", ");

          return result;
        });

        return extractedData;
      });

      const exp_data = textArray_exp.filter((_, index) => index % 2 === 0);
      console.log(textArray_exp);
      console.log(exp_data);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("i am outt");

      await newTab_exp.close();

      //------------------------------------ SECTION END:EXPERIENCE: -------------------------------

      //------------------------------------ SECTION START: EDUCATION SECTION: -------------------------------

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // const newTab_education = await browser.newPage();
      // await newTab_education.goto('https://www.linkedin.com/in/nikunj-mistry-b03993223/details/education/');

      // await new Promise(resolve => setTimeout(resolve, 5000));

      // const selector_education = 'span.mr1.hoverable-link-text.t-bold';

      // const textArray_education = await newTab_education.evaluate((selector4) => {
      //     const spanElements = Array.from(document.querySelectorAll(selector4));
      //     const textValues = spanElements.map((span) => {
      //         const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
      //         return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
      //     });
      //     return textValues;
      // }, selector_education);

      // console.log(textArray_education);

      // await new Promise(resolve => setTimeout(resolve, 1000));
      // console.log('i am outt');

      // await newTab_education.close();

      const newTab_education = await browser.newPage();

      var edu_url = hrefArray[i] + "/details/education/";
      console.log(edu_url);

      await newTab_education.goto(edu_url);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const textArray_education = await newTab_education.evaluate(() => {
        const selector = "div.display-flex.flex-row.justify-space-between";

        const educationItems = Array.from(document.querySelectorAll(selector));
        const extractedData = educationItems.map((item) => {
          const universityElement = item.querySelector(
            "span.mr1.hoverable-link-text.t-bold span.visually-hidden"
          );
          const university = universityElement
            ? universityElement.innerText.trim()
            : "";

          const degreeElement = item.querySelector(
            "span.t-14.t-normal span.visually-hidden"
          );
          const degree = degreeElement ? degreeElement.innerText.trim() : "";

          const durationElement = item.querySelector(
            "span.t-14.t-normal.t-black--light span.visually-hidden"
          );
          const duration = durationElement
            ? durationElement.innerText.trim()
            : "";

          return `${university}${degree ? ", " + degree : ""}${
            duration ? ", " + duration : ""
          }`;
        });

        return extractedData;
      });

      console.log(textArray_education);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("I am done.");

      await newTab_education.close();

      //------------------------------------ SECTION END: EDUCATION SECTION: -------------------------------

      let profileid = hrefArray[i];

      console.log("last stage");
      console.log(hrefArray[i]);
      console.log(profileid);
      console.log("last stage");

      // const existing_userid = await usersinfos.findOne({ profile_link_id: profileid });
      const existing_userid = await usersinfos.findOne({
        profile_link_id: profileid,
      });

      if (existing_userid) {
        console.log("user_id already existsssssssssssssssss");
      } else {
        let newNote = new usersinfos({
          profile_link_id: profileid,
          notes: null,
          request_send_trigger: null,
          scrapped_data: {
            profile_link: profileid,
            username: username_profile_page,
            followers: followers_number,
            connections: connections_number,
            header: header_profile_page0,
            about: abotus_user_profile_page0,
            location: textContent,
            experience: exp_data,
            education: textArray_education,
            skills: textArray_skills,
            licenses_certifications: textArray_certifications,
            interest: textArray,
            highlights: extractedData,
          },
          status: {
            request_sent: false,
            request_date: new Date(),
            request_accepted: false,
            replied: false,
            follow_up_date: null,
            connected: false,
          },
          model_data: {
            priority: 0,
            request_message: 0,
            follow_up: 0,
          },
        });

        newNote.save(function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("data saved successfully!");
            console.log("fetching again in 20 secs");
          }
        }); // note save completed
      } //else complete
    }

    console.log(hrefArray);
    console.log("loop complete");
    secondFunction();
  }

  secondFunction();
}

// testingv11();

// random profile using a group
async function testingv110() {
  const browser = await puppeteer.launch({ headless: false, timeout: 90000 });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  //------------------------------------ SECTION:START #SIGIN SECTIOM#: -------------------------------
  const emailInput = await page.$("#username");
  await emailInput.type(`${process.env.USEREMAIL}`);

  const passInput = await page.$("#password");
  await passInput.type(`${process.env.PASSWORD}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

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
  //------------------------------------ SECTION: END #SIGIN IN SECTIO#: -------------------------------

  //------------------------------------ SECTION: #TARGET SERACH INPUT BOX#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const serachButton = await page.$(
    ".search-global-typeahead__collapsed-search-button"
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await serachButton.click();

  //------------------------------------ SECTION: #SERACH INPUT BOX#: -------------------------------
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const serachInput = await page.$(".search-global-typeahead__input");
  await serachInput.type("noveracion global");

  async function extractHrefs(page) {
    const hrefsArray = [];

    for (let i = 1; i <= 90; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Processing page", i);
      const url = `https://www.linkedin.com/search/results/people/?currentCompany=%5B%224831032%22%5D&origin=COMPANY_PAGE_CANNED_SEARCH&page=${i}&sid=duU`;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await page.goto(url);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const divs = await page.$$(
        ".entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light"
      );

      for (const div of divs) {
        const hrefElement = await div.$("a.app-aware-link");
        if (hrefElement) {
          const href = await page.evaluate(
            (element) => element.getAttribute("href"),
            hrefElement
          );
          hrefsArray.push(href);
        }
      }
      console.log(hrefsArray);
      console.log(hrefsArray.length);
      console.log("count=" + i);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return hrefsArray;
  }

  const hrefs = await extractHrefs(page);
  console.log(hrefs);
  console.log(hrefs.length);

  // async function extractHrefs() {
  //     const grouppg = await browser.newPage();

  //     console.log('entered in exctracthrref');

  //     await grouppg.goto('https://www.linkedin.com/search/results/people/?currentCompany=%5B%224831032%22%5D&origin=COMPANY_PAGE_CANNED_SEARCH&page=1&sid=duU'); // Replace 'your_url_here' with the actual URL

  //     const hrefs = await grouppg.evaluate(() => {
  //         const divs = document.querySelectorAll('.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light');
  //         const hrefsArray = [];

  //         divs.forEach(div => {
  //             console.log('entered inside forEach');

  //             const hrefElement = div.querySelector('a.app-aware-link');
  //             if (hrefElement) {
  //                 const href = hrefElement.getAttribute('href');
  //                 hrefsArray.push(href);
  //             }
  //         });

  //         return hrefsArray;
  //     });

  //     // await browser.close();

  //     await grouppg.close();
  //     console.log(hrefs);
  //     console.log(hrefs.length);
  // }

  // extractHrefs();
}

// testingv110();

//API'S

const session = require("express-session");
const crypto = require("crypto");
// Configure and use session middleware

// Generate and store secure secret keys
const sessionSecretKey = crypto.randomBytes(32).toString("hex");
const jwtSecretKey = crypto.randomBytes(32).toString("hex");

app.use(
  session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true },
  })
);

// Route for the main page
app.get("/home", async (req, res) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verify the JWT token and get user data
    const decoded = jwt.verify(token, jwtSecretKey);
    const user = await UserModel.findById(decoded.userId);

    // If the request is an AJAX request, send JSON response
    if (req.xhr) {
      return res.json({ message: "Successfully logged in!", user });
    }

    // Render the home page with user data
    res.render("home", { user });
  } catch (error) {
    console.error(error);

    // If the request is an AJAX request, send JSON response
    if (req.xhr) {
      return res
        .status(401)
        .json({ message: "Invalid token, redirect to login" });
    }

    // Invalid token, redirect to login
    res.redirect("/login");
  }
});

// Route for the user profile page
app.get("/userprofile", async (req, res) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verify the JWT token and get user data
    const decoded = jwt.verify(token, jwtSecretKey);
    const user = await UserModel.findById(decoded.userId);

    // Render the user profile page with user data
    res.render("userpr");
  } catch (error) {
    console.error(error);
    res.redirect("/login"); // Invalid token, redirect to login
  }
});

// Route for the login page
app.get("/login", (req, res) => {
  res.render("login"); // Render the login template
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    console.log("user- " + user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Create a JWT token with user ID and email
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecretKey,
      {
        expiresIn: "1h", // Set token expiry time
      }
    );

    // Store the token in the session
    req.session.token = token;

    // Send the token to the client
    // res.json({ message: "Successfully logged in!", token });
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user!" });
  }
});

// Route for logout
app.post("/logout", async (req, res) => {
  // Destroy the session cookie, invalidating the token
  req.session.destroy(() => {
    res.clearCookie("session").json({ message: "Successfully logged out!" });
  });
});

//registration

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("Users", userSchema);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.query; // Use body instead of query params for security

  console.log(username + " " + email + " " + password);

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists!" });
    }

    // Hash password securely before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashcode- " + hashedPassword);
    // Create new user with hashed password
    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Create JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id, email }, jwtSecretKey, {
      expiresIn: "1h", // Set token expiry time
    });

    // Store the token in the session for logged-in state
    req.session.token = token;

    // Send the token and registration confirmation to the client
    res.json({ message: "User registered successfully!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user!" });
  }
});

app.listen(8000, function (req, res) {
  console.log("MAIN UI: http://localhost:6000/");
});
