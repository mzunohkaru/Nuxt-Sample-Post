// ===== 基本的なデータベースエンティティ =====

/**
 * ユーザーエンティティ
 */
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

/**
 * ユーザーエンティティ（パスワードハッシュ付き）- サーバーサイドのみ
 */
export interface UserWithPassword extends User {
  password_hash: string;
}

/**
 * 投稿エンティティ
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

// ===== APIリクエスト型 =====

/**
 * ログインリクエスト
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * ユーザー登録リクエスト
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * 投稿作成リクエスト
 */
export interface CreatePostRequest {
  title: string;
  content: string;
}

/**
 * 投稿更新リクエスト
 */
export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

// ===== APIレスポンス型 =====

/**
 * 基本的なAPIレスポンス
 */
export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

/**
 * データ付きAPIレスポンス
 */
export interface ApiResponse<T = unknown> extends BaseApiResponse {
  // any から unknown に変更
  data: T;
}

/**
 * エラーレスポンス
 */
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  statusCode: number;
  statusMessage: string;
}

/**
 * ログインレスポンス
 */
export interface LoginResponse extends BaseApiResponse {
  success: true;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

/**
 * ユーザー登録レスポンス
 */
export interface RegisterResponse extends BaseApiResponse {
  success: true;
  message: string;
  user: User;
  token: string;
}

/**
 * 現在のユーザー情報レスポンス
 */
export interface MeResponse extends BaseApiResponse {
  success: true;
  data: {
    user: User;
  };
}

/**
 * 投稿一覧レスポンス
 */
export interface PostsResponse extends BaseApiResponse {
  success: true;
  data: Post[];
}

/**
 * 投稿作成レスポンス
 */
export interface CreatePostResponse extends BaseApiResponse {
  success: true;
  data: Post;
}

// ===== 認証関連型 =====

/**
 * JWTペイロード
 */
export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

/**
 * 認証状態
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// ===== フォーム型 =====

/**
 * ログインフォーム
 */
export interface LoginForm {
  username: string;
  password: string;
}

/**
 * 登録フォーム
 */
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 投稿フォーム
 */
export interface PostForm {
  title: string;
  content: string;
}

// ===== バリデーション型 =====

/**
 * フィールドエラー
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

// ===== ユーティリティ型 =====

/**
 * ページネーション情報
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> extends BaseApiResponse {
  success: true;
  data: T[];
  pagination: Pagination;
}

/**
 * ソート順序
 */
export type SortOrder = "asc" | "desc";

/**
 * ソート情報
 */
export interface SortInfo {
  field: string;
  order: SortOrder;
}

// ===== 状態管理型 =====

/**
 * ローディング状態
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * API呼び出し状態
 */
export interface ApiCallState<T = unknown> {
  // any から unknown に変更
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
}

// ===== Composables型 =====

/**
 * useAuth composableの戻り値
 */
export interface UseAuthReturn {
  user: Ref<User | null>;
  isAuthenticated: Ref<boolean>;
  isLoading: Ref<boolean>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * usePosts composableの戻り値
 */
export interface UsePostsReturn {
  posts: Ref<Post[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  fetchPosts: () => Promise<void>;
  createPost: (postData: CreatePostRequest) => Promise<void>;
  updatePost: (id: number, postData: UpdatePostRequest) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

// ===== 設定型 =====

/**
 * APIクライアント設定
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * アプリケーション設定
 */
export interface AppConfig {
  api: ApiClientConfig;
  auth: {
    tokenKey: string;
    redirectAfterLogin: string;
    redirectAfterLogout: string;
  };
}
