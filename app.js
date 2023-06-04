const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const prettier = require('prettier');
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
require('dotenv').config();


const app = express();

const password = process.env.PASSWORD;
// console.log(password);




mongoose.set('strictQuery', false);

// async function main() {
mongoose.connect("mongodb+srv://prayag_SIHH:pp1234@cluster0.tuna9.mongodb.net/ats_linkedin?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


// const usersinfosSchema = {
//     timestamp: String,
//     user_name: String,
//     linkedin_id: String
// }

const usersinfosSchema = {
    profile_link_id: String,
    request_send_trigger: String,
    notes: String,
    scrapped_data: {
        profile_link: String,
        username: String,
        header: String,
        about: String,
        location: String,
        experience: [String],
        education: [String],
        skills: [String],
        licenses_certifications: [String],
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
        connected: Boolean
    },

    model_data: {
        priority: Number,
        request_message: Number,
        follow_up: Number
    }

}



const usersinfos = mongoose.model("usersinfos", usersinfosSchema);  //open_in== coll name


let profileLinks10;

async function run() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to next day midnight

    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-IN', options).toUpperCase();
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
    await page.goto('https://lunchclub.com/login');

    // Fill in email input field
    const emailInput = await page.$('.TextInput__StyledInput-sc-1innz0i-0');
    await emailInput.type('prayagbhosale228008@gmail.com');

    await new Promise(resolve => setTimeout(resolve, 3000));


    // Click on "Continue" button
    const continueButton = await page.$('Button__StyledButton-sc-13h5o1r-0');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await continueButton.click();


    await page.waitForNavigation();

    // Close the browser
    await browser.close();
}

//loginToLunchclub();





var profileLinks = ['https://www.linkedin.com/in/gourav-grover-02a82a200/'];




async function linkined() {

    const usersinfosp = await usersinfos.find({ request_send_trigger: 'today' });
    const profileLinkIds = usersinfosp.map(doc => doc.profile_link_id);
    const notes = usersinfosp.map(doc => doc.notes);

    console.log(profileLinkIds);
    console.log(notes);


    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    // Fill in email input field
    const emailInput = await page.$('#username');
    await emailInput.type(`${process.env.USEREMAIL}`);

    const passInput = await page.$('#password');
    await passInput.type(`${process.env.PASSWORD}`);

    await new Promise(resolve => setTimeout(resolve, 3000));


    // Click on "Continue" button
    const continueButton = await page.$('.btn__primary--large.from__button--floating');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await continueButton.click();


    await new Promise(resolve => setTimeout(resolve, 3000));


    await page.waitForNavigation();




    await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
    const button = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
    await button[0].click();


    await new Promise(resolve => setTimeout(resolve, 3000));



    const serachButton = await page.$('.search-global-typeahead__collapsed-search-button');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await serachButton.click();


    await new Promise(resolve => setTimeout(resolve, 1000));


    const serachInput = await page.$('.search-global-typeahead__input');
    await serachInput.type('noveracion global');




    await new Promise(resolve => setTimeout(resolve, 2000));
    //   await page.goto('https://www.linkedin.com/company/noveracion-global/');
    // Open a new tab

    //new browser
    const newTab = await browser.newPage();

    await new Promise(resolve => setTimeout(resolve, 1000));



    for (let i = 0; i < profileLinkIds.length; i++) {


        // Navigate to the link
        // await newTab.goto('https://www.linkedin.com/company/noveracion-global/');


        //  await newTab.goto('https://www.linkedin.com/in/divyanshu-sahu-820467245/');



        await newTab.goto(profileLinkIds[i]);

        // await newTab.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.7 });




        //page down
        await new Promise(resolve => setTimeout(resolve, 2000));

        //   const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
        //    await button_more_collapse[2].click();




        const username_profile_element = await newTab.$('.text-heading-xlarge');
        const username_profile_page = await newTab.evaluate(username_profile_element => username_profile_element.textContent, username_profile_element);
        // console.log(username_profile_page);


        const header_element = await newTab.$('.text-body-medium');
        const header_profile_page = await newTab.evaluate(header_element => header_element.textContent, header_element);
        // console.log(header_profile_page);

        console.log('hiii');


        // const element = await newTab.$('.pv-text-details__left-panel .text-body-small');
        // const textContent = await newTab.evaluate(element => element.textContent.trim(), element);
        // console.log(textContent);

        const elements = await newTab.$$('.pv-text-details__left-panel');

        const secondDiv = elements[1];
        const textElement = await secondDiv.$('span.text-body-small');
        const textContent = await newTab.evaluate(element => element.textContent.trim(), textElement);
        console.log(textContent);



        //     const location_element = await newTab.$('.text-body-small');
        //     const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
        //    console.log(location_profile_page);





        const aboutus_user_element = await newTab.$('.pv-shared-text-with-see-more');
        const abotus_user_profile_page = await newTab.evaluate(aboutus_user_element => aboutus_user_element.textContent, aboutus_user_element);
        //console.log(abotus_user_profile_page);


        await new Promise(resolve => setTimeout(resolve, 1000));


        //connect button click  WORKIN---div.artdeco-dropdown__item

        //   const button_more_connect_part = await newTab.$$('btn.artdeco-button');

        // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
        //   await button_more_connect_part[7].click();


        // Click the button


        // await newTab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');



        const followButton = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
        const followButtonText = await newTab.evaluate(followButton => followButton.textContent, followButton);

        console.log(`"${followButtonText}"`);

        try {
            if (followButtonText.includes('Follow')) {
                console.log('Follow if detected');


                await new Promise(resolve => setTimeout(resolve, 2000));

                const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
                await button_more_collapse[2].click();

                await new Promise(resolve => setTimeout(resolve, 1000));


                //connect button click  WORKIN---div.artdeco-dropdown__item

                const button_more_connect_part = await newTab.$$('div.artdeco-dropdown__item');
                // const button_more_connect_part = await newTab.$$('btn.artdeco-button');
                await button_more_connect_part[7].click();


                await new Promise(resolve => setTimeout(resolve, 3000));

                add_a_note();
            }

            else if (followButtonText.includes('Connect')) {
                console.log('NOO Follow button detected going to three dot menu');
                await followButton.click();

                add_a_note();

            }

        } catch (err) {
            console.log(err);

        }



        //await followButton.click();


        async function add_a_note() {

            await newTab.waitForSelector('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
            const buttonnew = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(1)');
            await buttonnew.click();


            await newTab.waitForSelector('#custom-message');
            const connect_note_send_message_ = await newTab.$('#custom-message');
            // await connect_note_send_message_.type('Hello, I would like to connect with you!');
            await connect_note_send_message_.type(notes[i]);

            await new Promise(resolve => setTimeout(resolve, 3000));

            await newTab.waitForSelector('.artdeco-modal__actionbar');
            const button_send_note_message = await newTab.$('div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)');
            await button_send_note_message.click();

            await new Promise(resolve => setTimeout(resolve, 9000));

        };

        await new Promise(resolve => setTimeout(resolve, 5000));



        //  const profile_page_button = await newTab.$('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
        // await newTab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action');
        // await profile_page_button.click();

        await new Promise(resolve => setTimeout(resolve, 3000));

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












        await new Promise(resolve => setTimeout(resolve, 9000));

        // Close the browser
        //await browser.close();


    }
}




// linkined();













var profileLinks1 = ['https://www.linkedin.com/in/nisha-janagal-b35b08213/'];


async function testingv1() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    //------------------------------------ SECTION:START #SIGIN SECTIOM#: ------------------------------- 
    const emailInput = await page.$('#username');
    await emailInput.type(`${process.env.USEREMAIL}`);

    const passInput = await page.$('#password');
    await passInput.type(`${process.env.PASSWORD}`);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const continueButton = await page.$('.btn__primary--large.from__button--floating');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await continueButton.click();


    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForNavigation();

    await page.waitForSelector('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
    const button = await page.$$('.msg-overlay-bubble-header__control--new-convo-btn:nth-of-type(2)');
    await button[0].click();
    //------------------------------------ SECTION: END #SIGIN IN SECTIO#: -------------------------------


    //------------------------------------ SECTION: #TARGET SERACH INPUT BOX#: -------------------------------
    await new Promise(resolve => setTimeout(resolve, 3000));
    const serachButton = await page.$('.search-global-typeahead__collapsed-search-button');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await serachButton.click();



    //------------------------------------ SECTION: #SERACH INPUT BOX#: -------------------------------
    await new Promise(resolve => setTimeout(resolve, 1000));
    const serachInput = await page.$('.search-global-typeahead__input');
    await serachInput.type('noveracion global');



    //------------------------------------ SECTION: PROFILE #NEW BROWSER#: -------------------------------
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newTab = await browser.newPage();
    await new Promise(resolve => setTimeout(resolve, 1000));


    //------------------------------------ SECTION: PROFILE #FOR LOOP FOR MULTIPLE ID'S#: -------------------------------

    for (let i = 0; i < profileLinks1.length; i++) {

        await newTab.goto(profileLinks1[i]);

        await new Promise(resolve => setTimeout(resolve, 2000));


        //------------------------------------ SECTION: PROFILE #PROFILE USERNAME#: -------------------------------

        const username_profile_element = await newTab.$('.text-heading-xlarge');
        const username_profile_page = await newTab.evaluate(username_profile_element => username_profile_element.textContent, username_profile_element);
        console.log(username_profile_page);



        const header_element = await newTab.$('.text-body-medium');
        const header_profile_page = await newTab.evaluate(header_element => header_element.textContent, header_element);

        let header_profile_page0 = header_profile_page.trim();
        console.log(header_profile_page0);


        //------------------------------------ SECTION: PROFILE #LOCATION#: -------------------------------

        const elements = await newTab.$$('.pv-text-details__left-panel');

        const secondDiv = elements[1];
        const textElement = await secondDiv.$('span.text-body-small');
        const textContent = await newTab.evaluate(element => element.textContent.trim(), textElement);
        console.log('tetxtusknnl');
        console.log(textContent);



        // const location_element = await newTab.$('.text-body-small');
        // const location_profile_page = await newTab.evaluate(location_element => location_element.textContent, location_element);
        // console.log(location_profile_page);



        //------------------------------------ SECTION: PROFILE #ABOUT US#: -------------------------------

        const aboutus_user_element = await newTab.$('.pv-shared-text-with-see-more');
        const abotus_user_profile_page = await newTab.evaluate(aboutus_user_element => aboutus_user_element.textContent, aboutus_user_element);

        // let abotus_user_profile_page0 = abotus_user_profile_page.replace(/\s/g, "");
        let abotus_user_profile_page0 = abotus_user_profile_page.trim();

        console.log(abotus_user_profile_page0);

        await new Promise(resolve => setTimeout(resolve, 2000));




        //------------------------------------ SECTION START: SKILLS SECTION: -------------------------------

        const newTab_skills = await browser.newPage();
        await newTab_skills.goto('https://www.linkedin.com/in/nisha-janagal-b35b08213/');

        await new Promise(resolve => setTimeout(resolve, 5000));

        const selector1 = 'span.mr1.hoverable-link-text.t-bold';

        const textArray_skills = await newTab_skills.evaluate((selector1) => {
            const spanElements = Array.from(document.querySelectorAll(selector1));
            const textValues = spanElements.map((span) => {
                const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
                return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
            });
            return textValues;
        }, selector1);

        console.log(textArray_skills);


        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('i am outt');

        await newTab_skills.close();

        //------------------------------------ SECTION END: SKILLS SECTION: -------------------------------




        //------------------------------------ SECTION START: CERTIFICATION SECTION: -------------------------------

        await new Promise(resolve => setTimeout(resolve, 5000));

        const newTab_certifications = await browser.newPage();
        await newTab_certifications.goto('https://www.linkedin.com/in/nisha-janagal-b35b08213/');

        await new Promise(resolve => setTimeout(resolve, 5000));

        const selector_certifications = 'span.mr1.hoverable-link-text.t-bold';

        const textArray_certifications = await newTab_certifications.evaluate((selector2) => {
            const spanElements = Array.from(document.querySelectorAll(selector2));
            const textValues = spanElements.map((span) => {
                const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
                return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
            });
            return textValues;
        }, selector_certifications);

        console.log(textArray_certifications);


        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('i am outt');

        await newTab_certifications.close();


        //------------------------------------ SECTION END: CERTIFICATION SECTION: -------------------------------




        //------------------------------------ SECTION START: EXPERIENCE SECTION: -------------------------------


        await new Promise(resolve => setTimeout(resolve, 5000));

        const newTab_exp = await browser.newPage();
        await newTab_exp.goto('https://www.linkedin.com/in/nisha-janagal-b35b08213/');

        await new Promise(resolve => setTimeout(resolve, 5000));

        const selector_exp = 'span.mr1.t-bold';
        const textArray_exp = await newTab_exp.evaluate((selector3) => {
            const spanElements = Array.from(document.querySelectorAll(selector3));
            const textValues = spanElements.map((span) => {
                const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
                return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
            });
            return textValues;
        }, selector_exp);

        console.log(textArray_exp);


        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('i am outt');

        await newTab_exp.close();


        //------------------------------------ SECTION END:EXPERIENCE: -------------------------------






        //------------------------------------ SECTION START: EDUCATION SECTION: -------------------------------


        await new Promise(resolve => setTimeout(resolve, 5000));

        const newTab_education = await browser.newPage();
        await newTab_education.goto('https://www.linkedin.com/in/nisha-janagal-b35b08213/');

        await new Promise(resolve => setTimeout(resolve, 5000));

        const selector_education = 'span.mr1.hoverable-link-text.t-bold';

        const textArray_education = await newTab_education.evaluate((selector4) => {
            const spanElements = Array.from(document.querySelectorAll(selector4));
            const textValues = spanElements.map((span) => {
                const visuallyHiddenSpan = span.querySelector('span.visually-hidden');
                return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : '';
            });
            return textValues;
        }, selector_education);

        console.log(textArray_education);


        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('i am outt');

        await newTab_education.close();

        //------------------------------------ SECTION END: EDUCATION SECTION: -------------------------------



        //------------------------------------ SECTION SART: ABOUT THE PROFILE: -------------------------------

        await new Promise(resolve => setTimeout(resolve, 1000));

        const button_more_collapse = await newTab.$$('button.artdeco-dropdown__trigger');
        await button_more_collapse[2].click();


        await new Promise(resolve => setTimeout(resolve, 1000));

        const button_more_connect_part = await newTab.$$('div.artdeco-dropdown__item');
        await button_more_connect_part[9].click();


        const selector_about_this_profile_joined = 'div.artdeco-modal__content.ember-view';
        await newTab.waitForSelector(selector_about_this_profile_joined);
        const divElement_modalContent = await newTab.$(selector_about_this_profile_joined);

        const selector_visuallyHidden = 'span.visually-hidden';
        await divElement_modalContent.waitForSelector(selector_visuallyHidden);
        const spanElements_visuallyHidden = await divElement_modalContent.$$(selector_visuallyHidden);

        const firstSpanElement_visuallyHidden0 = spanElements_visuallyHidden[0];
        const firstSpanElement_visuallyHidden1 = spanElements_visuallyHidden[1];
        const firstSpanElement_visuallyHidden2 = spanElements_visuallyHidden[2];


        const about_this_profile_joined_visuallyHidden0 = await newTab.evaluate(span => span.textContent.trim(), firstSpanElement_visuallyHidden0);
        const about_this_profile_joined_visuallyHidden1 = await newTab.evaluate(span => span.textContent.trim(), firstSpanElement_visuallyHidden1);
        const about_this_profile_joined_visuallyHidden2 = await newTab.evaluate(span => span.textContent.trim(), firstSpanElement_visuallyHidden2);
        console.log(about_this_profile_joined_visuallyHidden0);
        console.log(about_this_profile_joined_visuallyHidden1);
        console.log(about_this_profile_joined_visuallyHidden2);



        const trimmedVar1 = about_this_profile_joined_visuallyHidden0.slice(about_this_profile_joined_visuallyHidden0.indexOf(':') + 1).trim();
        const trimmedVar2 = about_this_profile_joined_visuallyHidden1.slice(about_this_profile_joined_visuallyHidden1.indexOf(':') + 1).trim();
        const trimmedVar3 = about_this_profile_joined_visuallyHidden2.slice(about_this_profile_joined_visuallyHidden2.indexOf(':') + 1).trim();
        console.log(trimmedVar1)
        console.log(trimmedVar2)
        console.log(trimmedVar3)


        const close_button_about_this_profile = 'button.artdeco-modal__dismiss.artdeco-button';
        await newTab.waitForSelector(close_button_about_this_profile);
        await newTab.click(close_button_about_this_profile);

        //------------------------------------ SECTION END: ABOUT THE PROFILE: --------------------------------

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Close the browser
        //await browser.close();

        var profileid = profileLinks1[i];
        console.log(profileid);



        // const existing_userid = await usersinfos.findOne({ profile_link_id: profileid });
        const existing_userid = await usersinfos.find({ profile_link_id: profileid });


        if (existing_userid) {
            console.log('user_id already existsssssssssssssssss');
        }


        else {
            let newNote = new usersinfos({
                profile_link_id: profileid,
                notes: null,
                request_send_trigger: null,
                scrapped_data: {
                    profile_link: profileid,
                    username: username_profile_page,
                    header: header_profile_page0,
                    about: abotus_user_profile_page0,
                    location: textContent,
                    experience: textArray_exp,
                    education: textArray_education,
                    skills: textArray_skills,
                    licenses_certifications: textArray_certifications,
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
                    connected: false
                },
                model_data: {
                    priority: 0,
                    request_message: 0,
                    follow_up: 0
                }
            });




            newNote.save(function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('data saved successfully!');
                    console.log('fetching again in 20 secs');
                }



            }); // note save completed



        } //else complete


    }
}



testingv1();


app.listen(3000, () => console.log('listening on port 3000'));



