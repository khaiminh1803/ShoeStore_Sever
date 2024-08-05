const axios = require('axios');
const crypto = require('crypto');
const config = require('../../middle/config');

exports.createPayment = async (req, res) => {
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  var amount = req.body.amount;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;

  var rawSignature = 
    'accessKey=' + accessKey +
    '&amount=' + amount +
    '&extraData=' + extraData +
    '&ipnUrl=' + ipnUrl +
    '&orderId=' + orderId +
    '&orderInfo=' + orderInfo +
    '&partnerCode=' + partnerCode +
    '&redirectUrl=' + redirectUrl +
    '&requestId=' + requestId +
    '&requestType=' + requestType;

  var signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

exports.callback = async (req, res) => {
  console.log('callback: ');
  console.log(req.body);
  return res.status(204).json(req.body);
};

exports.checkStatusTransaction = async (req, res) => {
  const { orderId } = req.body;

  var secretKey = config.secretKey;
  var accessKey = config.accessKey;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${config.partnerCode}&requestId=${orderId}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: config.partnerCode,
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};
