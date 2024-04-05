
// Niranjana commit

const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
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



let profileLinks10;


//testtingv1 used to scrape the profies data of users
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
        "https://www.linkedin.com/in/saurabhkrishangulab?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABryj2MBwzpxC_01ZyWqCYI_F0l4wB6sV2M",
        "https://www.linkedin.com/in/yash2411?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC23tSQBWGjxD3EjP7ewH_jOPli8cs8Uw3U",
        "https://www.linkedin.com/in/hashim-yousuf-6b8196215?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADZPYWwB_KNalTbSpR3RhQWPYszueO8hml4",
    ];



    //------------------------------------ SECTION: PROFILE #NEW BROWSER#: -------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newTab = await browser.newPage();

    const profileLinks1 = [
        // "https://www.linkedin.com/in/shahbaz-khan-kingoffalcons",
        // "https://www.linkedin.com//in/saurabhkrishangulab?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABryj2MBwzpxC_01ZyWqCYI_F0l4wB6sV2M",
        "https://www.linkedin.com/in/yash2411",
        // "https://www.linkedin.com/in/hashim-yousuf-6b8196215?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAADZPYWwB_KNalTbSpR3RhQWPYszueO8hml4",
    ];



    // for (const profile_link_id of profileLinks1ll) {
    //     const existing_userid = await usersinfos.findOne({ profile_link_id });
    //     if (!existing_userid) {
    //         profileLinks1.push(profile_link_id);
    //     }
    // }

    console.log("=================PROFILE DATA===========================");
    console.log(profileLinks1);
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

        // const elements = await newTab.$$(".pv-text-details__left-panel");

        // const secondDiv = elements[1];
        // const textElement = await secondDiv.$("span.text-body-small");
        // const textContent = await newTab.evaluate(
        //     (element) => element.textContent.trim(),
        //     textElement
        // );
        // console.log("tetxtusknnl");
        // console.log(textContent);

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

        // const selector1 = "span.mr1.hoverable-link-text.t-bold";

        // const textArray_skills = await newTab_skills.evaluate((selector1) => {
        //     const spanElements = Array.from(document.querySelectorAll(selector1));
        //     const textValues = spanElements.map((span) => {
        //         const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
        //         return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        //     });
        //     return textValues;
        // }, selector1);

        // console.log(textArray_skills);


        // SKILL EXTRACTION START----------------------------------------------------------------
        // const selector = 'div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold span';

        // const textArray_skills = await newTab_skills.evaluate((selector) => {
        //     const spanElements = Array.from(document.querySelectorAll(selector));
        //     const textValues = spanElements.map((span) => {
        //         const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
        //         return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        //     });
        //     return textValues;
        // }, selector);

        // console.log(textArray_skills);


        // const divSelector = 'div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold';

        // const textArray12 = await page.evaluate((divSelector) => {
        //     const divElements = document.querySelectorAll(divSelector);
        //     let textValues2 = [];

        //     divElements.forEach((div) => {
        //         const span = div.querySelector('span.visually-hidden');
        //         if (span) {
        //             textValues2.push(span.innerText.trim());
        //         }
        //     });

        //     return textValues2;
        // }, divSelector);

        // console.log(textArray12);
        let textArray_skills;
        try {
            const textArray = [];

            // Select all divs with the specified classes
            const divs = await newTab_skills.$$('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold');

            for (const div of divs) {
                const text = await div.$eval('span.visually-hidden', el => el.textContent.trim());
                textArray.push(text);
            }

            console.log(textArray); // Output: ["User Acceptance Testing", ...]
            textArray_skills = Array.from(new Set(textArray));

        } catch (error) {
            console.error('Error:', error);
        } finally {
            // await browser.close();

            await new Promise((resolve) => setTimeout(resolve, 5000));

        }

        // console.log(textArray_skills);





        // SKILL EXTRACTION END----------------------------------------------------------------


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

        // const selector_certifications = "span.mr1.hoverable-link-text.t-bold";

        // const textArray_certifications = await newTab_certifications.evaluate(
        //     (selector2) => {
        //         const spanElements = Array.from(document.querySelectorAll(selector2));
        //         const textValues = spanElements.map((span) => {
        //             const visuallyHiddenSpan = span.querySelector("span.visually-hidden");
        //             return visuallyHiddenSpan ? visuallyHiddenSpan.innerText.trim() : "";
        //         });
        //         return textValues;
        //     },
        //     selector_certifications
        // );

        // CERTIFFICATION EXTRACTION START----------------------------------------------------------------
        let uniqueCertificateArray;
        let textArray_certifications;
        try {
            const textArray_certi = [];

            // Select all divs with the specified classes
            const divs_certi = await newTab_certifications.$$('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold');

            for (const div of divs_certi) {
                const text = await div.$eval('span.visually-hidden', el => el.textContent.trim());
                textArray_certi.push(text); // Push the text content into the array
            }

            console.log(textArray_certi); // Output: ["User Acceptance Testing", ...]
            uniqueCertificateArray = textArray_certi;


            textArray_certifications = Array.from(new Set(uniqueCertificateArray));

        } catch (error) {
            console.error('Error:', error);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        console.log(textArray_certifications);


        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("i am outt");

        await newTab_certifications.close();
        // CERTIFICATION EXTRACTION END----------------------------------------------------------------



        //------------------------------------ SECTION END: CERTIFICATION SECTION: -------------------------------

        //------------------------------------ SECTION START: EXPERIENCE SECTION: -------------------------------

        const newTab_exp = await browser.newPage();

        var exp_url = profileLinks1[i] + "details/experience/";
        console.log(exp_url);

        await newTab_exp.goto(exp_url);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("i am inside");

        // const textArray_exp = await newTab_exp.evaluate(() => {
        //     const selector = "div.display-flex.flex-column.full-width";

        //     const expItems = Array.from(document.querySelectorAll(selector));
        //     const extractedData = expItems.map((item) => {
        //         const titleElement = item.querySelector(
        //             "span.mr1.t-bold span.visually-hidden"
        //         );
        //         const title = titleElement ? titleElement.innerText.trim() : "";

        //         const subtitleElement = item.querySelector(
        //             "span.t-14.t-normal:not(.t-black--light) span.visually-hidden"
        //         );
        //         const subtitle = subtitleElement
        //             ? subtitleElement.innerText.trim()
        //             : "";

        //         const durationElement = item.querySelector(
        //             "span.t-14.t-normal.t-black--light span.visually-hidden"
        //         );
        //         const duration = durationElement
        //             ? durationElement.innerText.trim()
        //             : "";

        //         const result = [
        //             title,
        //             subtitle ? subtitle : "",
        //             duration ? duration : "",
        //         ]
        //             .filter(Boolean)
        //             .join(", ");

        //         return result;
        //     });

        //     return extractedData;
        // });

        // const exp_data = textArray_exp.filter((_, index) => index % 2 === 0);
        // console.log(textArray_exp);
        // console.log(exp_data);


        let textArray_exp;
        let exp_data;
        try {
            const textArray2 = [];

            // Select all divs with the specified classes
            const divs = await newTab_exp.$$('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold');

            for (const div of divs) {
                const text = await div.$eval('span.visually-hidden', el => el.textContent.trim());
                textArray2.push(text);
            }

            console.log(textArray2); // Output: ["User Acceptance Testing", ...]
            textArray_exp = textArray2;

            //clear duplicates
            exp_data = Array.from(new Set(textArray_exp));
            console.log(exp_data);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            // await browser.close();

            await new Promise((resolve) => setTimeout(resolve, 5000));

        }


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

        // const textArray_education = await newTab_education.evaluate(() => {
        //     const selector = "div.display-flex.flex-row.justify-space-between";

        //     const educationItems = Array.from(document.querySelectorAll(selector));
        //     const extractedData = educationItems.map((item) => {
        //         const universityElement = item.querySelector(
        //             "span.mr1.hoverable-link-text.t-bold span.visually-hidden"
        //         );
        //         const university = universityElement
        //             ? universityElement.innerText.trim()
        //             : "";

        //         const degreeElement = item.querySelector(
        //             "span.t-14.t-normal span.visually-hidden"
        //         );
        //         const degree = degreeElement ? degreeElement.innerText.trim() : "";

        //         const durationElement = item.querySelector(
        //             "span.t-14.t-normal.t-black--light span.visually-hidden"
        //         );
        //         const duration = durationElement
        //             ? durationElement.innerText.trim()
        //             : "";

        //         return `${university}${degree ? ", " + degree : ""}${duration ? ", " + duration : ""
        //             }`;
        //     });

        //     return extractedData;
        // });

        // console.log(textArray_education);

        let textArray_education;
        try {
            const textArray3 = [];

            // Select all divs with the specified classes
            const divs = await newTab_education.$$('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold');

            for (const div of divs) {
                const text = await div.$eval('span.visually-hidden', el => el.textContent.trim());
                textArray3.push(text);
            }


            textArray_education = Array.from(new Set(textArray3));

            console.log(textArray_education);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            // await browser.close();

            await new Promise((resolve) => setTimeout(resolve, 5000));

        }


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
        // const existing_userid = await usersinfos.findOne({
        //     profile_link_id: profileid,
        // });




        // if (existing_userid) {
        //     console.log("user_id already existsssssssssssssssss");
        // } else {
        // let newNote = new usersinfos({
        let newNote = {
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
                location: null,
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
        };

        // const note = generateNotes(newNote);


        // newNote.save(function (error) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log("data saved successfully!");
        //         console.log("fetching again in 20 secs");
        //     }
        // }); // note save completed

        console.log("(" + i + "/" + profileLinks1.length + ")");
        console.log(newNote);

        // let scoree11 = profile_score(newNote11, goal);
        // if (scoree11 > 20000) {
        // generateNotes();
        // }




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
            await connect_note_send_message_.type('hiii i am prayag would like to connect with u');

            await new Promise((resolve) => setTimeout(resolve, 3000));

            await newTab.waitForSelector(".artdeco-modal__actionbar");
            const button_send_note_message = await newTab.$(
                "div.artdeco-modal__actionbar button.artdeco-button:nth-of-type(2)"
            );
            await button_send_note_message.click();

            await new Promise((resolve) => setTimeout(resolve, 9000));
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));


        // else {
        // continue;
        // }


        // } //else complete
    }
}

testingv1();
