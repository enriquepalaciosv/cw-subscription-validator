const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
let response;

exports.lambdaHandler = async (event, context) => {
  try {
    await getUser(event.cognitoId).then((data) => {
      // const user = data.Items[0];
      console.log("the element is", event, data);
      response = {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    });
  } catch (err) {
    console.log("the error is", err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    };
    return err;
  }

  return response;
};

function getUser(cognitoId) {
  var params = {    
    ExpressionAttributeValues: {
      ":theId": { S: "" },
      ":cognitoId": { S: cognitoId },
    },
    ProjectionExpression: 'cognitoId, email, subscription, createdAt, id',
    KeyConditionExpression: "size(id) > 0 AND cognitoId = :cognitoId",
    TableName: process.env.TABLE_NAME
  };

  return docClient.query(params).promise();
}
