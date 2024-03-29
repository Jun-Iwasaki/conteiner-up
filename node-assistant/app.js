let http = require('http');
let url = require('url');

// サーバ機能の初期化
let server = http.createServer();

server.listen(8080);

server.on('request', function(req, res)
{
    if (req.method == 'GET')
    {
        let content = url.parse(req.url, true); 
        // .queryに配列としてパラメータとデータが入っている
        //res.write('age = ' + content.query['age'] + '\n');
        //res.end();
    } else if (req.method === 'POST') {
        var data = '';
    
   //POSTデータを受けとる
        req.on('data', function(chunk) {data += chunk})
        .on('end', function() {
 
        parsedPostResponse = JSON.parse(data);
        console.log(parsedPostResponse);

// ここから
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// NOTE: you must manually enter your API_KEY below using information retrieved from your IBM Cloud
const API_KEY = "QeQNQ2xfuz_2F05HDWu5bUHglFwysxL7Ir9r8yzpGuT9";

function getToken(errorCallback, loadCallback) {
        const req = new XMLHttpRequest();
        req.addEventListener("load", loadCallback);
        req.addEventListener("error", errorCallback);
        req.open("POST", "https://iam.cloud.ibm.com/identity/token");
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Accept", "application/json");
        req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", loadCallback);
        oReq.addEventListener("error", errorCallback);
        oReq.open("POST", scoring_url);
        oReq.setRequestHeader("Accept", "application/json");
        oReq.setRequestHeader("Authorization", "Bearer " + token);
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        oReq.send(payload);
}

getToken((err) => console.log(err), function () {
        let tokenResponse;
        try {
                tokenResponse = JSON.parse(this.responseText);
        } catch(ex) {
                // TODO: handle parsing exception
        }
        // POSTされたJSONから年代,カテゴリー,商品IDを取得
        const input_age = parsedPostResponse.age;
        const input_product = parsedPostResponse.product;
        const input_category = parsedPostResponse.category;
        // NOTE: 併売分析モデルに渡すJSONを作成
        const payload = '{"input_data": [{"fields": ["会員ID","年代","商品中分類","商品ID"],"values": [[1,"' + input_age + '","' + input_category + '","' + input_product + '"]]}]}'
        // const payload = '{"input_data": [{"fields": ["会員ID","年代","商品中分類","商品ID"],"values": [[1,"' + input_age + '","婦人服03",9900172]]}]}';
        console.log(payload);
        // 併売分析スコアリングonline
        const scoring_url = "https://jp-tok.ml.cloud.ibm.com/ml/v4/deployments/e5733118-adc0-4932-849b-d965867cb7a7/predictions?version=2022-08-04";
        apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
                let parsedPostResponse;
                try {
                        parsedPostResponse = JSON.parse(this.responseText);
                } catch (ex) {
                        // TODO: handle parsing exception
                }
                console.log("Scoring response");
                // console.log(parsedPostResponse.predictions[0].values[0][1]);
                // console.log(parsedPostResponse.predictions[0].values[0]);
                console.log(parsedPostResponse.predictions[0]);
                res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
                res.write(JSON.stringify(parsedPostResponse));
                res.end();
        }, function (error) {
                console.log(error);
        });
});
// ここまで
      })
    }
});
