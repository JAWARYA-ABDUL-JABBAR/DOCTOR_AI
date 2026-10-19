const attempts=new Map<string,{count:number;reset:number}>();
export function canAttempt(key:string){const now=Date.now(),old=attempts.get(key);if(!old||old.reset<now){attempts.set(key,{count:1,reset:now+10*60_000});return true}if(old.count>=6)return false;old.count++;return true}
export function clearAttempts(key:string){attempts.delete(key)}
