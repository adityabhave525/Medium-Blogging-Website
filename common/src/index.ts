import {z} from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string() 
})

export const updatePostSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional() 
})

export type SignupType = z.infer<typeof signupSchema>
export type SigninType = z.infer<typeof signinSchema>
export type CreatePostType = z.infer<typeof createPostSchema>
export type UpdatePostType = z.infer<typeof updatePostSchema>


