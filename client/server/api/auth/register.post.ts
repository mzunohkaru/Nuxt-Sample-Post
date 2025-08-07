// import { getDB } from "../../utils/db"
// import { hashPassword, generateAuthToken } from "../../utils/auth"

// export default defineEventHandler(async (event) => {
//   try {
//     const body = await readBody(event)
    
//     // バリデーション
//     if (!body.username || !body.email || !body.password) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: "ユーザー名、メールアドレス 