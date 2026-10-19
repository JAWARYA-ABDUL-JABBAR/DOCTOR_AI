import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'Interface Doctor AI',description:'Diagnose. Redesign. Perfect.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
