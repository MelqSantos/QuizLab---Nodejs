-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('PROFESSOR', 'ALUNO')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    theme VARCHAR(100),
    created_by UUID NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 10,
    penalty INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alternatives
CREATE TABLE alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- Garante apenas 1 alternativa correta por pergunta
CREATE UNIQUE INDEX unique_correct_alternative
ON alternatives (question_id)
WHERE is_correct = TRUE;

-- Quiz participants
CREATE TABLE quiz_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    total_score INTEGER DEFAULT 0,
    participated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (quiz_id, user_id)
);

-- Answers
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    alternative_id UUID NOT NULL REFERENCES alternatives(id),
    user_id UUID NOT NULL REFERENCES users(id),
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (question_id, user_id)
);

-- índices
CREATE INDEX idx_quiz_participants_quiz
ON quiz_participants (quiz_id);

CREATE INDEX idx_quiz_participants_score
ON quiz_participants (quiz_id, total_score DESC);

CREATE INDEX idx_answers_user
ON answers (user_id);

CREATE INDEX idx_answers_question
ON answers (question_id);


-- Inserts iniciais

INSERT INTO users (name, email, password_hash, role)
VALUES (
    'Professor João',
    'joao@escola.com',
    'hash_senha_professor',
    'PROFESSOR'
);

INSERT INTO users (name, email, password_hash, role)
VALUES
('Ana', 'ana@escola.com', 'hash_senha', 'ALUNO'),
('Bruno', 'bruno@escola.com', 'hash_senha', 'ALUNO'),
('Carlos', 'carlos@escola.com', 'hash_senha', 'ALUNO');


-- quiz
INSERT INTO quizzes (title, class_name, theme, created_by)
SELECT
    'Revisão de Matemática',
    '7º Ano A',
    'Frações',
    id
FROM users
WHERE role = 'PROFESSOR'
LIMIT 1;

-- Pergunta
INSERT INTO questions (quiz_id, statement, points)
SELECT
    q.id,
    'Quanto é 1/2 + 1/4?',
    10
FROM quizzes q
LIMIT 1;

-- alternativas da pergunta
INSERT INTO alternatives (question_id, description, is_correct)
SELECT qu.id, '3/4', TRUE
FROM questions qu
LIMIT 1;

INSERT INTO alternatives (question_id, description, is_correct)
SELECT qu.id, '2/4', FALSE
FROM questions qu
LIMIT 1;

INSERT INTO alternatives (question_id, description, is_correct)
SELECT qu.id, '1/6', FALSE
FROM questions qu
LIMIT 1;

-- Participação dos alunos no quiz
INSERT INTO quiz_participants (quiz_id, user_id)
SELECT q.id, u.id
FROM quizzes q
JOIN users u ON u.role = 'ALUNO';
