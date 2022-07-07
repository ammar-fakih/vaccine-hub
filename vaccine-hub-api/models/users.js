const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      location: user.location,
    };
  }
  static async login(credentials) {
    const requiredFields = ['email', 'password'];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing required field: ${field}`);
      }
    });

    const user = await this.fetchUserByEmail(credentials.email);

    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return this.makePublicUser(user);
      }
    } else {
      console.log('user not found');
    }

    throw new UnauthorizedError('Invalid email/password combo');
  }
  static async register(credentials) {
    const requiredFields = [
      'email',
      'password',
      'firstName',
      'lastName',
      'location',
    ];

    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        console.log(field);
        throw new BadRequestError(`Missing required field: ${field}`);
      }
    });

    const existingUser = await this.fetchUserByEmail(credentials.email);
    console.log('existingUser', existingUser);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }

    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );

    const lowerCasedEmail = credentials.email.toLowerCase();

    const result = await db.query(
      `
    INSERT INTO users (email, password, first_name, last_name, location)
    
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, password, first_name, last_name, location`,
      [
        lowerCasedEmail,
        hashedPassword,
        credentials.firstName,
        credentials.lastName,
        credentials.location,
      ]
    );

    const user = result.rows[0];

    return this.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError('Missing required field: email');
    }
    const query = `SELECT * FROM users WHERE email = $1`;

    const result = await db.query(query, [email.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
