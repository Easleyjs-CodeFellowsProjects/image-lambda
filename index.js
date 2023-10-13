const { S3 } = require('@aws-sdk/client-s3'); // code preinstalled by AWS, to do S3 operations -> Reading and Writing

let s3client = new S3({ region: 'us-west-2' });

function updateImgCatalog(imgCatalog, imgObj) {
  if ( imgCatalog.length === 0) {
    return [ imgObj ]
  }
  let filteredArr = imgCatalog.filter(img => img.fileName !== imgObj.fileName);
  return [ ...filteredArr, imgObj ];
}

exports.handler = async (event) => {

  let imgCatalogPath = {
      Bucket: 'lab17-easleyjs-images',
      Key: 'images.json'
  }
  
  // load images.json
  let imgCatalog = null;

  try {
    const result = await s3client.getObject(imgCatalogPath);
    const imgResultString = await result.Body.transformToString();
    const imgJson = JSON.parse(imgResultString);

    imgCatalog = Array.isArray(imgJson) ? imgJson : [];
  } catch(e) {
    console.log('images.json not found. Creating new file.')
  }

  //get image from event. Add to imgCatalog
  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = event.Records[0].s3.object.key;
  const fileSize = event.Records[0].s3.object.size;
  const fileType = fileName.match(/.{3}$/)[0].toUpperCase();

  const imgObj = {
    bucketName,
    fileName,
    fileSize,
    fileType
  }

  const updatedImgCatalog = updateImgCatalog(imgCatalog, imgObj);

  // Add image from event into imgCatalog JSON when applicable
  const imgCatalogStr = JSON.stringify(updatedImgCatalog);

  // Write JSON back to s3

  const putCommand = {
    Bucket: "lab17-easleyjs-images",
    Key: "images.json",
    Body: imgCatalogStr,
  };

  await s3client.putObject( putCommand );

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};