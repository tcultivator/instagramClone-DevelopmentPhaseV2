const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const upload = require('./middleware/multer');
const cloudinary = require('./util/cloudinary')

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://tcultivator.github.io',
    credentials: true
}))
app.use(cookieparser())
let port = 8080
const db = mysql.createConnection({
     host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})
const secret = 'test'
db.connect((err) => {
    if (err) {
        console.log('database is not connected')
    }
    else {
        console.log('database is connected')
    }
})
app.post('/loginReq', (req, res) => {
    const userData = req.body
    const query = 'SELECT * FROM accounts WHERE username = ? && password = ?'
    db.query(query, [userData.username, userData.password], (err, result) => {
        if (!result.length) {
            console.log('walang nakuha')
            res.status(401).json({ message: 'Error Login' })
        } else {
            const returnData = result[0]
            const token = jwt.sign({ userID: returnData.id, username: returnData.username }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' })
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            res.status(200).json({ message: 'Success login' })

        }
    })
})


function authenticate(req, res, next) {
    const token = req.cookies.token
    console.log(req.cookies)
    console.log(req.cookies.token)
    if (!token) {
        console.log('eto ung token sa loob ng auth ', token)

        res.status(401).json({ message: 'unauthorize user! hhahaha' })
    } else {
        const verifiedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        req.userId = verifiedToken.userID;
        req.username = verifiedToken.username;
        next()
    }


}

app.post('/authenticate', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    console.log('eto na ung verified userid ', verifiedUserId)
    const query = 'SELECT * FROM accounts WHERE id = ?'
    db.query(query, [verifiedUserId], (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'no data found' })
        }
        else {
            res.status(200).json({ message: 'data found', result: result[0] })
        }
    })

})


app.post('/upload', upload.single('image'), (req, res) => {
    const username = req.body.username;
    const caption = req.body.caption;
    const userId = req.body.userId;
    console.log(username)
    cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (err, result) => {
        if (err) {
            console.log('error upload')
            res.status(400).json({ message: 'error uploading' })
        } else {
            const query = 'INSERT INTO images (username,caption,secure_url,public_id,userId,likeCount,commentCount) VALUES (?,?,?,?,?,?,?)'
            console.log(result.secure_url)
            console.log(result.public_id)
            db.query(query, [username, caption, result.secure_url, result.public_id, userId,0,0], (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'error uploading' })
                } else {

                    console.log('success upload!')
                    res.status(200).json({ message: 'success uploading' })
                }
            })
        }
    })
})

app.put('/uploadProfilePic', upload.single('image'), (req, res) => {
    const userId = req.body.userId;
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log('error ka')
            res.status(400).json({ message: 'error uploading to cloud' })
        } else {
            const query = 'UPDATE accounts SET profileImage = ? WHERE id = ?'
            db.query(query, [result.secure_url, userId], (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'error updating profile in database' })
                } else {
                    res.status(200).json({ message: 'success updating profile image' })
                }
            })
        }
    })
})


app.post('/getAll', (req, res) => {
    const query = 'SELECT * FROM images ORDER BY id DESC'
    db.query(query, (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'not found' })
        } else {
            console.log(result)
            res.status(200).json({ dataa: result })
        }
    })
})


app.post('/visitOtherProfile', (req, res) => {
    const userID = req.body
    console.log('eto ung nakuha user id ', userID)
    const query = 'SELECT * FROM accounts WHERE id = ?'
    db.query(query, [userID.userId], (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'no account found' })
        } else {
            console.log(result)
            res.status(200).json({ result: result[0] })
        }
    })
})


app.post('/viewProfileReq', (req, res) => {
    const userId = req.body.userId
    const query = 'SELECT secure_url FROM images WHERE userId = ? ORDER BY secure_url DESC'
    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'no post Found' })
        } else {
            res.status(200).json({ result: result })
        }
    })
})



app.post('/likeThisPost', (req, res) => {
    console.log('test')
    const postId = req.body.postId
    const userId = req.body.userId
    console.log(postId)
    console.log(userId)
    let alreadyLike = true;
    const query = 'INSERT INTO postthatlikee (postId,userId,alreadyLike) VALUES (?,?,?)'

    db.query(query, [postId, userId, alreadyLike], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error sa like' })
        } else {
            const query2 = 'UPDATE images SET likeCount = likeCount + 1 WHERE id = ?'
            db.query(query2, [postId], (err, result) => {
                if (err) {
                    res.status(401).json({ messag: 'error liking' })
                } else {
                    res.status(200).json({ message: 'success liking' })
                }
            })
        }
    })
})


app.post('/unlikeThisPost', (req, res) => {
    console.log('test')
    const postId = req.body.postId
    const userId = req.body.userId
    console.log(postId)
    console.log(userId)
    let alreadyLike = false;
    const query = 'UPDATE postthatlikee SET alreadyLike = ? WHERE postId =? && userId = ? '

    db.query(query, [alreadyLike, postId, userId], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error sa like' })
        } else {
            const query2 = 'UPDATE images SET likeCount = likeCount - 1 WHERE id = ?'
            db.query(query2, [postId], (err, result) => {
                if (err) {
                    res.status(401).json({ messag: 'error unliking' })
                } else {
                    res.status(200).json({ message: 'success unliking' })
                }
            })
        }
    })
})







app.post('/verifyIfAlreadyLike', (req, res) => {
    const postId = req.body.postId
    const userId = req.body.userId
    console.log('eto ung post id ', postId)
    const query = 'SELECT postId FROM postthatlikee WHERE postId = ? && userId = ? && alreadyLike = ? ORDER BY postId DESC'
    db.query(query, [postId, userId, true], (err, result) => {
        if (result.length) {
            res.status(200).json({ postId: result[0], alreadyLike: true })
        } else {
            res.send({ alreadyLike: false })
        }
    })
})




app.post('/addComment', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    const postId = req.body.postId
    const comment = req.body.comment
    const username = req.body.username
    const profileImage = req.body.profileImage
    const query = 'INSERT INTO comments (postId,userId,username,comment,profileImage) VALUES (?,?,?,?,?)'
    db.query(query, [postId, verifiedUserId, username, comment, profileImage], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error kasa comment' })
        } else {
            const query2 = 'UPDATE images SET commentCount = commentCount + 1 WHERE id = ?'
            db.query(query2, [postId], (err, result) => {
                if (err) {
                    res.status(401).json({ message: 'error kasa comment' })
                } else {
                    res.status(200).json({ message: 'succues ka sa comment' })
                }
            })

        }
    })
})


app.post('/viewCommentInPost', (req, res) => {
    const postId = req.body.postId
    const query = 'SELECT * FROM comments WHERE postId = ?'
    db.query(query, [postId], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'no comment found' })
        } else {
            res.status(200).json({ result: result })
        }
    })
})






app.post('/follow', authenticate, (req, res) => {
    const userIdOfFollower = req.userId
    const followedUserId = req.body.followUserId
    const query = 'INSERT INTO follower (followedUserId,userIdOfFollower) VALUES (?,?)'
    db.query(query, [followedUserId, userIdOfFollower], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error ka sa pag follow' })
        } else {
            const query2 = 'UPDATE accounts SET follower = follower + 1 WHERE id = ?'
            db.query(query2, [followedUserId], (err, result) => {
                if (err) {
                    res.status(401).json({ message: 'error ka sa pag follow' })
                } else {
                    const query3 = 'UPDATE accounts SET following = following + 1 WHERE id = ?'
                    db.query(query3, [userIdOfFollower], (err, result) => {
                        if (err) res.status(401).json({ message: 'error ka sa pag follow' })
                        res.status(200).json({ message: 'success sa fpag follow' })
                    })

                }
            })

        }
    })
})


app.post('/unfollow', authenticate, (req, res) => {
    const userIdOfFollower = req.userId
    const followedUserId = req.body.followUserId
    const query = 'DELETE FROM follower WHERE followedUserId = ? && userIdOfFollower = ?'
    db.query(query, [followedUserId, userIdOfFollower], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'error ka sa pag unfollow' })
        } else {
            const query2 = 'UPDATE accounts SET follower = follower - 1 WHERE id = ?'
            db.query(query2, [followedUserId], (err, result) => {
                if (err) {
                    res.status(401).json({ message: 'error ka sa pag unfollow' })
                } else {
                    const query3 = 'UPDATE accounts SET following = following - 1 WHERE id = ?'
                    db.query(query3, [userIdOfFollower], (err, result) => {
                        if (err) res.status(401).json({ message: 'error ka sa pag unfollow' })
                        res.status(200).json({ message: 'success sa fpag unfollow' })
                    })

                }
            })

        }
    })
})

app.post('/displayFollowers', (req, res) => {
    const userIdOfFollower = req.body.userId
    const query = 'SELECT userIdOfFollower FROM follower WHERE followedUserId = ? '
    db.query(query, [userIdOfFollower], (err, result) => {
        if (err) {
            console.log('error walang nakha')
        } else {
            console.log('gegege meron')

            const listOfFollowers = result.map(element => {
                return new Promise((resolve, reject) => {
                    console.log(element.userIdOfFollower)
                    const query2 = 'SELECT * FROM accounts WHERE id = ?'
                    db.query(query2, [element.userIdOfFollower], (err, result) => {
                        if (err) {
                            return reject(err)
                        } else {
                            return resolve(result[0])
                        }
                    });
                    console.log('eto dapat ung last')
                })

            })

            Promise.all(listOfFollowers)
                .then((followers) => {
                    res.status(200).json(followers)
                })
                .catch(() => {
                    res.status(500).json({ message: 'Failed to get follower accounts' });
                })






        }
    })
})


app.listen(port, () => {
    console.log('server is running ing port ', port)
})
