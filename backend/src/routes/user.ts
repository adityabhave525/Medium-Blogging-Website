import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

import { jwt, sign, verify } from 'hono/jwt'
import * as bcrypt from 'bcryptjs'

import { signupSchema, signinSchema } from "@adityatheprogrammer/common";

const saltRound = 10


export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
      }
}>();


userRouter.post('/signup', async(c) =>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())

      const body = await c.req.json();
      const {success} = signupSchema.safeParse(body);
      if(!success){
        c.status(400)
        return c.json({error: "Invalid inputs"})
      }
      const hash = await bcrypt.hash(body.password, saltRound)
      try{
        const user = await prisma.user.create({
          data:{
            email: body.email,
            password: hash
          }
        })
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
        return c.text(jwt)
      }catch(e){
        c.status(403)
        // console.log(e);        
        return c.json({error: e})
      }
  
  })
  
  userRouter.post('/signin', async (c) =>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const {success} = signinSchema.safeParse(body);
      if(!success){
        c.status(400)
        return c.json({error: "Invalid inputs"})
      }
    
    const user = await prisma.user.findUnique({
      where:{
        email: body.email
      }
    })
  
    
    if(!user){
      c.status(403);
      return c.json({error: "user not found"})
    }
    
    const isMatch = await bcrypt.compare(body.password, user.password)
  
    if(isMatch){
      const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
      return c.json({jwt});
    }
  
    c.status(403);
    return c.json({error: "Password Wrong bro"})
    
    
  })
  