import {body} from 'express-validator';

export const register = [
    body('email','Wrong email format').isEmail(),
    body('password','Password should be longer than 5 symbols').isLength({min: 5}),
    body('userName','Username should be longer than 3 symbols').isLength({min: 3}),
];

export const login = [
    body('email','Wrong email format').isEmail(),
    body('password','Password should be longer than 5 symbols').isLength({min: 5}),
];