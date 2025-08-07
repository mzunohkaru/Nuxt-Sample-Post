import type {
  Post,
  LoginRequest,
  RegisterRequest,
  CreatePostRequest,
  UpdatePostRequest,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  MeResponse,
  PostsResponse,
  CreatePostResponse,
} from "./index";

// ===== APIエンドポイント型 =====

/**
 * 認証API
 */
export interface AuthApi {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  register(userData: RegisterRequest): Promise<RegisterResponse>;
  me(): Promise<MeResponse>;
  logout(): Promise<void>;
}

/**
 * 投稿API
 */
export interface PostsApi {
  getPosts(): Promise<PostsResponse>;
  createPost(postData: CreatePostRequest): Promise<CreatePostResponse>;
  updatePost(
    id: number,
    postData: UpdatePostRequest
  ): Promise<ApiResponse<Post>>;
  deletePost(id: number): Promise<ApiResponse<void>>;
  getPost(id: number): Promise<ApiResponse<Post>>;
}

/**
 * APIクライアント
 */
export interface ApiClient {
  auth: AuthApi;
  posts: PostsApi;
}

// ===== HTTP関連型 =====

/**
 * HTTPメソッド
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * APIリクエストオプション
 */
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown; // any から unknown に変更
  params?: Record<string, string | number>;
  timeout?: number;
}

/**
 * APIエラー
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public response?: unknown, // any から unknown に変更
  ) {
    super(`API Error ${statusCode}: ${statusMessage}`);
    this.name = "ApiError";
  }
}

// ===== レスポンス型ガード =====

/**
 * 成功レスポンスかどうかチェック
 */
export const isSuccessResponse = <T>(
  response: unknown, // any から unknown に変更
): response is ApiResponse<T> => {
  return response && typeof response === "object" && response.success === true;
};

/**
 * エラーレスポンスかどうかチェック
 */
export const isErrorResponse = (
  response: unknown, // any から unknown に変更
): response is ApiResponse<never> => {
  return response && typeof response === "object" && response.success === false;
};
