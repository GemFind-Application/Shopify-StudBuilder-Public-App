<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Webhook;
use Mail;
use DB;

class AfterAuthenticateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $shopDomain;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($shopDomain)
    {
        $this->shopDomain = $shopDomain['name'];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $path = public_path();
        $shop = User::where('name', $this->shopDomain)->firstOrFail();
        $theme = $shop->api()->rest('GET', '/admin/shop.json')['body'];
        file_put_contents($path . '/heythere.txt', json_encode($theme));
        $theme_data = json_encode($theme);
        $finalData = json_decode($theme_data);
        $updateData = [
            // 'email' => $finalData->shop->email,
            'phone' => $finalData->shop->phone,
            'province' => $finalData->shop->province,
            'country' => $finalData->shop->country,
            'address1' => $finalData->shop->address1,
            'city' => $finalData->shop->city,
        ];
        User::where('name', $this->shopDomain)->update($updateData);
        //ADDING DYNAMIC CSS CONFIGURATION START
        $css_configuration_data = [
            'shop' => $shop->name,
            'link' => '#999',
            'header' => '#000000',
            'button' => '#000022',
            'slider' => '#828282',
            'hover' => '#92cddc',
            'created_at' => date('Y-m-d'),
        ];
        DB::table('css_configuration')->insert($css_configuration_data);
        //ADDING DYNAMIC CSS CONFIGURATION END

        //ADDING WEBHOOK AND SCRIPTTAG START
        $api_key = env('VITE_SHOPIFY_API_KEY');
        $data['webhook'] = array(
            'topic' => 'app/uninstalled',
            'address' => env('APP_URL') . 'api/appUninstallJob',
            'format' => 'json'
        );
        $data_string = json_encode($data);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        $url = 'https://' . $api_key . ':' . $shop->password . '@' . $shop->name . '/admin/api/' . env('SHOPIFY_API_VERSION') . '/webhooks.json';
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        $output = curl_exec($ch);

        // $data['script_tag'] = array(
        //     "event"     => "onload",
        //     'src'       => env('APP_URL')."widgets/static/js/bundle.js",
        // );
        // $data_string = json_encode($data);
        // $ch = curl_init();
        // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        // curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        // $url = 'https://'.$api_key.':'.$shop->password.'@'.$shop->name.'/admin/api/2023-01/script_tags.json';
        // curl_setopt($ch, CURLOPT_URL,$url);
        // curl_setopt($ch, CURLOPT_HEADER, false);
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-Type:application/json'));
        // $output = curl_exec($ch);
        //ADDING WEBHOOK AND SCRIPTTAG END

        file_put_contents($path . '/authenticate.txt', $theme_data);
        $data = [
            'id' => $finalData->shop->id,
            'name' => $finalData->shop->name,
            'domain' => $finalData->shop->domain,
            'email' => $finalData->shop->email,
            'created_at' => $finalData->shop->created_at,
            'updated_at' => $finalData->shop->updated_at,
        ];
        $user['to'] = ['dev@gemfind.com', 'support@gemfind.com', 'billing@gemfind.com', 'sales@gemfind.com', 'appinstall@gemfind.com'];

        Mail::send('installEmail', $data, function ($messages) use ($user) {
            $messages->to($user['to']);
            $messages->subject('GemFind StudBuilderⓇ App Install');
        });
        $domain = $finalData->shop->domain;

        $arr = [
            'filters' => [
                [
                    'propertyName' => 'email',
                    'operator' => 'EQ',
                    'value' => $finalData->shop->email,
                ],
            ],
        ];
        $post_json = json_encode($arr);

        $file = 'newarray_log.txt';
        file_put_contents($file, $post_json);

        $email_id = $finalData->shop->email;
        $endpoint = 'https://api.hubapi.com/contacts/v1/contact/email/' . $email_id . '/profile';
        $ch = curl_init();
        $headers = ['Content-Type: application/json', 'Authorization: Bearer ' . env('YOUR_ACCESS_TOKEN')];
        //curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_json);
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_errors = curl_error($ch);
        curl_close($ch);

        $file = $domain . 'customer_status_log' . time() . '.txt';
        file_put_contents($file, $status_code);

        $file = $domain . 'customer_response_log' . time() . '.txt';
        file_put_contents($file, $response);

        $current_date = date('Y-m-d H:i:s');

        if ($status_code == 200) {
            $arr1 = [
                'properties' => [
                    [
                        'property' => 'email',
                        'value' => $finalData->shop->email,
                    ],
                    [
                        'property' => 'Install_Date',
                        'value' => $current_date,
                    ],
                    [
                        'property' => 'app_status',
                        'value' => 'INSTALL-STUDBUILDER',
                    ],
                ],
            ];
            $post_json1 = json_encode($arr1);
            $email_id1 = $finalData->shop->email;
            $endpoint1 = 'https://api.hubapi.com/contacts/v1/contact/email/' . $email_id1 . '/profile';

            $ch1 = curl_init();
            $headers = ['Content-Type: application/json', 'Authorization: Bearer ' . env('YOUR_ACCESS_TOKEN')];
            curl_setopt($ch1, CURLOPT_POST, true);
            curl_setopt($ch1, CURLOPT_POSTFIELDS, $post_json1);
            curl_setopt($ch1, CURLOPT_URL, $endpoint1);
            curl_setopt($ch1, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
            $response1 = curl_exec($ch1);
            $status_code1 = curl_getinfo($ch1, CURLINFO_HTTP_CODE);
            $curl_errors1 = curl_error($ch1);
            curl_close($ch1);

            $file = $domain . 'customer_re_register_status_log' . time() . '.txt';
            file_put_contents($file, $status_code1);

            $file = $domain . 'customer_re_register_response_log' . time() . '.txt';
            file_put_contents($file, $response1);
        } else {
            $arr2 = [
                'properties' => [
                    [
                        'property' => 'email',
                        'value' => $finalData->shop->email,
                    ],
                    [
                        'property' => 'shop_name',
                        'value' => $finalData->shop->name,
                    ],
                    [
                        'property' => 'domain_name',
                        'value' => $finalData->shop->domain,
                    ],
                    [
                        'property' => 'phone',
                        'value' => $finalData->shop->phone,
                    ],
                    [
                        'property' => 'state',
                        'value' => $finalData->shop->province,
                    ],
                    [
                        'property' => 'country',
                        'value' => $finalData->shop->country_name,
                    ],
                    [
                        'property' => 'address',
                        'value' => $finalData->shop->address1,
                    ],
                    [
                        'property' => 'city',
                        'value' => $finalData->shop->city,
                    ],
                    [
                        'property' => 'Install_Date',
                        'value' => $current_date,
                    ],
                    [
                        'property' => 'app_status',
                        'value' => 'INSTALL-STUDBUILDER',
                    ],
                ],
            ];
            $post_json2 = json_encode($arr2);
            $file = 'newpost_data_log3.txt';
            file_put_contents($file, $post_json2);
            $endpoint2 = 'https://api.hubapi.com/contacts/v1/contact';
            $ch2 = curl_init();
            $headers = ['Content-Type: application/json', 'Authorization: Bearer ' . env('YOUR_ACCESS_TOKEN')];
            curl_setopt($ch2, CURLOPT_POST, true);
            curl_setopt($ch2, CURLOPT_POSTFIELDS, $post_json2);
            curl_setopt($ch2, CURLOPT_URL, $endpoint2);
            curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            $response2 = curl_exec($ch2);
            $status_code2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
            $curl_errors2 = curl_error($ch2);
            curl_close($ch2);
            // echo "<pre>"; print_r($response2); exit();
            $file = $domain . 'customer_register_response_log' . time() . '.txt';
            file_put_contents($file, $response2);
            $file = $domain . 'customer_register_status_log' . time() . '.txt';
            file_put_contents($file, $status_code2);
            return;
        }

        // echo "test";exit;
        // $API_KEY =$this->config->item('api_key');
        // $SECRET = $this->config->item('shared_secret');
        // $STORE_URL = $shop_domain;
        // $params = $_GET;

        // $TOKEN = $shop_access_token;
        // $url = 'https://'. $API_KEY . ':' . md5($SECRET . $TOKEN) . '@' . $STORE_URL . '/admin/webhooks.json';
        // $paramshook = array("Webhook" => array( "topic"=>"app/uninstalled",
        //    "address"=> base_url()."Webhook/setShopifyUninstall",
        //    "format"=> "json"));

        // $session = curl_init();

        // curl_setopt($session, CURLOPT_URL, $url);
        // curl_setopt($session, CURLOPT_POST, 1);
        // curl_setopt($session, CURLOPT_POSTFIELDS, stripslashes(json_encode($paramshook)));
        // curl_setopt($session, CURLOPT_HEADER, false);
        // curl_setopt($session, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json', 'X-Shopify-Access-Token: '.$TOKEN));
        // curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

        // $result = curl_exec($session);

        // curl_close($session);
        //     // Store the access token
        // $result = json_decode($result, true);
    }
}
