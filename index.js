const { S3Client, GetObjectCommand, PutObjectCommand, S3 } = require('@aws-sdk/client-s3'); // code preinstalled by AWS, to do S3 operations -> Reading and Writing

let s3client = new S3({ region: 'us-west-2' });

// utility function to go through the existing array of images, and update/replace if it finds an identical existing one.
function updateImageArr( imageArr, imageObj ) {
    return imageArr.map( ( img ) => {
        if ( img.fileName === imageObj.fileName ) {
            return imageObj
        }
        return img;
    })
}

exports.handler = async (event) => {

let imgCatalogPath = {
    Bucket: 'lab17-easleyjs-images',
    Key: 'images.json'
}

  // load images.json
  const imgCatalog = await s3client.getObject(imgCatalogPath);
  let imgCatalogJSON = JSON.parse(imgCatalog);

  // get image info from trigger event
  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = event.Records[0].s3.object.key;
  const fileSize = event.Records[0].s3.object.size;
  const fileType = String(event.Records[0].s3.object.key).replace(/.+(.{3})$/, "$1").toUpperCase();

  // specify bucket/file path to get new image
  const command = {
    Bucket: bucketName,
    Key: fileName
  }
  let result = await s3client.getObject(command);

  let img = await result.Body.transformToString();

  const imgObj = {
    img,
    fileName,
    fileSize,
    fileType
  }

  // Add image from event into imgCatalog JSON when applicable
  imgCatalogJSON = updateImageArr( imgCatalogJSON, imgObj );

  // Write JSON back to s3
  

  //console.log(event.Records[0].s3.object);

  //console.log(string);
/*
  console.log('Bucket name:', bucketName);
  console.log('File name:', fileName);
*/
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Added ' + fileName + ' to the manifest'),
  }; // lambdas use some of the same practices that HTTP servers.
  return response;
};