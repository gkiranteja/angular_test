const PROTOCOL = 'https';

const BUILD_ENVIRONMENT: any = 'staging';//staging / prod                  //Pass the environment to this variable to manke the build, like:  dev / stage / prod
export const BUILD_ENVIRONMENT_VERSION = {
    VERSION: require('../../package.json').version,     //Pass the build environment version(latest is: v 1.0.1)
    IN_STOREUPLOAD: 'windows'                           //pass the string 'windows/store' to vary the difference view some of functionalities.
                                                        //Store build doesn't have some of options/functionalities and windows have all options/functionalities.
};

export let SITE_URL, MICRO_URL, KEY;
switch (BUILD_ENVIRONMENT) {
    case 'dev':
        // SITE_URL = PROTOCOL + '://' + 'stagingapi.trasers.com/';
        SITE_URL = PROTOCOL + '://' + 'staging.trasers.com/';
        MICRO_URL = 'https://apimicrostg.trasers.com/';
        KEY = 'xMfLTpvBaR6m0Jcm6i9tB8qtjwH7kuB13rQ3N5nX';
        break;
    case 'stage':
        SITE_URL = PROTOCOL + '://' + 'stgapi.trasers.com/';
        MICRO_URL = 'https://apimicrostg.trasers.com/';
        KEY = 'xMfLTpvBaR6m0Jcm6i9tB8qtjwH7kuB13rQ3N5nX';
        break;
    case 'prod':
        SITE_URL = PROTOCOL + '://' + 'api.trasers.com/';
        MICRO_URL = 'https://apimicrostg.trasers.com/';
        KEY = 'aRukz1Ps7h6nXgHPUaa0k7faaxx0x3fJ3T4zuH7o';
        break;
    case 'staging':
        SITE_URL = PROTOCOL + '://' + 'staging.trasers.com/';
        MICRO_URL = 'https://apimicrostg.trasers.com/';
        KEY = 'aRukz1Ps7h6nXgHPUaa0k7faaxx0x3fJ3T4zuH7o';
        break;
    default:
        SITE_URL = PROTOCOL + '://' + 'stagingapi.trasers.com/';
        MICRO_URL = 'https://apimicrostg.trasers.com/';
        KEY = 'xMfLTpvBaR6m0Jcm6i9tB8qtjwH7kuB13rQ3N5nX';
}
const BASEURL = SITE_URL;
const BASEURLN = MICRO_URL

// Dashboard url new screen PHASE_II
export const HOMESCREEN_REPORTS = BASEURL + 'api_trasers/trasers_new_phase2_home_screen';
export const SEARCH_DETAILS = BASEURL + 'api_trasers/trasers_phase2_commonsearch_data?data=';
export const LIBRARY_DETAILS = BASEURL + 'api_trasers/trasers_node_windows_data/';
export const REPORT_DETAILS = BASEURL + 'api_trasers/get_report_details/';


// Dashboard url new screen PHASE_I
// Dashboard URLs
export const LOGIN = BASEURL + 'api_trasers/user/login';
export const FORGOT = BASEURL + 'api_trasers/user/request_new_password';
export const HOMESCREEN = BASEURL + 'api_trasers/trasers_new_homescreen/1';

// export const HOMESCREEN = BASEURL + 'api_trasers/trasers_homescreen';
//export const DETAIL = BASEURL + 'api_trasers/trasers_node_data';
export const DETAIL = BASEURL + 'api_trasers/trasers_node_windows_data';
export const RATE = BASEURL + 'api_trasers/fivestar/rate';
export const ADDTOCART = BASEURL + 'api_trasers/trasers_uccart';
export const ADDTOLIST = BASEURL + 'api_trasers/trasers_product_addto_wl_list';
export const ADDTOMYLIB = BASEURL + 'api_trasers/trasers_add_libarary';
export const LOGOUT = BASEURL + 'api_trasers/user/logout';

export const MY_LIBRARY_NEW = BASEURL + 'api_trasers/trasers_new_listof_mylib_data/'
export const MYLIBRARY = BASEURL + 'api_trasers/my-library';
export const GET_WISHLIST = BASEURL + 'api_trasers/trasers_productaddtolist/';
export const SET_WISHLIST = BASEURL + 'api_trasers/trasers_productaddtolist/';
export const REMOVE_WISHLIST = BASEURL + 'api_trasers/trasers_product_addto_wl_list/';
export const GET_USER_DETAILS = BASEURL + 'api_trasers/getuserdata?uid_raw=';
export const INDUSTRY_REGION = BASEURL + 'api_trasers/trasers_reg_menu_details';
export const COUNTRIES = BASEURL + 'api_trasers/trasers_listof_allcountries';
export const STATES = BASEURL + 'api_trasers/trasers_listof_zone/';
export const UPDATE_PROFILE_DETAILS = BASEURL + 'api_trasers/trasers_usrproedt/';
export const UPDATE_PROFILE_IMAGE = BASEURL + 'api_trasers/trasers_usr_proimg_edit/';
export const CHANGE_PASSWORD = BASEURL + 'api_trasers/trasers_change_user_pwd/';
export const JOB_ROLES = BASEURL + 'api_trasers/trasers_rolesleftscreen';
export const ONE_TIME_SHARE = BASEURL + 'api_trasers/trasers_onetime_share';
export const OTS_DISCOUNT = BASEURL + 'api_trasers/trasers_ots_validation_data';
export const VERSION_CHECK = BASEURL + 'api_trasers/trasers_get_current_windows_version';
export const BUYINGOPTIONSCAL = BASEURL + 'api_trasers/trasers_noof_cartseats/';

export const MYLIBRARYDEL = BASEURL + 'api_trasers/trasers_mylib_article_remove';
export const PURCHASES = BASEURL + 'api_trasers/my-purchased-articles-services';

export const GET_NOTES_DETAILS = BASEURLN + 'Trasers_RetrieveNotes_Service/api/NotesR/GetNotes';
export const SET_NOTES_DETAILS = BASEURLN + 'Trasers_SaveNotes_Service/api/Notes/SaveNotes';
export const GET_FEEBACK_DETAILS = BASEURLN + 'Trasers_RetrieveFeedback_Service/api/Feedback/GetFeedback';
export const SET_FEEBACK_DETAILS = BASEURLN + 'Trasers_SaveFeedback_Service/api/Feedback/SaveFeedback';
export const GET_CUSTOM_RESEARCH_DETAILS = BASEURLN + 'Trasers_RetrieveCustomResearch_Service/api/CustomR/GetCustomResearch';
export const SET_CUSTOM_RESEARCH_DETAILS = BASEURLN + 'Trasers_SaveCustomResearch_Service/api/Custom/SaveCustomResearch';
export const GET_CONTRIBUTENOTES_DETAILS = BASEURLN + 'Trasers_RetrieveContribute_Service/api/Contribute/GetContributeNotes';
export const SET_CONTRIBUTENOTES_DETAILS = BASEURLN + 'Trasers_SaveContribute_Service/api/Contribute/SaveContributeNotes';

export const SYNC_NOTES = BASEURLN + 'Trasers_SaveOfflineNotes_Service/api/OfflineNotes/SaveOfflineNotes';
export const SYNC_FEEDBACKS = BASEURLN + 'Trasers_SaveOfflineFeedback_Service/api/offlineFeedback/SaveOfflineFeedback';
export const SYNC_CN = BASEURLN + 'Trasers_SaveOfflineContribute_Service/api/OfflineContribute/SaveOfflineContributeNotes';
export const SYNC_CR = BASEURLN + 'Trasers_SaveOfflineCustomResearch_Service/api/OfflineCustomResearch/SaveOfflineCustomResearch';

export const GET_NOTES = BASEURLN + 'Trasers_ConsolidatedNotesRetrieve_Service/api/CompleteNotes/GetNotes';
export const GET_FEEDBACKS = BASEURLN + 'Trasers_ConsolidatedFeedbackRetrieve_Service/api/CompleteFeedback/GetFeedback';

export const GET_CN = BASEURLN + 'Trasers_ConsolidatedContributeRetrieve_Service/api/CompleteContribute/GetContribute';
export const GET_CR = BASEURLN + 'Trasers_ConsolidatedCustomResearchRetrieve_Service/api/CompleteCustomResearch/GetCustomResearch';

// Share Notes
export const SHARE_NOTES = BASEURLN + 'Trasers_EmailNotes_Service/api/EmailNotes/SendNotes';
export const SHARE_FEEDBACKS = BASEURLN + 'Trasers_EmailFeedback_Service/api/EmailFeedback/SendFeedback';
export const SHARE_CR = BASEURLN + 'Trasers_EmailCustomResearch_Service/api/EmailCustomResearch/SendCustomResearch';
export const SHARE_CN = BASEURLN + 'Trasers_EmailContribute_Service/api/EmailContribute/SendContribute';

export const TERMS_AND_CONDITIONS = BASEURL + 'api_trasers/legal-static-page';
export const PRIVACY_AND_POLICY = BASEURL + 'api_trasers/legal-static-page';
export const LOGIN_BODY_DETAILS = BASEURL + 'api_trasers/legal-static-page';
export const CONTACT_US = BASEURL + 'api_trasers/all_locations';

export const PAYMENT = BASEURL + 'cart/checkout';

export const INSIGHT_NAVIGATOR_FILTER_LIST = BASEURL + 'api_trasers/trasers_navigatorleftscreen/';
export const SEARCH_INSIGHTS = BASEURL + 'api_trasers/insight-navigator-service';
export const FAQ = BASEURL + 'api_trasers/faqservices';
export const SEND_FEEDBACK = BASEURL + 'api_trasers/trasers_contactus_data';
export const REFERRAL = BASEURL + 'api_trasers/trasers_referral_data';
export const REGISTER = BASEURL + 'api_trasers/user/register';

// AWS SDK APIS - POINTED TO STAGING
// Individual Save
export const ASET_NOTES_DETAILS = 'https://e8trd360pg.execute-api.us-east-1.amazonaws.com/production/api/Notes/SaveNotes';
export const ASET_FEEBACK_DETAILS = 'https://r808z19583.execute-api.us-east-1.amazonaws.com/production/api/Feedback/SaveFeedback';
export const ASET_CUSTOM_RESEARCH_DETAILS = 'https://jc8y4dqac7.execute-api.us-east-1.amazonaws.com/production/api/Custom/SaveCustomresearch';
export const ASET_CONTRIBUTENOTES_DETAILS = 'https://g6ifrue8cl.execute-api.us-east-1.amazonaws.com/production/api/Contribute/SaveContributeNotes';

// Consolidated Sync
export const ASYNC_NOTES = 'https://y7ngy4kz50.execute-api.us-east-1.amazonaws.com/production/api/OfflineNotes/SaveOfflineNotes';
export const ASYNC_FEEDBACKS = 'https://u97dcby8xh.execute-api.us-east-1.amazonaws.com/production/api/offlineFeedback/SaveOfflineFeedback';
export const ASYNC_CR = 'https://q5w4tfhwdk.execute-api.us-east-1.amazonaws.com/production/api/OfflineCustomResearch/SaveOfflineCustomResearch';
export const ASYNC_CN = 'https://2ptrci0536.execute-api.us-east-1.amazonaws.com/production/api/OfflineContribute/SaveOfflineContributeNotes';

// Consolidated Notes Get
export const AGET_NOTES = 'https://awm7aniso8.execute-api.us-east-1.amazonaws.com/production/api/CompleteNotes/GetNotes';
export const AGET_FEEDBACKS = 'https://bp46a060kl.execute-api.us-east-1.amazonaws.com/production/api/CompleteFeedback/GetFeedback';
export const AGET_CR = 'https://dsin76f00m.execute-api.us-east-1.amazonaws.com/production/api/CompleteCustomResearch/GetCustomResearch';
export const AGET_CN = 'https://s4rtxnsg73.execute-api.us-east-1.amazonaws.com/production/api/CompleteContribute/GetContribute';

// Share Notes
export const ASHARE_NOTES = 'https://xwc1rjwtja.execute-api.us-east-1.amazonaws.com/production/api/EmailNotes/SendNotes';
export const ASHARE_FEEDBACKS = 'https://3559q37g5d.execute-api.us-east-1.amazonaws.com/production/api/EmailFeedback/SendFeedback';
export const ASHARE_CR = 'https://md6goc81l1.execute-api.us-east-1.amazonaws.com/production/api/EmailCustomResearch/SendCustomResearch';
export const ASHARE_CN = 'https://i8z9h8z6x3.execute-api.us-east-1.amazonaws.com/production/api/EmailContribute/SendContribute';

export const LIBRARY_DETAILS_JSON = {

    "node_title": "Digital Transformation for CIO in Hi Tech Industry - The Complete Library",

    "node_id": "7938",

    "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Procurement_0.jpg",

    "description": "Digital Transformation for CIO in Hi Tech Industry - The Complete Library includes a combination of 1 TrueNorth Guide and 14 Trasers Reports",

    "product_features": [

        "CIO Reports"

    ],

    "what_included": [

        [

            "True North Guide on Technology Transformations in Hi Tech Industry",

            "CEO Abstracts: Customer Acquisition & Growth, Customer Value Delivery; Customer Value Enablement-HR, Finance & Information Technology",

            "CIO, Digitalization, Analytics, Cloud Infrastructure & Security Libraries",

            "100+ other reports every year",

            "Podcasts and Webinars",

            "Ability to customize reports and add your material for Board and other presentations",

            "4 to 6 free hours for discussions with Analysts",

            "Access to Trasers+ Transformation Leaders Networking Site"

        ]

    ],

    "included_reports": [

        {

            "title": "Compass Guide for Global Hi-Tech Analytics - IT",

            "node_id": "5239",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_35.JPG",

            "date": "24 Sep, 2018",

            "rating": 5,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Compass Guide for Global Hi-Tech Digital - IT",

            "node_id": "5280",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_40.JPG",

            "date": "24 Sep, 2018",

            "rating": 5,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Compass Guide for Global Hi-Tech Security - IT",

            "node_id": "5304",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_56.JPG",

            "date": "24 Sep, 2018",

            "rating": 5,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "TrueNorth Guide for Hi-Tech - IT?",

            "node_id": "5895",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_99.JPG",

            "date": "26 Sep, 2018",

            "rating": 5,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Abstracts for CEOs: Customer Acquisition & Growth in Hi-tech",

            "node_id": "8001",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Trasers-2019-CEO-TrueNorth-HiTech_Abstracts_Customer_Acq_Growth_v5.6-1_2.jpg",

            "date": "31 Oct, 2018",

            "rating": 0,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Abstracts for CEOs: Customer Value Enablement :Human Capital in Hi-Tech",

            "node_id": "8016",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Trasers-2019-CEO-TrueNorth_Abstracts_Customer_Enablement_HCM-Hi-Tech-v5.5-1.jpg",

            "date": "31 Oct, 2018",

            "rating": 0,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Abstracts for CEOs : Customer Value Delivery in Hi-Tech",

            "node_id": "8039",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_1149.JPG",

            "date": "31 Oct, 2018",

            "rating": 5,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        },

        {

            "title": "Compass Guide for Global Hi-Tech Cloud - IT",

            "node_id": "8113",

            "product_id": "7938",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/2019-Global-Hi-Tech-Compass-Cloud-v10.1-%28TTNOTE0809201813%29-1_0.jpg",

            "date": "6 Nov, 2018",

            "rating": 0,

            "isroleaccess": "False",

            "isspot": "False",

            "isaddedtolist": "False"

        }

    ],

    "related_library": [

        {

            "title": "Business Transformation for Marketing in Hi-Tech - The Complete Library",

            "product_id": "6634",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Marketing_0.jpg"

        },

        {

            "title": "Business Transformation for Sales Management in Hi-Tech - The Complete Library",

            "product_id": "6662",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Sales_0.jpg"

        },

       {

            "title": "Business Transformation for Research and Development in Hi-Tech - The Complete Library",

            "product_id": "6676",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-R%26D-Product-Development_0.jpg"

        },

        {

            "title": "Business Transformation for Supply chain in Hi-Tech - The Complete Library",

            "product_id": "6690",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Supply-Chain-Management_0.jpg"

        },

        {

            "title": "Business Transformation for Procurement in Hi-Tech - The Complete Library",

            "product_id": "6704",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Procurement_1.jpg"

        },

        {

            "title": "Business Transformation for Manufacturing in Hi-Tech - The Complete Library",

            "product_id": "6718",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Manufacturing_0.jpg"

        },

        {

            "title": "Business Transformation for Finance and Accounting in Hi-Tech - The Complete Library",

            "product_id": "6828",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Finance-and-Accounting_0.jpg"

        },

        {

            "title": "Business Transformation for Human Capital in Hi-Tech - The Complete Library",

            "product_id": "6842",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Human-Capital_0.jpg"

        },

        {

            "title": "Business Transformation for Legal in Hi-Tech - The Complete Library",

            "product_id": "6856",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Legal_0.jpg"

        },

        {

            "title": "Technology Transformation for Cloud in Hi-Tech - The Complete Library",

            "product_id": "6870",

            "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Marketing.jpg"

        }

    ],

    "payment_options": [

        {

            "option_name": "1 Year",

            "price": "41400.00000",

            "oid": "1",

            "aid": "1"

        },

        {

            "option_name": "2 Years",

            "price": "82800.00000",

            "oid": "3",

            "aid": "1"

        },

        {

            "option_name": "3 Years",

            "price": "121900.00000",

            "oid": "4",

            "aid": "1"

        }

    ],

    "additional_seats_options": [

        {

            "option_name": "0",

            "price": "10.00000",

            "oid": "36",

            "aid": "2"

        },

        {

            "option_name": "2",

            "price": "10.00000",

            "oid": "5",

            "aid": "2"

        },

        {

            "option_name": "3",

            "price": "10.00000",

            "oid": "18",

            "aid": "2"

        },

        {

            "option_name": "4",

            "price": "10.00000",

            "oid": "19",

            "aid": "2"

        },

        {

            "option_name": "5",

            "price": "10.00000",

            "oid": "6",

            "aid": "2"

        },

        {

            "option_name": "6",

            "price": "10.00000",

            "oid": "20",

            "aid": "2"

        },

        {

            "option_name": "7",

            "price": "10.00000",

            "oid": "21",

            "aid": "2"

        },

        {

            "option_name": "8",

            "price": "10.00000",

            "oid": "22",

            "aid": "2"

        },

        {

            "option_name": "9",

            "price": "10.00000",

            "oid": "23",

            "aid": "2"

        },

        {

            "option_name": "10",

            "price": "10.00000",

            "oid": "24",

            "aid": "2"

        },

        {

            "option_name": "11",

            "price": "10.00000",

            "oid": "25",

            "aid": "2"

        },

        {

            "option_name": "12",

            "price": "10.00000",

            "oid": "27",

            "aid": "2"

        },

        {

            "option_name": "13",

            "price": "10.00000",

            "oid": "28",

            "aid": "2"

        },

        {

            "option_name": "14",

            "price": "10.00000",

            "oid": "29",

            "aid": "2"

        },

        {

            "option_name": "15",

            "price": "10.00000",

            "oid": "30",

            "aid": "2"

        },

        {

            "option_name": "16",

            "price": "10.00000",

            "oid": "31",

            "aid": "2"

        },

        {

            "option_name": "17",

            "price": "10.00000",

            "oid": "32",

            "aid": "2"

        },

        {

            "option_name": "18",

            "price": "10.00000",

            "oid": "33",

            "aid": "2"

        },

        {

            "option_name": "19",

            "price": "10.00000",

            "oid": "34",

            "aid": "2"

        },

        {

            "option_name": "20",

            "price": "10.00000",

            "oid": "35",

            "aid": "2"

        }

    ],

    "hour_options": [

        {

            "option_name": "0",

            "price": "10.00000",

            "oid": "37",

            "aid": "3"

        },

        {

            "option_name": "1",

            "price": "10.00000",

            "oid": "7",

            "aid": "3"

        },

        {

            "option_name": "2",

            "price": "10.00000",

            "oid": "8",

            "aid": "3"

        },

        {

            "option_name": "3",

            "price": "10.00000",

            "oid": "9",

            "aid": "3"

        },

        {

            "option_name": "4",

            "price": "10.00000",

            "oid": "10",

            "aid": "3"

        },

        {

            "option_name": "5",

            "price": "10.00000",

            "oid": "11",

            "aid": "3"

        },

        {

            "option_name": "6",

            "price": "10.00000",

            "oid": "12",

            "aid": "3"

        },

        {

            "option_name": "7",

            "price": "10.00000",

            "oid": "13",

            "aid": "3"

        },

        {

            "option_name": "8",

            "price": "10.00000",

            "oid": "14",

            "aid": "3"

        },

        {

            "option_name": "9",

            "price": "10.00000",

            "oid": "15",

            "aid": "3"

        },

        {

            "option_name": "10",

            "price": "10.00000",

            "oid": "16",

            "aid": "3"

        }

    ]

}