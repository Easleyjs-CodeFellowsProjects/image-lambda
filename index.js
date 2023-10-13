const { S3 } = require('@aws-sdk/client-s3'); // code preinstalled by AWS, to do S3 operations -> Reading and Writing

let s3client = new S3({ region: 'us-west-2' });

// utility function to go through the existing array of images, and update/replace if it finds an identical existing one.
function updateImageArr( imageArr, imageObj ) {

    if ( imageArr.length === 0 ) {
      console.log('Empty array input.')
      return [ imageObj ];
    }

    return imageArr.map(( img ) => {
      console.log('Non-empty array input.');
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
  let imgCatalog = []

  try {
    const imgJsonResult = await s3client.getObject(imgCatalogPath);
    let imgJsonResultString = await imgJsonResult.Body.transformToString();
    imgJsonResultString = JSON.parse(imgJsonResultString);

    imgCatalog = Array.isArray(imgJsonResultString) ? imgJsonResultString : [];
  } catch(e) {
    console.log('images.json not found. Creating new file.')
  }

  // get image info from trigger event
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

  // Add image from event into imgCatalog JSON when applicable
  imgCatalogJSON = JSON.stringify( updateImageArr( imgCatalog, imgObj ));

  // Write JSON back to s3

  const putCommand = {
    Bucket: "lab17-easleyjs-images",
    Key: "images.json",
    Body: imgCatalogJSON,
  };

  await s3client.putObject( putCommand );
  
  const response = {
    statusCode: 200,
    body: JSON.stringify('Added ' + fileName + ' to the manifest'),
  }; // lambdas use some of the same practices that HTTP servers.
  return response;
};