const bcryptjs = require('bcryptjs');

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
}

module.exports = User;
