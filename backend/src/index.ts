import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign } from 'hono/jwt'
import * as bcrypt from 'bcryptjs'

const saltRound = 10

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup', async(c) =>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate())
    const body = await c.req.json();
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
      return c.json({error: 'Error while signing up'})
    }

})

app.post('/api/v1/user/signin', async (c) =>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate())

  const body = await c.req.json();
  
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

app.post('/api/v1/blog', (c) =>{
  return c.text('Blog route')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Update blog route')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param("id")
  return c.text(`Get blog with ${id}`)
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text(`Get all blogs`)
})

export default app
