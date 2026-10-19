import {z} from 'zod';

const tone=z.enum(['navy','blue','violet','slate','white','soft']);
const align=z.enum(['left','center']);
const gap=z.enum(['sm','md','lg']);
const columns=z.enum(['one','two','three']);
const base=z.object({id:z.string().min(1).max(50),tone:tone.optional(),align:align.optional(),gap:gap.optional()}).strict();
const leaf=z.discriminatedUnion('type',[
  base.extend({type:z.literal('heading'),text:z.string().min(1).max(160),level:z.union([z.literal(1),z.literal(2),z.literal(3)])}).strict(),
  base.extend({type:z.literal('text'),text:z.string().min(1).max(500)}).strict(),
  base.extend({type:z.literal('button'),text:z.string().min(1).max(60),variant:z.enum(['primary','secondary','ghost'])}).strict(),
  base.extend({type:z.literal('image'),src:z.string().max(500),alt:z.string().min(1).max(160),aspect:z.enum(['wide','square'])}).strict(),
]);
type NodeInput=z.input<typeof leaf>|(z.input<typeof base>&{type:'section'|'stack'|'grid'|'card'|'nav';columns?:z.input<typeof columns>;children:NodeInput[]});
export const nodeSchema:z.ZodType<NodeInput>=z.lazy(()=>z.union([leaf,base.extend({type:z.enum(['section','stack','grid','card','nav']),columns:columns.optional(),children:z.array(nodeSchema).min(1).max(20)}).strict()]));
export const redesignSchema=z.object({title:z.string().min(1).max(120),rationale:z.string().min(1).max(800),addressesFindingIds:z.array(z.string().max(50)).max(30),root:nodeSchema}).strict().superRefine((spec,ctx)=>{let count=0;const ids=new Set<string>();function visit(n:NodeInput,depth:number){count++;if(depth>6)ctx.addIssue({code:'custom',message:'Component tree exceeds depth limit'});if(ids.has(n.id))ctx.addIssue({code:'custom',message:`Duplicate component id: ${n.id}`});ids.add(n.id);if('children'in n)n.children.forEach(c=>visit(c,depth+1));if(n.type==='image'&&!isSafeImage(n.src))ctx.addIssue({code:'custom',message:'Image URL is not allowlisted'});}visit(spec.root,1);if(count>80)ctx.addIssue({code:'custom',message:'Component count exceeds limit'});});
export type RedesignSpec=z.infer<typeof redesignSchema>;export type RedesignNode=RedesignSpec['root'];
function isSafeImage(src:string){return src.startsWith('/api/screenshots/')||/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(src)}
export const demoRedesign:RedesignSpec={title:'Clearer product landing experience',rationale:'Demo redesign applies stronger hierarchy, consistent spacing, readable supporting copy, and one prominent primary action.',addressesFindingIds:['demo-1','demo-2','demo-3'],root:{id:'page',type:'stack',tone:'white',gap:'lg',children:[{id:'nav',type:'nav',children:[{id:'brand',type:'heading',level:3,text:'Northstar'},{id:'nav-action',type:'button',text:'Get started',variant:'secondary'}]},{id:'hero',type:'section',tone:'soft',align:'center',gap:'lg',children:[{id:'eyebrow',type:'text',text:'A BETTER WAY TO WORK'},{id:'headline',type:'heading',level:1,text:'Build momentum, without the busywork.'},{id:'copy',type:'text',text:'Bring your team, priorities, and progress into one focused workspace.'},{id:'cta',type:'button',text:'Start free today',variant:'primary'}]},{id:'features',type:'grid',columns:'three',gap:'md',children:['Plan with clarity','Move faster together','See real progress'].map((text,i)=>({id:`card-${i}`,type:'card',children:[{id:`card-h-${i}`,type:'heading',level:3,text},{id:`card-p-${i}`,type:'text',text:'A focused workflow with clear ownership and useful context.'}]}))}]}};
