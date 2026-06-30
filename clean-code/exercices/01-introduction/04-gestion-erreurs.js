class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, query) {
    super(message);
    this.query = query;
  }
}

function validateUser(user) {
  if (!user) {
    throw new ValidationError("L'utilisateur est requis", 'user');
  }

  if (!user.name) {
    throw new ValidationError("Le nom d'utilisateur est requis", 'name');
  }

  if (typeof user.age !== 'number' || user.age <= 0) {
    throw new ValidationError("L'age doit etre un nombre positif", 'age');
  }

  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new ValidationError('Email invalide', 'email');
  }
}

function saveUserToDatabase(user) {
  if (Math.random() < 0.3) {
    throw new DatabaseError('Impossible de se connecter a la base de donnees', 'INSERT INTO users');
  }

  return { id: Math.floor(Math.random() * 1000), ...user };
}

function logError(error) {
  console.error(`[${new Date().toISOString()}] ERROR`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    additionalInfo: error.query || error.field || null,
  });
}

async function registerUser(userData) {
  try {
    validateUser(userData);

    const normalizedUser = {
      ...userData,
      name: userData.name.trim(),
      email: userData.email.toLowerCase(),
    };

    const savedUser = await Promise.resolve(saveUserToDatabase(normalizedUser));

    return {
      success: true,
      user: savedUser,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field,
        },
      };
    }

    if (error instanceof DatabaseError) {
      logError(error);
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: 'Une erreur systeme est survenue, reessayez plus tard.',
        },
      };
    }

    logError(error);
    return {
      success: false,
      error: {
        type: 'UNKNOWN_ERROR',
        message: 'Une erreur inattendue est survenue.',
      },
    };
  }
}

async function runTests() {
  const testCases = [
    { name: 'Alice', age: 30, email: 'alice@example.com' },
    { name: '', age: 25, email: 'bob@example.com' },
    { name: 'Charlie', age: -5, email: 'charlie@example.com' },
    { name: 'David', age: 40, email: 'invalid-email' },
    null,
  ];

  for (const testCase of testCases) {
    const result = await registerUser(testCase);
    console.log(result);
  }
}

runTests();
