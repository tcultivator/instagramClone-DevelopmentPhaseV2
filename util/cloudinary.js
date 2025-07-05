const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'debbskjyl',
    api_key: '729295391853551',
    api_secret: 'oGDvlGSZojU_xszqS4PjxODzX5o'
})

module.exports = cloudinary