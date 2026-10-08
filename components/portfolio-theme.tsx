"use client";
import {useEffect,useState,type ReactNode} from "react";
import {ThemeProvider,useTheme} from "next-themes";
import {Moon,Sun} from "lucide-react";
export function PortfolioTheme({children}:{children:ReactNode}){return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="mba-steins-theme" disableTransitionOnChange>{children}</ThemeProvider>;}
export function ThemeSwitch(){const {resolvedTheme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);const night=mounted&&resolvedTheme==="dark";return <button className="theme-switch" type="button" aria-label={`Switch to ${night?"day":"night"} theme`} title={`Switch to ${night?"day":"night"} theme`} disabled={!mounted} onClick={()=>setTheme(night?"light":"dark")}><span className="theme-switch-orbit" aria-hidden="true">{night?<Sun size={20}/>:<Moon size={20}/>}</span><span>{night?"Day":"Night"}</span></button>;}
