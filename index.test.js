'use strict'

const { handler } = require('./index.js');

describe('Testing Event Trigger', () => {
  test('Should respond to an upload', async () => {
    let event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'lab17-easleyjs-images'
            },
            object: {
              key: 'images/profile_pic.jpg'
            }
          }
        }
      ]
    }

    let response = await handler(event);
    expect(response.statusCode).toEqual(200);
  });
})

describe('Testing Images.json Upload', () => {
  test('Should be able to update the Images.json file without errors', () => {
      
  })
})