<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


// Route::post('/getMyBooking', 'SessionController@getMyBooking');
Route::namespace('App\\Http\\Controllers')->group(function () {

    //SMTP API
    Route::post('saveConfiguration', 'SmtpController@saveConfiguration');
    Route::get('getSmtpConfiguration/{shopDomain}', 'SmtpController@getSmtpConfiguration');

    //CUSTOMER API
    Route::get('ifCustomerExists/{shopDomain}', 'SettingsController@ifCustomerExists');
    Route::post('saveCustomer', 'SettingsController@saveCustomer');

    //COUPON API
    Route::get('getCouponDetails/{shopDomain}/{couponCode}', 'CouponController@getCouponDetails');

    //SETTINGS API
    Route::post('saveSettings', 'SettingsController@saveSettings');
    Route::get('getSettingsData/{shopDomain}', 'SettingsController@getSettingsData');

    //PLANS API
    Route::post('basicPlanApi/{shopDomain}', 'PlanController@basicPlanApi');
    Route::post('tryonPlanApi/{shopDomain}', 'PlanController@tryonPlanApi');
    Route::get('ifPlanIdExists/{shopDomain}', 'PlanController@ifPlanIdExists');

    //IMPORT API
    Route::post('importApi', 'ImportController@importApi');
    Route::get('getImportData/{shopDomain}', 'ImportController@getImportData');
    Route::post('csvImportApi', 'ImportController@csvImportApi');
    Route::post('jsonImportApi', 'ImportController@jsonImportApi');
    Route::get('getCsvFile', 'ImportController@getCsvFile');

    //INIT TOOL API
    Route::post('initToolApi', 'InitToolController@initToolApi');

    //RING EMAIL API
    Route::post('dropHintApi', 'RingEmailController@dropHintApi');
    Route::post('reqInfoApi', 'RingEmailController@reqInfoApi');
    Route::post('emailFriendApi', 'RingEmailController@emailFriendApi');
    Route::post('scheViewApi', 'RingEmailController@scheViewApi');

    //DIAMOND EMAIL API
    Route::post('dlDropHintApi', 'DiamondEmailController@dlDropHintApi');
    Route::post('dlReqInfoApi', 'DiamondEmailController@dlReqInfoApi');
    Route::post('dlEmailFriendApi', 'DiamondEmailController@dlEmailFriendApi');
    Route::post('dlScheViewApi', 'DiamondEmailController@dlScheViewApi');

    //COMPLETE RING EMAIL API
    Route::post('crDropHintApi', 'CompleteRingEmailController@crDropHintApi');
    Route::post('crReqInfoApi', 'CompleteRingEmailController@crReqInfoApi');
    Route::post('crEmailFriendApi', 'CompleteRingEmailController@crEmailFriendApi');
    Route::post('crScheViewApi', 'CompleteRingEmailController@crScheViewApi');

    //ADD TO CART
    Route::post('addToCart', 'AddToCartController@addToCart');

    //ADD TO PDF DOWNLOAD
    Route::get('printDiamond/{shop}/{pairId}', 'AddToCartController@printDiamond');

    //ADD TO PDF DOWNLOAD WITH RING
    // Route::get('printRingDiamond/{shop}/{diamond_id}/{second_diamond_id}/{setting_id}', 'AddToCartController@printRingDiamond');
    Route::get('printDiamondandStud/{shop}/{pairId}/{setting_id}', 'AddToCartController@printDiamondandStud');

    //GET PRODUCTS API
    Route::post('getProducts', 'ProductController@getProducts');

    //GET PRODUCT DETAILS API
    Route::get('getProductDetails/{shop}/{product_id}/{variant_id}', 'AddToCartController@getProductDetails');

    //GET METAFIELDS API
    Route::post('getMetafields/{shop}/{product_id}', 'SettingsController@getMetafields');

    //GET CURRENT VERSION API
    Route::get('getCurrentVersion', 'SettingsController@getCurrentVersion');

    //GET SUCCESS FILE CONTENT API
    Route::get('getSuccessFileContent/{shop}', 'ImportController@getSuccessFileContent');

    //GET FAILED FILE CONTENT API
    Route::get('getFailedFileContent/{shop}', 'ImportController@getFailedFileContent');

    //DELETE FILEs API
    Route::post('clearAllLogs/{shop}', 'ImportController@clearAllLogs');
    Route::get('getProduct/{shop}', 'ImportController@getProduct');

    //SAVE CSS CONFIGURATION DATA
    Route::post('saveCSSConfiguration', 'SettingsController@saveCSSConfiguration');
    Route::get('getCSSConfiguration/{shop}', 'SettingsController@getCSSConfiguration');

    //UNINSTALL APP JOB
    Route::post('appUninstallJob', 'InitToolController@appUninstallJob');
    Route::post('appShopUpdateJob', 'InitToolController@appShopUpdateJob');

    Route::post('/requestEndpoint', 'CustomerEndpointController@requestEndpoint');
    Route::post('/erasureEndpoint', 'CustomerEndpointController@erasureEndpoint');
    Route::post('/shopErasureEndpoint', 'CustomerEndpointController@shopErasureEndpoint');

    Route::get('getStudDetailsApi/{stud_id}/{shop}/{show_retailer_info}', 'RingEmailController@getStudDetailsApi');
    Route::get('getDiamondDetailsApi/{diamond_id}/{shop}/{show_retailer_info}', 'DiamondEmailController@getDiamondDetailsApi');
});
