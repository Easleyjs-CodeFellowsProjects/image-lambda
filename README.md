# image-lambda
//https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html#with-s3-example-test-dummy-event


to-do:
make sure file write works

## Dependencies
aws-sdk jest

## How to Use
Lambda should trigger and update the images.json file when a new image is added to the /images folder in the S3 bucket.

## Image URL


## Requirements

**When an image is uploaded to your S3 bucket, it should trigger a Lambda function which must:**
- Download a file called “images.json” from the S3 Bucket if it exists.
- The images.json should be an array of objects, each representing an image. Create an empty array if this file is not present.

**Create a metadata object describing the image.**
- Name, Size, Type, etc.
- Append the data for this image to the array.
- Upload the images.json file back to the S3 bucket.

Note: If the image is a duplicate name, update the object in the array, don’t just add it.