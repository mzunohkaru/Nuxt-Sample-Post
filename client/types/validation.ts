import type {
  LoginForm,
  RegisterForm,
  PostForm,
  ValidationResult,
} from "./index";

// ===== バリデーションルール =====

/**
 * ユーザー名のバリデーション
 */
export const validateUsername = (username: string): string[] => {
  const errors: string[] = [];

  if (!username) {
    errors.push("ユーザー名は必須です");
  } else if (username.length < 3) {
    errors.push("ユーザー名は3文字以上である必要があります");
  } else if (username.length > 50) {
    errors.push("ユーザー名は50文字以下である必要があります");
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("ユーザー名は英数字とアンダースコアのみ使用できます");
  }

  return errors;
};

/**
 * メールアドレスのバリデーション
 */
export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];

  if (!email) {
    errors.push("メールアドレスは必須です");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("有効なメールアドレスを入力してください");
  } else if (email.length > 255) {
    errors.push("メールアドレスは255文字以下である必要があります");
  }

  return errors;
};

/**
 * パスワードのバリデーション
 */
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (!password) {
    errors.push("パスワードは必須です");
  } else if (password.length < 8) {
    errors.push("パスワードは8文字以上である必要があります");
  } else if (password.length > 255) {
    errors.push("パスワードは255文字以下である必要があります");
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push("パスワードは大文字、小文字、数字を含む必要があります");
  }

  return errors;
};

/**
 * 投稿タイトルのバリデーション
 */
export const validatePostTitle = (title: string): string[] => {
  const errors: string[] = [];

  if (!title) {
    errors.push("タイトルは必須です");
  } else if (title.trim().length === 0) {
    errors.push("タイトルを入力してください");
  } else if (title.length > 255) {
    errors.push("タイトルは255文字以下である必要があります");
  }

  return errors;
};

/**
 * 投稿内容のバリデーション
 */
export const validatePostContent = (content: string): string[] => {
  const errors: string[] = [];

  if (!content) {
    errors.push("内容は必須です");
  } else if (content.trim().length === 0) {
    errors.push("内容を入力してください");
  } else if (content.length > 10000) {
    errors.push("内容は10000文字以下である必要があります");
  }

  return errors;
};

// ===== フォームバリデーション関数 =====

/**
 * ログインフォームのバリデーション
 */
export const validateLoginForm = (form: LoginForm): ValidationResult => {
  const errors: { field: string; message: string }[] = [];

  const usernameErrors = validateUsername(form.username);
  usernameErrors.forEach((message) => {
    errors.push({ field: "username", message });
  });

  if (!form.password) {
    errors.push({ field: "password", message: "パスワードは必須です" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 登録フォームのバリデーション
 */
export const validateRegisterForm = (form: RegisterForm): ValidationResult => {
  const errors: { field: string; message: string }[] = [];

  const usernameErrors = validateUsername(form.username);
  usernameErrors.forEach((message) => {
    errors.push({ field: "username", message });
  });

  const emailErrors = validateEmail(form.email);
  emailErrors.forEach((message) => {
    errors.push({ field: "email", message });
  });

  const passwordErrors = validatePassword(form.password);
  passwordErrors.forEach((message) => {
    errors.push({ field: "password", message });
  });

  if (form.password !== form.confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "パスワードが一致しません",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 投稿フォームのバリデーション
 */
export const validatePostForm = (form: PostForm): ValidationResult => {
  const errors: { field: string; message: string }[] = [];

  const titleErrors = validatePostTitle(form.title);
  titleErrors.forEach((message) => {
    errors.push({ field: "title", message });
  });

  const contentErrors = validatePostContent(form.content);
  contentErrors.forEach((message) => {
    errors.push({ field: "content", message });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
