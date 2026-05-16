require("dotenv").config()

const dbService = require("../services/db.service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Customers = require("../model/customers.model")
const axios = require("axios")

const loginFunc = async (req, res, schema) => {

    try {

        const { email, password, turnstileToken } = req.body;

        console.log("TURNSTILE TOKEN:", turnstileToken);

        // Verify Cloudflare Turnstile

        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        const verificationResponse = await axios.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",

            new URLSearchParams({
                secret: secretKey,
                response: turnstileToken,
            }),

            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        // Block login if Turnstile verification fails

        if (!verificationResponse.data.success) {

            console.log("TURNSTILE FAILED");

            return res.status(400).json({
                message: "Turnstile verification failed",
                isLogged: false
            });
        }

        const query = {
            email
        }

        const dbRes = await dbService.findOneRecord(query, schema)

        console.log(dbRes)

        if (dbRes) {

            const isMatch = await bcrypt.compare(password, dbRes.password)

            if (isMatch) {

                if (dbRes.isActive) {

                    delete dbRes._doc.password

                    const db = await Customers.findOne(
                        { email },
                        { _id: 0, accountNo: 1 }
                    )

                    let payload = null

                    db ?

                        payload = {
                            ...dbRes._doc,
                            _id: dbRes._id.toString(),
                            accountNo: db.accountNo
                        }

                        :

                        payload = {
                            ...dbRes._doc,
                            _id: dbRes._id.toString()
                        }

                    const token = await jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: "3h" }
                    )

                    return res.status(200).json({
                        message: "Data found !",
                        isLoged: true,
                        token,
                        userType: dbRes._doc.userType
                    })

                } else {

                    return res.status(401).json({
                        message: "You are not active member !",
                        isLoged: false,
                    })
                }

            } else {

                return res.status(401).json({
                    message: "Invalid Credentials",
                    isLoged: false,
                })
            }

        } else {

            return res.status(401).json({
                message: "Invalid Credentials",
                isLogged: false,
            })
        }

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error !",
            isLogged: false,
            error
        })
    }

}

module.exports = {
    loginFunc
}