import AWS from 'aws-sdk';

const albumBucketName = "dataspan.frontend-home-assignment";

AWS.config.region = "eu-central-1"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName },
});

export const getCoordinatesData = (key) => {
    return new Promise((resolve, reject) => {
        s3.getObject({ Key: key }, (err, data) => {
            if (err) {
                reject(new Error(`Error fetching label content: ${err.message}`));
            } else {
                resolve(data.Body.toString('utf-8'));
            }
        });
    });
}

export const fetchPhotosForEachGroup = async (groupPhotosKey) => {
    const [ images, thumbnails, labels ] = await Promise.all([
        s3.listObjects({ Prefix: `${groupPhotosKey}images/`, MaxKeys: 200 }).promise(),
        s3.listObjects({ Prefix: `${groupPhotosKey}thumbnails/`, MaxKeys: 200 }).promise(),
        s3.listObjects({ Prefix: `${groupPhotosKey}labels/` }).promise()
    ])

    const transformedImage = []

    for (let index = 0; index < (images?.Contents ?? []).length; index++)  {
        const image = images?.Contents?.[index] ?? {};
        const  photoKey = image.Key;
        const thumbnail = thumbnails?.Contents?.[index] ?? {}
        const label = labels?.Contents?.[index]?? {}

        const baseURL = `https://s3.${AWS.config.region}.amazonaws.com/${albumBucketName}/`

        transformedImage.push({
            photoKey,
            photoUrl: baseURL + encodeURIComponent(photoKey),
            photoName: photoKey.split('/').at(-1),
            thumbnailKey:  thumbnail.Key,
            thumbnailUrl: baseURL + encodeURIComponent(thumbnail.Key),
            labelUrl: baseURL + encodeURIComponent(label.Key),
            labelKey: label.Key
        })
    }

    return transformedImage
}

export const fetchS3Photos = (albumPhotosKey) => new Promise((resolve, reject) => {
    Promise.all(
        ['train', 'valid', 'test'].map(group => fetchPhotosForEachGroup(`${albumPhotosKey}${group}/`))
    ).then((responses) => {
        console.log(responses)
        resolve({
            train: responses[0],
            test: responses[1],
            value: responses[2]
        })
    }).catch((err) => {
        reject(err)
    })
})

export const fetchS3Albums = () => {
    return new Promise((resolve, reject) => {
      s3.listObjectsV2({ Delimiter: "/" }, (err, data) => {
        console.log(err, data);
        if (err) {
            reject(new Error(`Could not fetch your album from S3: ${err.message}`));
        } else {
            const imageUrls = data.CommonPrefixes.map(function (commonPrefix) {
                const prefix = commonPrefix.Prefix
                const albumName = decodeURIComponent(prefix.replace("/", ""))

                const albumPhotosKey = encodeURIComponent(albumName) + "/";

                return {
                    prefix,
                    albumName,
                    fetchImages: fetchS3Photos(albumPhotosKey)
                }
            });

            Promise.all(imageUrls.map(({ fetchImages }) => fetchImages)).then((responses) => {
                console.log(responses);
                resolve(imageUrls.map((values, index) => ({ ...values, folders: responses[index] })));
            })
        }
      });
    });
};
