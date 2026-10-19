import {Pool,PoolClient} from 'pg';
const globalDb=globalThis as unknown as {pool?:Pool};
export const pool=globalDb.pool??new Pool({connectionString:process.env.DATABASE_URL,max:5});
if(process.env.NODE_ENV!=='production')globalDb.pool=pool;
export async function owned<T>(userId:string,fn:(c:PoolClient)=>Promise<T>){const c=await pool.connect();try{await c.query('begin');await c.query("select set_config('app.user_id',$1,true)",[userId]);const out=await fn(c);await c.query('commit');return out}catch(e){await c.query('rollback');throw e}finally{c.release()}}
