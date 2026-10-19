import jwt from 'jsonwebtoken';import {cookies} from 'next/headers';
export const COOKIE='debugmd_session';
export type Session={sub:string;email:string};
export function signSession(s:Session){const secret=process.env.SESSION_SECRET;if(!secret)throw new Error('SESSION_SECRET is not configured');return jwt.sign(s,secret,{expiresIn:'7d'})}
export function currentUser():Session|null{const secret=process.env.SESSION_SECRET;if(!secret)return null;const value=cookies().get(COOKIE)?.value;if(!value)return null;try{return jwt.verify(value,secret) as Session}catch{return null}}
