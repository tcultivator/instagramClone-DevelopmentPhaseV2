const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const upload = require('./middleware/multer');
const cloudinary = require('./util/cloudinary')
const nodemailer = require('nodemailer')
const app = express()
const http = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(http, {
    cors: {
        origin: 'https://tcultivator.github.io',
        credentials: true
    }
})
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



io.on('connection', (socket) => {
    console.log('A client connected');


    socket.on('idOfThis', ({postIdOfyouwantToComment,commentCount}) => {
        console.log('eto ung galing sa socket io')
        console.log(postIdOfyouwantToComment)
        socket.broadcast.emit('idOfCommentFromIO', {postIdOfyouwantToComment,commentCount})
    })

    socket.on('userLikeThisPost', ({ postId, likeCount }) => {
        socket.broadcast.emit('userLikeFromIO', { postId, likeCount })
    })
    socket.on('userunLikeThisPost', ({ postId, likeCount }) => {
        socket.broadcast.emit('userunLikeFromIO', { postId, likeCount })
    })


    socket.on('disconnect', () => {
        console.log('A client disconnected');

    });
});



app.post('/loginReq', (req, res) => {
    const userData = req.body
    const query = 'SELECT * FROM accounts WHERE email = ? && password = ?'
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


app.post('/verifyIfAlreadyFollow', (req, res) => {
    const followUserId = req.body.followUserId
    const userId = req.body.userId

    const query = 'SELECT * FROM follower WHERE followedUserId = ? && userIdOfFollower = ?'
    db.query(query, [followUserId, userId], (err, result) => {
        if (result.length) {
            res.status(200).json({ alreadyFollow: true })
        } else {
            res.send({ alreadyFollow: false })
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




app.post('/displayFollowing', (req, res) => {
    const userIdOfFollower = req.body.userId
    const query = 'SELECT followedUserId FROM follower WHERE userIdOfFollower = ? '
    db.query(query, [userIdOfFollower], (err, result) => {
        if (err) {
            console.log('error walang nakha')
        } else {
            console.log('gegege meron')

            const listOfFollowing = result.map(element => {
                return new Promise((resolve, reject) => {
                    console.log(element.followedUserId)
                    const query2 = 'SELECT * FROM accounts WHERE id = ?'
                    db.query(query2, [element.followedUserId], (err, result) => {
                        if (err) {
                            return reject(err)
                        } else {
                            return resolve(result[0])
                        }
                    });
                    console.log('eto dapat ung last')
                })

            })

            Promise.all(listOfFollowing)
                .then((following) => {
                    res.status(200).json(following)
                })
                .catch(() => {
                    res.status(500).json({ message: 'Failed to get follower accounts' });
                })

        }
    })
})


app.post('/uploadStory', upload.single('image'), (req, res) => {
    const username = req.body.username;
    const userId = req.body.userId;
    cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (err, result) => {
        console.log(result)
        if (err) {
            res.status(400).json({ message: 'error uploading story' })
            console.log('error uploading story')
        } else {
            console.log(result.secure_url)
            const date = new Date()
            const formattedDate = date.toISOString().split('T')[0];
            console.log(formattedDate)
            console.log(username)
            console.log(userId)
            const query = 'INSERT INTO story (userId,username,secure_url,datePosted,viewCount)VALUES(?,?,?,?,?)'
            db.query(query, [userId, username, result.secure_url, formattedDate,0], (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'error inserting to database' })
                    console.log('error inserting to database')
                } else {
                    res.status(200).json({ message: 'success inserting Story' })
                }
            })
        }


    })
})

app.post('/getStories', (req, res) => {
    const query = 'SELECT * FROM story ORDER BY id DESC'
    db.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: 'no story found' })
        } else {
            res.status(200).json(result)
        }
    })
})

app.post('/getStoryViewCount', (req, res) => {
    const storyId = req.body.idOfElemt;
    const userId = req.body.userId;
    const username = req.body.username;
    const profileImage = req.body.profileImage;
    const query1 = 'SELECT * FROM storyviewer WHERE storyId = ? && userId = ?'
    db.query(query1, [storyId, userId], (err, result) => {
        if (result.length) {
            const query5 = 'SELECT viewCount FROM story WHERE id = ?'
            db.query(query5, [storyId], (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'error sa pag kuha ng viewCount' })
                } else {
                    res.status(200).json(result)
                }
            })
        } else {
            const query2 = 'INSERT INTO storyviewer (storyId,userId,username,secure_url)VALUES(?,?,?,?)'
            db.query(query2, [storyId, userId, username, profileImage], (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'error sa pag insert ng info ng viewer' })
                } else {
                    const query3 = 'UPDATE story SET viewCount = viewCount + 1 WHERE id = ?'
                    db.query(query3, [storyId], (err, result) => {
                        if (err) {
                            res.status(400).json({ message: 'error sa pag update ng view count ng story' })
                        } else {
                            const query4 = 'SELECT viewCount FROM story WHERE id = ?'
                            db.query(query4, [storyId], (err, result) => {
                                if (err) {
                                    res.status(400).json({ message: 'error sa pag kuha ng viewCount' })
                                } else {
                                    res.status(200).json(result)
                                }
                            })
                        }
                    })
                }
            })
        }
    })

})



app.post('/getAllStoryViewer', (req, res) => {
    const storyId = req.body.storyId
    const query = 'SELECT * FROM storyviewer WHERE storyId = ?'
    db.query(query, [storyId], (err, result) => {
        if (err) {
            res.status(400).json({ message: 'error sa pagkuha ng viewer' })
        } else {
            res.status(200).json(result)
        }
    })
})


app.post('/sendStoryReactions', (req, res) => {
    const reactionsArr = req.body.reactionsArr;
    const selectedStoryId = req.body.selectedStoryId;
    const loginUserId = req.body.loginUserId;
    console.log(reactionsArr)
    const query = 'UPDATE storyviewer SET reactions = ? WHERE storyId = ? && userId = ?'
    db.query(query, [reactionsArr, selectedStoryId, loginUserId], (err, result) => {
        if (err) {
            console.log('error ka sa send reactoo')
            res.status(400).json({ message: 'erro sending reactions' })
        } else {
            console.log('success sa send react')
            res.status(200).json({ message: 'success send reactions' })
        }
    })
})




app.post('/logout', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    if (verifiedUserId) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(200).json({ message: 'success logout' })
    } else {
        res.status(400).json({ message: 'error logout' })
    }
})








app.post('/changeUserInfo', authenticate, (req, res) => {
    console.log('eto 1')
    const userId = req.userId
    const username = req.body.username
    const email = req.body.email
    const address = req.body.address
    const age = req.body.age
    const bio = req.body.bio
    const query = 'UPDATE accounts SET username = ? , email = ? , address = ? , age = ? , bio = ? WHERE id = ?'
    db.query(query, [username,email,address,age,bio, userId], (err, result) => {
        console.log('eto 2')
        if (err) {
            res.status(400).json({ message: 'error update username' })
        } else {
            const query2 = 'UPDATE images SET username = ? WHERE userId = ?'
            db.query(query2, [username, userId], (err, result) => {
                console.log('eto 3')
                if (err) {
                    res.status(400).json({ message: 'error update userInfo' })
                } else {
                    const query3 = 'UPDATE story SET username = ? WHERE userId = ?'
                    db.query(query3, [username, userId], (err, result) => {
                        console.log('eto 4')
                        if (err) {
                            res.status(400).json({ message: 'error update userInfo' })
                        } else {
                            const query4 = 'UPDATE storyviewer SET username = ? WHERE userId = ?'
                            db.query(query4, [username, userId], (err, result) => {
                                console.log('eto 5')
                                if (err) {
                                    res.status(400).json({ message: 'error update userInfo' })
                                } else {
                                    const query5 = 'UPDATE comments SET username = ? WHERE userId = ?'
                                    db.query(query5, [username, userId], (err, result) => {
                                        console.log('eto 6')
                                        if (err) {
                                            res.status(400).json({ message: 'error update userInfo' })
                                        } else {
                                            res.status(200).json({ message: 'success update userInfo' })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }
    })
})



app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    let random6Digit = Math.floor(100000 + Math.random() * 900000);
    const query = 'SELECT * FROM accounts WHERE email = ?'
    db.query(query, [email], (err, result) => {
        if (result.length) {
            res.status(400).json({ message: 'Email is already use' })
        } else {
            let verificationCode = random6Digit.toString()
            sendMail(email, 'Verification Code', verificationCode)
            res.status(200).json({ digitcode6: random6Digit, email: email, password: password, username: username, message: 'Verification Sent' })
        }
    })
})





app.post('/submitPersonalInfo', (req, res) => {
    const username = req.body.username;
    const address = req.body.address;
    const age = req.body.age;
    const email = req.body.email;
    const query = 'UPDATE accounts SET username = ? , address = ? , age = ? WHERE email = ?'
    db.query(query, [username, address, age, email], (err, result) => {
        if (err) {
            res.status(400).json({ message: 'Error setup personal information' })
        } else {
            res.status(200).json({ message: 'Success Setup Personal Information' })
        }
    })
})




const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.NODEMAILER_HOST,
    port: 465,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
})

function sendMail(to, sub, message) {
    transporter.sendMail({
        to: to,
        sub: sub,
        html: message
    })
    console.log('message Sent')
}



app.post('/submitRegister', (req, res) => {
    const email = req.body.postRegisterEmail;
    const username = req.body.postRegisterUsername;
    const password = req.body.postRegisterPassword;
    const defaultProfileImage = 'https://res.cloudinary.com/debbskjyl/image/upload/v1752751427/default_gulcfq.jpg';
    const query = 'INSERT INTO accounts (username,email,password,profileImage,address,age,bio,follower,following) VALUES (?,?,?,?,?,?,?,?,?)'
    db.query(query, [username, email, password,defaultProfileImage,'Not set',0,'Not set',0,0], (err, result) => {
        if (err) {
            res.status(400).json({ message: 'error registering' })
        } else {
            res.status(200).json({ message: 'success registering' })
        }
    })
})


app.post('/sendForgotpassword', (req, res) => {
    const email = req.body.email;
    const query = 'SELECT password FROM accounts WHERE email = ?'
    db.query(query, [email], (err, result) => {
        if (!result.length) {
            res.status(400).json({ message: 'No account Found!' })
        } else {
            const returnPassword = result[0].password
            sendMail(email, 'Your Password', returnPassword)
            res.status(200).json({ message: 'Your password send to your email!' })
        }
    })
})

http.listen(port, () => {
    console.log('server is running ing port ', port)
})
