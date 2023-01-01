const bcryptjs = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database')

class User {
    constructor(email, password, fullname, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postal: postal,
            city: city
        };
    }

    async signUp() {
        const hashedPw = await bcryptjs.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPw,
            name: this.name,
            address: this.address
        });
    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({_id: uid}, {projection: {password: 0}});
    }

    getUserWithEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async existAlready() {
        const existingUser = await this.getUserWithEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    comparePassword(hashedPw) {
        return bcryptjs.compare(this.password, hashedPw);
    }
}

module.exports = User;
